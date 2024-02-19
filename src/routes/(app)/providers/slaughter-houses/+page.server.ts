import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

type Errors = {
	name?: [string];
	address?: [string];
	server?: [string];
};

const manageSchema = z.object({
	name: z
		.string({ required_error: 'Shop name is required' })
		.trim()
		.min(3, { message: 'Shop name should be at least 3 characters ' })
		.max(150, { message: 'Shop name should be at most 150 characters ' }),
	address: z.string().optional(),
	slaughterHouseToEdit: z.number().optional()
});

export const load: PageServerLoad = async ({ fetch, url }) => {
	const getAllSlaughterHouses = await fetch(
		`${PUBLIC_API_ENDPOINT}api/inventory/slaughter_houses/`
	);

	if (getAllSlaughterHouses.ok) {
		const slaughterHouses = await getAllSlaughterHouses.json();
		console.log(slaughterHouses);
		return {
			slaughterHouses
		};
	} else if (!getAllSlaughterHouses.ok) {
		throw redirect(302, `/auth/login?from=${url.pathname}`);
	}
};

export const actions: Actions = {
	'manage-slaughter-houses': async ({ request, fetch, url }) => {
		const formData = await request.formData();

		const name = formData.get('name');
		const address = formData.get('address');
		const slaughterHouseToEdit = parseInt(formData.get('id') as string);

		const dataToValidate = {
			...(name && { name }),
			...(address && { address }),
			...(slaughterHouseToEdit && { slaughterHouseToEdit })
		};

		try {
			const validatedData = manageSchema.parse(dataToValidate);

			if (validatedData.slaughterHouseToEdit) {
				const editSlaughterHouse = await fetch(
					`${PUBLIC_API_ENDPOINT}api/inventory/slaughter_houses/${validatedData.slaughterHouseToEdit}/`,
					{
						method: 'put',
						body: JSON.stringify({ name: validatedData.name, address: validatedData.address })
					}
				);

				if (editSlaughterHouse.ok) {
					const editedSlaughterHouse = await editSlaughterHouse.json();

					return {
						editedSlaughterHouse,
						edited: true
					};
				} else if (editSlaughterHouse.status === 400) {
					const badBody = await editSlaughterHouse.json();
					console.log(badBody);
				} else if (editSlaughterHouse.status === 401) {
					throw redirect(302, `/auth/login?from=${url.pathname}`);
				} else {
					// console.log(editSlaughterHouse);
				}
			} else {
				const createSlaughterHouse = await fetch(
					`${PUBLIC_API_ENDPOINT}api/inventory/slaughter_houses/`,
					{
						method: 'post',
						body: JSON.stringify(validatedData)
					}
				);

				if (createSlaughterHouse.ok) {
					const newSlaugherHouse = await createSlaughterHouse.json();
					return {
						newSlaugherHouse,
						edited: false
					};
				} else if (createSlaughterHouse.status === 400) {
					const badBody = await createSlaughterHouse.json();
					console.log(badBody);
				} else if (createSlaughterHouse.status === 401) {
					throw redirect(302, `/auth/login?from=${url.pathname}`);
				} else {
					console.log(createSlaughterHouse);
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
		// console.log(id);

		if (id) {
			const deleteShop = await fetch(
				`${PUBLIC_API_ENDPOINT}api/inventory/slaughter_houses/${id}/`,
				{
					method: 'delete'
				}
			);

			if (deleteShop.ok) {
				// console.log('Delete successful');
				return {
					success: true
				};
			} else {
				console.log('Delete failed:', deleteShop);
			}
		} else {
			console.log('No id provided');
			return fail(400);
		}
	}
};
