import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { staffprofileSchema, type StaffProfileErrors } from '$lib/user';
import { fail, type Actions } from '@sveltejs/kit';
import { z } from 'zod';

export const actions: Actions = {
	'manage-staff-profile': async ({ request, fetch }) => {
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
		const hasExistingProfile = formData.get('hasExistingProfile') === 'true';

		const profile_picture = {
			...(first_name && last_name && { title: `${first_name}-${last_name}'s profile picture` })
		};

		const dataToValidate = {
			...(first_name && { first_name }),
			...(last_name && { last_name }),
			...(profile_picture && { profile_picture }),
			...(preferred_name && { preferred_name }),
			...(phone_number && { phone_number }),
			...(address && { address }),
			...(date_of_birth && { date_of_birth }),
			...(emergency_contact_name && { emergency_contact_name }),
			...(emergency_contact_number && { emergency_contact_number }),
			...(emergency_contact_relationship && { emergency_contact_relationship }),
			...(profile_picture_id && { profile_picture_id })
		};
		try {
			const validatedData = staffprofileSchema.parse(dataToValidate);

			if (hasExistingProfile) {
				const editStaffProfile = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/staff_profile/me/`, {
					method: 'put',
					body: JSON.stringify(validatedData)
				});
				if (editStaffProfile.ok) {
					const updatedStaffProfile = await editStaffProfile.json();
					return { edit: true, updatedStaffProfile };
				} else {
					console.log(editStaffProfile.status);
					console.log(editStaffProfile.statusText);
					const error = await editStaffProfile.json();
					// console.log(error);
				}
			} else {
				const createStaffProfile = await fetch(
					`${PUBLIC_API_ENDPOINT}api/auth/staff_profile/me/create/`,
					{
						method: 'post',
						body: JSON.stringify(validatedData)
					}
				);
				if (createStaffProfile.ok) {
					const newStaffProfile = await createStaffProfile.json();
					return { edit: true, newStaffProfile };
				} else {
					console.log(createStaffProfile.status);
					const error = await createStaffProfile.json();
				}
			}
		} catch (e) {
			const toSend = { message: '', errors: {} as StaffProfileErrors };

			if (e instanceof z.ZodError) {
				(toSend.message = 'Validation errors'), (toSend.errors = e.flatten().fieldErrors);
				return fail(400, toSend);
			}
		}
	}
};
