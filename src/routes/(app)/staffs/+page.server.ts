import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { number, z } from 'zod';
import { check } from '$lib/utils';

type Errors = {
	email?: [string];
	password?: [string];
	password2?: [string];
	groups?: [string];
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

const inviteSchema = z
	.object({
		email: z
			.string({ required_error: 'Email is required' })
			.trim()
			.email({ message: 'Invalid email' }),
		password: z
			.string({ required_error: 'Password is required' })
			.min(8, { message: 'Password must be at least 8 characters' })
			.max(32, { message: 'Password must be less than 32 characters' })
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/, {
				message:
					'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number'
			})
			.trim(),
		password2: z
			.string({ required_error: 'Confirm password is required' })
			.min(8, { message: 'Password must be at least 8 characters' })
			.max(32, { message: 'Password must be less than 32 characters' })
			.trim(),
		groups: z
			.array(z.number({ required_error: 'Roles are required' }))
			.nonempty({ message: 'Roles are required' }),
		managers: z
			.array(z.number({ required_error: 'You need to assign this employee a manager ' }))
			.nonempty({ message: 'You need to assign this employee a manager' })
			.optional(),
		is_manager: z.any().optional()
	})
	.superRefine(({ password, password2 }, ctx) => {
		if (password2 !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Passwords do not match',
				path: ['password2']
			});
		}
	});

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

export const load: PageServerLoad = async ({ fetch, cookies, locals }) => {
	const access = cookies.get('access');

	if (check('view_account', locals.user) || check('view_group', locals.user)) {
		throw redirect(302, "/?message=You don't have the permission to view this page&&type=info");
	}
	const groups = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/groups/?limit=10`);
	const staffs = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/users/?is_staff=true`);
	const managers = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/users/?is_manager=true`);
	const getTasks = await fetch(`${PUBLIC_API_ENDPOINT}api/hrm/tasks/`);

	if (groups.ok && staffs.ok && getTasks.ok && managers.ok) {
		const data = await groups.json();
		let users = await staffs.json();
		let staffManagers = await managers.json();
		let tasks = await getTasks.json();

		return {
			access,
			groups: data,
			users: users,
			staffManagers,
			tasks
		};
	}
};

export const actions: Actions = {
	invite_staff: async ({ fetch, request }) => {
		const formData = await request.formData();

		const roles = formData.getAll('role');
		const email = formData.get('email');
		const password = formData.get('password');
		const password2 = formData.get('confirm-password');
		const is_manager = formData.get('is_manager');
		const assigned_managers = formData.getAll('assigned_manager');
		// console.log(roles);

		const groups = roles.map((role) => parseInt(role));

		const managers = assigned_managers.map((manager) => parseInt(manager as string));
		const dataToValidate = {
			...(email && { email }),
			...(password && { password }),
			...(password2 && { password2 }),
			...(groups && { groups }),
			...(is_manager && { is_manager }),
			...(managers && { managers })
		};

		try {
			const validatedData = inviteSchema.parse(dataToValidate);

			const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/users/invite/`, {
				method: 'POST',
				body: JSON.stringify(validatedData)
			});

			console.log('inviting', res.status, res.statusText);

			if (res.ok) {
				const invitedStaff = await res.json();

				return {
					invitedStaff
				};
			} else if (!res.ok) {
				const details = await res.json();
				// console.log('error', details);
				return fail(400, { errors: details });
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
	},
	manage_task: async ({ fetch, request }) => {
		const formData = await request.formData();

		const title = formData.get('title');
		const description = formData.get('description');
		const priority = formData.get('priority');
		const start_time = formData.get('start_time');
		const end_time = formData.get('end_time');
		const assignedManagers = formData.getAll('assignees_id');
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
				const editTask = await fetch(`${PUBLIC_API_ENDPOINT}api/hrm/tasks/`, {
					method: 'PUT',
					body: JSON.stringify(validatedData)
				});

				if (editTask.ok) {
					const editedTask = await editTask.json();

					return {
						editedTask,
						edited: true
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
