import type { PageServerLoad } from '../../inventory/$types';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { getCurrentUser } from '$lib/user';
import { showToast } from '$lib/utils';

// const currentUser = getCurrentUser();

const manageSchema = z.object({
	name: z
		.string({ required_error: 'Farm name is required' })
		.trim()
		.min(3, { message: 'Farm name should be at least 3 characters ' })
		.max(150, { message: 'Farm name should be at most 150 characters ' }),
	address: z.string().optional(),
	farmToEdit: z.number().optional()
});

type Errors = {
	name?: [string];
	address?: [string];
	server?: [string];
};

export const load: PageServerLoad = async ({ cookies, fetch, url }) => {
	const getAllFarms = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/farms/`);

	if (getAllFarms.ok) {
		const farms = await getAllFarms.json();
		// console.log(farms);
		return {
			farms
		};
	} else if (!getAllFarms.ok) {
		throw redirect(302, `/auth/login?from=${url.pathname}`);
	}
};

export const actions: Actions = {
	
	'manage-farm': async ({ fetch, request, url }) => {
		const currentUser = getCurrentUser();
        if (!currentUser?.is_superuser){
            console.log('You do not have permission to perform this action');
            showToast('You do not have permission to perform this action', 'error');
            return fail(403, { message: 'You do not have permission to perform this action' });
        }
     
		const formData = await request.formData();

		const name = formData.get('farm-name');
		const address = formData.get('farm-address');
		const farmToEdit = parseInt(formData.get('farmToEdit') as string);

		const dataToValidate = {
			...(name && { name }),
			...(address && { address }),
			...(farmToEdit && { farmToEdit })
		};
		try {
			const validatedData = manageSchema.parse(dataToValidate);
			// console.log('validated', validatedData);

			if (validatedData.farmToEdit) {
				const editFarm = await fetch(
					`${PUBLIC_API_ENDPOINT}api/inventory/farms/${validatedData.farmToEdit}/`,
					{
						method: 'PUT',

						body: JSON.stringify({ name: validatedData.name, address: validatedData.address })
					}
				);
				// console.log(editFarm);

				if (editFarm.ok) {
					const editedFarm = await editFarm.json();
					return {
						editedFarm,
						edited: true
					};
				} else if (editFarm.status === 400) {
					const badBody = await editFarm.json();
					console.log(badBody);
				} else if (editFarm.status == 401) {
					throw redirect(302, `/auth/login?from=${url.pathname}`);
				} else {
					console.log(editFarm);
				}
			} else {
				const createFarm = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/farms/`, {
					method: 'POST',
					body: JSON.stringify(validatedData)
				});

				if (createFarm.ok) {
					const newFarm = await createFarm.json();
					return {
						newFarm,
						edited: false
					};
				} else if (createFarm.status === 400) {
					const badBody = await createFarm.json();
					console.log(badBody);
				} else if (createFarm.status === 401) {
					throw redirect(302, `/auth/login?from=${url.pathname}`);
				} else {
					console.log(createFarm);
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
		const currentUser = getCurrentUser();
        if (!currentUser?.is_superuser){
            console.log('You do not have permission to perform this action');
            showToast('You do not have permission to perform this action', 'error');
            return fail(403, { message: 'You do not have permission to perform this action' });
        }
		const formData = await request.formData();
		const id = formData.get('id');
		console.log(id);

		if (id) {
			const deleteFarm = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/farms/${id}/`, {
				method: 'delete'
			});

			if (deleteFarm.ok) {
				console.log('Delete successful');
				return {
					success: true
				};
			} else {
				console.log('Delete failed:', deleteFarm);
			}
		} else {
			console.log('No id provided');
			return fail(400);
		}
	},
	search: async ({ cookies, request, fetch }) => {
		console.log('searching');
		const data = await request.formData();
		console.log(data);
		const search = data.get('search');

		const response = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/farms/?search=${search}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.get('access')}`
			}
		});

		if (response.ok) {
			const farms = await response.json();
			console.log('carcassss search', farms);
			return { farms };
		} else {
			// handle error
			const error = await response.json();
			console.log(error);
			return { status: response.status, error };
		}
	}
};
