import { fail, type Actions, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { PageServerLoad } from './$types';
import { check } from '$lib/utils';

const manageSchema = z.object({
	id: z.number().optional(),
	name: z
		.string({ required_error: 'Vendor name is required' })
		.trim()
		.min(3, { message: 'Vendor name should be at least 3 characters long' }),
	address: z
		.string({ required_error: 'Vendor address is required' })
		.trim()
		.min(3, { message: 'Vendor address must be at least 3 characters long' }),
	phone_number: z
		.string({ required_error: 'Phone number is required' })
		.regex(
			/\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/,
			{
				message: 'Invalid phone number'
			}
		)
});

type Errors = {
	name?: [string];
	address?: [string];
	phone_number?: [string];
	server?: [string];
};

export const load: PageServerLoad = async ({ fetch, locals }) => {
	if (check('view_vendor', locals.user)) {
		throw redirect(302, "/?message=You don't have the permission to view this page&&type=info");
	}

	const allVendors = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/vendors/`);

	if (allVendors.ok) {
		const vendors = await allVendors.json();

		return {
			vendors
		};
	}
};

export const actions: Actions = {
	'manage-vendor': async ({ fetch, request }) => {
		const formData = await request.formData();

		const name = formData.get('vendor-name');
		const id = parseInt(formData.get('vendor-id'));
		const address = formData.get('vendor-address');
		const phone_number = formData.get('vendor-phone');

		const dataToValidate = {
			...(name && { name }),
			...(address && { address }),
			...(phone_number && { phone_number }),
			...(id && { id })
		};

		try {
			const validatedData = manageSchema.parse(dataToValidate);

			if (validatedData.id) {
				const editVendor = await fetch(
					`${PUBLIC_API_ENDPOINT}api/inventory/vendors/${validatedData.id}`,
					{
						method: 'put',
						body: JSON.stringify(validatedData)
					}
				);
				console.log('editing...', editVendor);

				if (editVendor.ok) {
					const editedVendor = await editVendor.json();

					return {
						editedVendor,
						edited: true
					};
				}
			} else {
				const addNewVendor = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/vendors/`, {
					method: 'post',
					body: JSON.stringify(validatedData)
				});

				if (addNewVendor.ok) {
					const newVendor = await addNewVendor.json();
					return { newVendor, edited: false };
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

		const id = parseInt(formData.get('vendor-id') as string);

		try {
			const res = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/vendors/${id}`, {
				method: 'delete'
			});
			if (res.ok) {
				return {
					success: true
				};
			}
		} catch (error) {
			console.log('error', error);
			return fail(500);
		}
	}
};
