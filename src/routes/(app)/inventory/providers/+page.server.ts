import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { ProviderType } from '$lib/stores/providers.stores';
import { fail, type Actions } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const providerSchema = z.object({
	name: z
		.string({ required_error: 'Provider name is required' })
		.min(3, { message: 'Provider name should be at least 3 characters' })
		.trim(),
	image_id: z.number().optional(),
	type: z.nativeEnum(ProviderType, {
		errorMap: (issue, _ctx) => {
			switch (issue.code) {
				case 'invalid_type':
					return { message: "Provider type is required' " };
				case 'invalid_enum_value':
					return { message: 'Provider type is invalid' };
				default:
					return { message: 'Provider type is invalid' };
			}
		}
	}),
	address: z.string().min(3, { message: 'Provider address should be longer' }).trim().optional(),
	phone_number: z
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
	name?: [string];
	type?: [string];
	address?: [string];
	phone_number?: [string];
	image_id?: [string];
	server?: [string];
}

export const load: PageServerLoad = async ({ fetch }) => {
	const getAllProvider = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/providers/`);

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

		const name = formData.get('name') as string;
		const image_id = parseInt(formData.get('image_id') as string);
		const type = formData.get('type');
		const address = formData.get('address') as string;
		const phone_number = formData.get('phone_number') as string;
		const slug = formData.get('slug') as string;

		const dataToValidate = {
			...(name && { name }),
			...(image_id && { image_id }),
			...(type && { type }),
			...(address && { address }),
			...(phone_number && { phone_number })
		};
		try {
			const validatedData = providerSchema.parse(dataToValidate);
			if (slug) {
				const editProvider = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/providers/${slug}/`, {
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
				const createProvider = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/providers/`, {
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

		const slug = formData.get('slug') as string;

		const deleteProvider = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/providers/${slug}/`, {
			method: 'delete'
		});
		if (deleteProvider.ok) {
			return { success: true };
		} else {
			console.log(deleteProvider);
		}
	}
};
