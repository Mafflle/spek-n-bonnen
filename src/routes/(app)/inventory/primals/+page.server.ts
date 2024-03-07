import type { PageServerLoad } from '../$types';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { check } from '$lib/utils';

const manageSchema = z.object({
	name: z
		.string({ required_error: 'Brand name is required' })
		.trim()
		.min(3, { message: 'Brand name should be at least 3 characters ' }),
	reorder_point: z
		.number({ required_error: 'Reorder point is required' })
		.max(2147483647, { message: 'Reorder point exceeded maximum value' })
		.min(-2147483648, { message: 'Reorder point is below the minimum value' }),
	description: z.string().optional(),
	primalToEdit: z.string().optional()
});

type Errors = {
	name?: [string];
	reorderPoint?: [string];
	description?: [string];
	server?: [string];
};

export const load: PageServerLoad = async ({ fetch, url, locals }) => {
	if (check('view_primal', locals.user)) {
		throw redirect(302, "/?message=You don't have the permission to view this page&&type=info");
	}

	const getAllPrimals = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/primals/`);

	if (getAllPrimals.ok) {
		const primals = await getAllPrimals.json();
		// console.log(primals);
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
		const primalToEdit = formData.get('primalToEdit');
		const reorder_point = parseInt(formData.get('reorder-point') as string);

		const dataToValidate = {
			...(name && { name }),
			...(description && { description }),
			...(primalToEdit && { primalToEdit }),
			...(reorder_point && { reorder_point })
		};
		try {
			const validatedData = manageSchema.parse(dataToValidate);
			// ...
			if (validatedData.primalToEdit) {
				const editPrimal = await fetch(
					`${PUBLIC_API_ENDPOINT}api/inventory/primals/${validatedData.primalToEdit}`,
					{
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							name: validatedData.name,
							description: validatedData.description
						})
					}
				);
				// ...

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
		const slug = formData.get('slug');

		if (slug) {
			const deleteRole = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/primals/${slug}/`, {
				method: 'delete'
			});

			if (deleteRole.ok) {
				console.log('Delete successful'); // Log on successful delete
				return {
					success: true
				};
			} else {
				console.log('Delete failed:', deleteRole.status, deleteRole.statusText); // Log the response on failure
			}
		} else {
			console.log('No slug provided'); // Log when no id is provided
			return fail(400);
		}
	},
	search: async ({ cookies, request }) => {
		console.log('searching');
		const data = await request.formData();
		console.log(data);
		const search = data.get('search');

		const response = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/primals/?search=${search}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.get('access')}`
			}
		});

		if (response.ok) {
			const primals = await response.json();
			console.log('carcassss search', primals);
			return { primals };
		} else {
			// handle error
			const error = await response.json();
			console.log(error);
			return { status: response.status, error };
		}
	}
};
