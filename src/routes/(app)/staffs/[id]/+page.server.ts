import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';

dayjs.extend(customParseFormat);

export const load: PageServerLoad = async ({ fetch, url, params }) => {
	let userId = params.id;

	if (params) {
		const getUserById = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/users/${userId}/`);
		const getTasksById = await fetch(`${PUBLIC_API_ENDPOINT}api/hrm/tasks/?assignees=${userId}`);
		const getSchedulesById = await fetch(
			`${PUBLIC_API_ENDPOINT}api/hrm/work-schedule/?account=${userId}`
		);

		if (getUserById.ok && getTasksById.ok && getSchedulesById.ok) {
			const userAccount = await getUserById.json();
			const userTasks = await getTasksById.json();
			const userSchedule = await getSchedulesById.json();
			return {
				userAccount,
				userTasks,
				userSchedule
			};
		} else {
			console.log(getUserById.status, getUserById.statusText);
			console.log(getTasksById.status, getTasksById.statusText);
			console.log(getSchedulesById.status, getSchedulesById.statusText);
		}
	}
};
const daysOfWeek = [1, 2, 3, 4, 5, 6, 7];

const timeSchema = z
	.string()
	.regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
		message: 'Invalid time format (HH:mm or HH:mm:ss)'
	})
	.refine(
		(value) => {
			const [hours, minutes] = value.split(':').map(Number);
			return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
		},
		{ message: 'Invalid time (hours must be 0-23, minutes 0-59)' }
	)
	.transform((timeStr) => dayjs(timeStr, 'HH:mm').format('HH:mm'));

const scheduleSchema = z
	.object({
		day_of_week: z.number().refine((day) => daysOfWeek.includes(day), {
			message: 'Invalid day of the week (must be 1-7)'
		}),
		start_time: timeSchema,
		end_time: timeSchema,
		account_id: z.number({ required_error: 'Please assign this task to someone ' })
	})
	.refine(
		(data) => {
			const startTime = dayjs(data.start_time, 'HH:mm');
			const endTime = dayjs(data.end_time, 'HH:mm');
			return startTime.isBefore(endTime);
		},
		{
			message: 'Invalid times: start_time must be before end_time',
			path: ['start_time']
		}
	);

export const actions: Actions = {
	manage_schedule: async ({ request, fetch }) => {
		const formData = await request.formData();

		const day_of_week = parseInt(formData.get('day_of_week') as string);
		const start_time = formData.get('start_time');
		const end_time = formData.get('end_time');
		const account_id = parseInt(formData.get('account_id') as string);
		const schedule_id = parseInt(formData.get('schedule_id') as string);

		const dataToValidate = {
			...(day_of_week && { day_of_week }),
			...(start_time && { start_time }),
			...(end_time && { end_time }),
			...(account_id && { account_id })
		};
		console.log(dataToValidate);

		try {
			const validatedData = scheduleSchema.parse(dataToValidate);
			console.log(validatedData);

			if (schedule_id && schedule_id > 0) {
				const editSchedule = await fetch(
					`${PUBLIC_API_ENDPOINT}api/hrm/work-schedule/${schedule_id}/`,
					{ method: 'put', body: JSON.stringify(validatedData) }
				);

				if (editSchedule.ok) {
					const editedSchedule = await editSchedule.json();

					return {
						edited: true,
						editedSchedule
					};
				} else {
					const errorBody = await editSchedule.json();
					if (errorBody) {
						console.log(errorBody);
					}
					console.log('Error editing schedule with status: ', editSchedule.status);
					console.log('Error editing schedule: ', editSchedule.url);
					console.log('Error editing schedule with error message: ', editSchedule.statusText);

					return fail(500);
				}
			} else if (!schedule_id) {
				const createWorkSchedule = await fetch(`${PUBLIC_API_ENDPOINT}api/hrm/work-schedule/`, {
					method: 'post',
					body: JSON.stringify(validatedData)
				});

				if (createWorkSchedule.ok) {
					const newWorkSchedule = await createWorkSchedule.json();

					return {
						newWorkSchedule
					};
				} else {
					console.log(
						'Ooops something went wrong while creating schedule: ',
						createWorkSchedule.status
					);
					console.log(createWorkSchedule.statusText);
					return {
						success: false
					};
				}
			}
		} catch (error) {
			const toSend = {
				message: 'Ooops something went wrong!!',
				errors: {} as any
			};
			// console.log(error);

			if (error instanceof z.ZodError) {
				toSend.message = 'Validation errors';
				toSend.errors = error.flatten().fieldErrors;

				console.log(toSend.errors);

				return fail(400, toSend);
			}
		}
	}
};
