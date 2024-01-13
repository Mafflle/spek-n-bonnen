import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { currentUser } from '$lib/user';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type Errors = {
	title?: [string];
	image?: [string];
	server?: [string];
};

const imageSchema = z.object({
	name: z.string(),
	lastModified: z.number(),
	size: z
		.number()
		.min(0, { message: 'Image is required' })
		.max(MAX_FILE_SIZE, { message: 'Max image is size is 5MB' })
});

const uploadSchema = z.object({
	name: z
		.string({ required_error: 'Media name is required' })
		.trim()
		.min(3, { message: 'Media name should be at least 3 characters ' }),
	logo: imageSchema
});
export const actions: Actions = {
	logout: async ({ cookies, url, request }) => {
		const formData = await request.formData();

		const currUrl = formData.get('currUrl');
		cookies.delete('access');
		cookies.delete('refresh ');
		currentUser.set(null);

		throw redirect(302, `auth/login?from=${currUrl}`);
	},
	upload: async ({ fetch, request, cookies }) => {
		// console.log(cookies.get('access'));

		const formData = await request.formData();

		const name = formData.get('image-title');
		const logo = formData.get('image');

		const dataToValidate = {
			...(name && { name }),
			...(logo && { logo })
		};
		try {
			uploadSchema.parse(dataToValidate);

			let dataToSend = new FormData();
			if (name && logo) {
				dataToSend.append('title', name);
				dataToSend.append('image', logo);
			}
			if (dataToSend) {
				const createMedia = await fetch(`${PUBLIC_API_ENDPOINT}api/images/`, {
					method: 'POST',
					body: dataToSend
				});

				if (createMedia.ok) {
					const newMedia = await createMedia.json();
					return { newMedia };
				} else if (createMedia.status === 400) {
					//TODO: Handle Bad Request
					console.log(createMedia);
				} else {
					//TODO: Return "Something went wrong..." message
					console.log(createMedia);
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

				return fail(400, toSend);
			}

			console.log('error', error);
			return fail(500, toSend);
		}
	},
	'delete-media': async ({ fetch, request }) => {
		const formData = await request.formData();

		const id = formData.get('image-id');

		if (id) {
			const deleteImage = await fetch(`${PUBLIC_API_ENDPOINT}api/images/${id}`, {
				method: 'delete'
			});

			if (deleteImage.ok) {
				return { success: true };
			} else if (!deleteImage.ok) {
				if (deleteImage.status === 400) {
					const error = await deleteImage.json();
					console.log(error);

					return { errors: error.detail };
				}
			} else {
				return fail(500);
			}
		} else return fail(500);
	}
};
