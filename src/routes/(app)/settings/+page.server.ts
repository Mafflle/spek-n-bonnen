import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { profileSchema, type profileErrors } from '$lib/user';
import { fail, type Actions } from '@sveltejs/kit';
import { z } from 'zod';

export const actions: Actions = {
	'manage-profile': async ({ request, fetch }) => {
		const formData = await request.formData();

		const first_name = formData.get('first_name');
		const last_name = formData.get('last_name');
		const email = formData.get('email');
		const profile_picture_id = parseInt(formData.get('profile_picture_id') as string);

		const dataToValidate = {
			...(first_name && { first_name }),
			...(last_name && { last_name }),
			...(email && { email }),
			...(profile_picture_id && { profile_picture_id })
		};
		try {
			const validatedData = profileSchema.parse(dataToValidate);

			const editProfile = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/`, {
				method: 'put',
				body: JSON.stringify(validatedData)
			});

			if (editProfile.ok) {
				const updatedProfile = await editProfile.json();
				return { updatedProfile };
			} else {
				console.log(editProfile);
			}
		} catch (e) {
			const toSend = { message: '', errors: {} as profileErrors };

			if (e instanceof z.ZodError) {
				(toSend.message = 'Validation errors'), (toSend.errors = e.flatten().fieldErrors);
				return fail(400, toSend);
			}
		}
	}
};
