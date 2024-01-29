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
	shopToEdit: z.number().optional()
});

export const load: PageServerLoad = async ({ fetch, url }) => {
	const getAllShops = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/butcher_shops/`);

	if (getAllShops.ok) {
		const shops = await getAllShops.json();
		// console.log(shops);
		return {
			shops
		};
	} else if (!getAllShops.ok) {
		throw redirect(302, `/auth/login?from=${url.pathname}`);
	}
};

export const actions: Actions = {
	'manage-butcher-shop': async ({ request, fetch, url }) => {
		const formData = await request.formData();

		const name = formData.get('name');
		const address = formData.get('address');
		const shopToEdit = parseInt(formData.get('id') as string);

		const dataToValidate = {
			...(name && { name }),
			...(address && { address }),
			...(shopToEdit && { shopToEdit })
		};

		try {
			const validatedData = manageSchema.parse(dataToValidate);

			if (validatedData.shopToEdit) {
				const editButcherShop = await fetch(
					`${PUBLIC_API_ENDPOINT}api/inventory/butcher_shops/${validatedData.shopToEdit}/`,
					{
						method: 'put',
						body: JSON.stringify({ name: validatedData.name, address: validatedData.address })
					}
				);

				if (editButcherShop.ok) {
					const editedShop = await editButcherShop.json();

					return {
						editedShop,
						edited: true
					};
				} else if (editButcherShop.status === 400) {
					const badBody = await editButcherShop.json();
					console.log(badBody);
				} else if (editButcherShop.status === 401) {
					throw redirect(302, `/auth/login?from=${url.pathname}`);
				} else {
					console.log(editButcherShop);
				}
			} else {
				const createShop = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/butcher_shops/`, {
					method: 'post',
					body: JSON.stringify(validatedData)
				});

				if (createShop.ok) {
					const newButcherShop = await createShop.json();
					return {
						newButcherShop,
						edited: false
					};
				} else if (createShop.status === 400) {
					const badBody = await createShop.json();
					console.log(badBody);
				} else if (createShop.status === 401) {
					throw redirect(302, `/auth/login?from=${url.pathname}`);
				} else {
					console.log(createShop);
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
			const deleteShop = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/butcher_shops/${id}/`, {
				method: 'delete'
			});

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
