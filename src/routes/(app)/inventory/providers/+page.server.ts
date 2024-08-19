import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { fail, type Actions } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const providerSchema = z.object({
	company_name: z
		.string({ required_error: 'Supplier company name is required' })
		.min(3, { message: 'Supplier company name should be at least 3 characters' })
		.trim(),
	contact_person: z
		.string()
		.min(3, { message: 'Supplier company name should be at least 3 characters' })
		.trim()
		.optional(),
	email: z
		.string({ required_error: 'Email is required' })
		.trim()
		.email({ message: 'Not a valid email' }),
	logo: z.number().optional(),

	address: z
		.string({ required_error: 'Supplier address is required' })
		.min(3, { message: 'Supplier address should be longer' })
		.trim(),
	phone: z
		.string({ required_error: 'Phone number is required' })
		.regex(
			/\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/,
			{
				message: 'Invalid phone number'
			}
		)
		.optional()
});

interface Errors {
	company_name?: [string];
	contact_person?: [string];
	email?: [string];
	address?: [string];
	phone_number?: [string];
	logo?: [string];
	server?: [string];
}

export const load: PageServerLoad = async ({ fetch }) => {
	const getAllProvider = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/supplier/`);

	if (getAllProvider.ok) {
		const allProviders = await getAllProvider.json();

		return {
			allProviders
		};
	}
};

export const actions: Actions = {
	'manage-providers': async ({ fetch, request }) => {
		const formData = await request.formData();

		const company_name = formData.get('company_name') as string;
		const contact_person = formData.get('contact_person') as string;
		const logo = parseInt(formData.get('logo') as string);
		const email = formData.get('email') as string;

		const address = formData.get('address') as string;
		const phone = formData.get('phone') as string;
		const id = formData.get('id') as string;

		const dataToValidate = {
			...(company_name && { company_name }),
			...(contact_person && { contact_person }),
			...(email && { email }),
			...(logo && { logo }),
			...(email && { email }),
			...(address && { address }),
			...(phone && { phone })
		};
		try {
			const validatedData = providerSchema.parse(dataToValidate);
			if (id) {
				const editProvider = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/supplier/${id}/`, {
					method: 'put',
					body: JSON.stringify(validatedData)
				});

				if (editProvider.ok) {
					const editedProvider = await editProvider.json();
					return { editedProvider, edited: true };
				} else {
					console.log(editProvider.status, editProvider);
				}
			} else {
				const createProvider = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/supplier/`, {
					method: 'post',
					body: JSON.stringify(validatedData)
				});

				if (createProvider.ok) {
					const newProvider = await createProvider.json();
					return { newProvider, edited: false };
				} else {
					console.log(createProvider.status, createProvider);
				}
			}
		} catch (error) {
			const toSend = { message: '', errors: {} as Errors };

			if (error instanceof z.ZodError) {
				toSend.message = 'Validation Errors';
				toSend.errors = error.flatten().fieldErrors;
				return fail(400, toSend);
			}
		}
	},
	delete: async ({ fetch, request }) => {
		const formData = await request.formData();

		const id = formData.get('id') as string;

		const deleteProvider = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/supplier/${id}/`, {
			method: 'delete'
		});
		if (deleteProvider.ok) {
			return { success: true };
		} else {
			console.log(deleteProvider);
		}
	}
};
