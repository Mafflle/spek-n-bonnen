import type { PageServerLoad } from '../$types';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { z } from 'zod';

const manageSchema = z.object({
	name: z
		.string({ required_error: 'Brand name is required' })
		.trim()
		.min(3, { message: 'Brand name should be at least 3 characters ' }),
	primalToEdit: z.number().optional()
});

type Errors = {
	name?: [string];
	description?: [string];
	server?: [string];
};

export const load: PageServerLoad = async ({ cookies, fetch, url }) => {
	const getAllPrimals = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/primals/`);

	if (getAllPrimals.ok) {
		const primals = await getAllPrimals.json();
		return {
			primals
		};
	} else if (!getAllPrimals.ok) {
		throw redirect(302, `/auth/login?from=${url.pathname}`);
	}
};

export const actions: Actions = {
	'manage-primal': async ({ fetch, request, url }) => {
		// console.log(cookies.get('access'));

		const formData = await request.formData();

		const name = formData.get('primal-name');
		const description = formData.get('primal-description');
		const primalToEdit = parseInt(formData.get('primalToEdit'));

		const dataToValidate = {
			...(name && { name }),
			...(description && { description }),
			...(primalToEdit && { primalToEdit })
		};
		try {
			const validatedData = manageSchema.parse(dataToValidate);
			if (validatedData.primalToEdit) {
				const editPrimal = await fetch(
					`${PUBLIC_API_ENDPOINT}api/inventory/primal/${validatedData.primalToEdit}`,
					{
						method: 'PATCH',
						body: JSON.stringify({ name: validatedData.name, description: validatedData.description })
					}
				);

				if (editPrimal.ok) {
					const editedPrimal = await editPrimal.json();
					// console.log(newBrand);
					return {
						editedPrimal,
						edited: true
					};
				} else if (editPrimal.status === 400) {
					//TODO: Handle Bad Request
					const badBody = await editPrimal.json();
					console.log(badBody);
				} else if (editPrimal.status == 401) {
					throw redirect(302, `/auth/login?from=${url.pathname}`);
				} else {
					//TODO: Return "Something went wrong..." message
					console.log(editPrimal);
				}
			} else {
				const createPrimal = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/primals/`, {
					method: 'POST',
					body: JSON.stringify(validatedData)
				});

				if (createPrimal.ok) {
					const newPrimal = await createPrimal.json();
					// console.log(newPrimal);
					return {
						newPrimal
					};
				} else if (createPrimal.status === 400) {
					//TODO: Handle Bad Request
					const badBody = await createPrimal.json();
					console.log(badBody);
				} else if (createPrimal.status == 401) {
					throw redirect(302, `/auth/login?from=${url.pathname}`);
				} else {
					//TODO: Return "Something went wrong..." message
					console.log(createPrimal);
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
	},

	delete: async ({ fetch, request }) => {
		const formData = await request.formData();

		const id = formData.get('id');
		if (id) {
			const deletePrimal = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/primals/${id}/`, {
				method: 'delete'
			});

			if (deletePrimal.ok) {
				return {
					success: true
				};
			} else if (!deletePrimal.ok) {
				console.log(deletePrimal);
			}
		} else return fail(400);
	}
};
