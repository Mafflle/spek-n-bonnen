import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { uploadImage } from '$lib/api';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { data } from 'autoprefixer';
import type { PageServerLoad } from '../$types';
import { z } from 'zod';

const createBrandSchema = z.object({
	name: z
		.string({ required_error: 'Brand name is required' })
		.trim()
		.min(3, { message: 'Brand name should be at least 3 characters ' }),
	logo: z.number({ required_error: 'Brand logo is required' })
});

type Errors = {
	name?: [string];
	logo?: [string];
	server?: [string];
};
export const load: PageServerLoad = async ({ cookies, fetch, url }) => {
	const getAllBrands = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/brands/`);

	if (getAllBrands.ok) {
		const brands = await getAllBrands.json();
		return {
			brands
		};
	} else if (!getAllBrands.ok) {
		throw redirect(302, `/auth/login?from=${url.pathname}`);
	}
};

export const actions: Actions = {
	create: async ({ fetch, request, url }) => {
		// console.log(cookies.get('access'));

		const formData = await request.formData();

		const name = formData.get('brand-name');
		const logo = formData.get('brand-logo');

		const dataToValidate = {
			...(name && { name }),
			...(logo && { logo })
		};
		dataToValidate.logo = parseInt(logo);
		try {
			const validatedData = createBrandSchema.parse(dataToValidate);

			const createBrand = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/brands/`, {
				method: 'POST',
				body: JSON.stringify(validatedData)
			});

			if (createBrand.ok) {
				const newBrand = await createBrand.json();
				// console.log(newBrand);
				return {
					newBrand
				};
			} else if (createBrand.status === 400) {
				//TODO: Handle Bad Request
				const badBody = await createBrand.json();
				console.log(badBody);
			} else if (createBrand.status == 401) {
				throw redirect(302, `/auth/login?from=${url.pathname}`);
			} else {
				//TODO: Return "Something went wrong..." message
				console.log(createBrand);
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

	delete: async ({ fetch, request }) => {
		const formData = await request.formData();

		const id = formData.get('id');
		if (id) {
			const deleteRole = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/brands/${id}/`, {
				method: 'delete'
			});

			if (deleteRole.ok) {
				return {
					success: true
				};
			} else if (!deleteRole.ok) {
				console.log(deleteRole);
			}
		} else return fail(400);
	}
};
