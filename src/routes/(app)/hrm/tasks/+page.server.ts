import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const getTasks = await fetch(`${PUBLIC_API_ENDPOINT}api/hrm/tasks/`);
	const getManagers = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/users/?is_manager=true`);

	if (getTasks.ok && getManagers.ok) {
		const allTasks = await getTasks.json();
		const managers = await getManagers.json();
		let access = cookies.get('access');

		return {
			allTasks,
			managers,
			access
		};
	}
};

const taskPriorities = ['LOW', 'NORMAL', 'HIGH'] as const;

const dateSchema = z.preprocess(
	(arg) => {
		if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
	},
	z.date({
		required_error: 'Date is required',
		invalid_type_error: 'Invalid date format'
	})
);

const taskSchema = z.object({
	title: z
		.string({ required_error: 'Task name is required' })
		.min(1, { message: 'Task name is required' })
		.trim(),
	description: z.string({ required_error: 'Task description is resquired' }).trim().optional(),
	priority: z.enum(taskPriorities, {
		description: 'Task priority is required',
		required_error: 'Please select task priority'
	}),
	start_time: dateSchema,
	end_time: dateSchema,
	assignees_ids: z
		.array(z.number({ required_error: 'Please assign this task to someone ' }))
		.nonempty({ message: 'Please assign this task to someone' })
});

type Errors = {
	email?: [string];
	password?: [string];
	password2?: [string];
	groups?: [string];
};

export const actions: Actions = {
	manage_task: async ({ fetch, request }) => {
		const formData = await request.formData();

		const title = formData.get('title');
		const description = formData.get('description');
		const priority = formData.get('priority');
		const start_time = formData.get('start_time');
		const end_time = formData.get('end_time');
		const assignedManagers = formData.getAll('assignees_ids');
		const existingTask = parseInt(formData.get('existingTaskId') as string);
		console.log(existingTask);

		let assignees_ids = assignedManagers.map((m) => parseInt(m as string));

		const dataToValidate = {
			...(title && { title }),
			...(description && { description }),
			...(priority && { priority }),
			...(start_time && { start_time }),
			...(end_time && { end_time }),
			...(assignees_ids && { assignees_ids })
		};

		console.log(dataToValidate);

		try {
			const validatedData = taskSchema.parse(dataToValidate);

			console.log('starting');
			if (existingTask && existingTask > 0) {
				const editTask = await fetch(`${PUBLIC_API_ENDPOINT}api/hrm/tasks/${existingTask}/`, {
					method: 'put',
					body: JSON.stringify(validatedData)
				});

				if (editTask.ok) {
					console.log('almost');
					const editedTask = await editTask.json();
					console.log('completed', editedTask);

					return {
						edited: true,
						editedTask
					};
				} else {
					console.log(editTask.status);
				}
			} else {
				const createTask = await fetch(`${PUBLIC_API_ENDPOINT}api/hrm/tasks/`, {
					method: 'post',
					body: JSON.stringify(validatedData)
				});
				console.log('in progress', createTask.status);
				if (createTask.ok) {
					const newTask = await createTask.json();
					console.log(newTask);

					return {
						newTask,
						edited: false
					};
				} else {
					console.log(createTask.status);
				}
			}
		} catch (error) {
			const toSend = {
				message: 'Ooops something went wrong',
				errors: {} as Errors
			};

			if (error instanceof z.ZodError) {
				toSend.message = 'Validation error';
				toSend.errors = error.flatten().fieldErrors;

				console.log(toSend.errors);

				return fail(400, toSend);
			}

			console.log('error', error);
			return fail(500, toSend);
		}
	}
};
