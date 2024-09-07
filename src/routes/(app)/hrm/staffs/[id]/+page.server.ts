import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { staffprofileSchema, type staffProfileErrors } from '$lib/user';
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
			console.log('utasks',userTasks);
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
	},
	'manage-staff-profile': async ({ request, fetch, params }) => {
		const staff = params.id;

		if (!staff) {
			throw redirect(302, '/staffs');
		}
		const formData = await request.formData();

		const first_name = formData.get('first_name');
		const last_name = formData.get('last_name');
		const preferred_name = formData.get('preferred_name');
		const phone_number = formData.get('phone_number');
		const address = formData.get('address');
		const date_of_birth = formData.get('date_of_birth');
		const emergency_contact_name = formData.get('emergency_contact_name');
		const emergency_contact_number = formData.get('emergency_contact_number');
		const emergency_contact_relationship = formData.get('emergency_contact_relationship');
		const profile_picture_id = parseInt(formData.get('profile_picture_id') as string);
		const preferred_weekly_working_hours = parseInt(formData.get('preferred_hours') as string);
		const hasExistingProfile = formData.get('hasExistingProfile') === 'true';

		const dataToValidate = {
			...(first_name && { first_name }),
			...(last_name && { last_name }),
			...(preferred_name && { preferred_name }),
			...(preferred_weekly_working_hours && { preferred_weekly_working_hours }),
			...(phone_number && { phone_number }),
			...(address && { address }),
			...(date_of_birth && { date_of_birth }),
			...(emergency_contact_name && { emergency_contact_name }),
			...(emergency_contact_number && { emergency_contact_number }),
			...(emergency_contact_relationship && { emergency_contact_relationship }),
			...(profile_picture_id && { profile_picture_id })
		};
		console.log('data', dataToValidate);
		try {
			const validatedData = staffprofileSchema.parse(dataToValidate);

			// if (hasExistingProfile) {
			const editStaffProfile = await fetch(
				`${PUBLIC_API_ENDPOINT}api/auth/staff_profile/${staff}/`,
				{
					method: 'put',
					body: JSON.stringify(validatedData)
				}
			);

			if (editStaffProfile.ok) {
				const updatedStaffProfile = await editStaffProfile.json();
				return { edit: true, updatedStaffProfile };
			} else {
				console.log('updating', editStaffProfile.status);
				console.log(editStaffProfile.statusText);
				const error = await editStaffProfile.json();
				// console.log(error);
			}
			// }
			// else {
			// 	const createStaffProfile = await fetch(
			// 		`${PUBLIC_API_ENDPOINT}api/auth/staff_profile/me/create/`,
			// 		{
			// 			method: 'post',
			// 			body: JSON.stringify(validatedData)
			// 		}
			// 	);
			// 	if (createStaffProfile.ok) {
			// 		const newStaffProfile = await createStaffProfile.json();
			// 		return { edit: true, newStaffProfile };
			// 	} else {
			// 		console.log('creating', createStaffProfile.status);
			// 		const error = await createStaffProfile.json();
			// 	}
			// }
		} catch (e) {
			const toSend = { message: '', errors: {} as staffProfileErrors };

			if (e instanceof z.ZodError) {
				(toSend.message = 'Validation errors'), (toSend.errors = e.flatten().fieldErrors);
				return fail(400, toSend);
			}
		}
	}
};
