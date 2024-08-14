import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { Actions, fail } from '@sveltejs/kit';
import { z } from 'zod';

const batchAttrSchema = z.object({
	id: z.number().int().positive().optional(),
	name: z.string().max(300).trim(),
	is_required: z.boolean(),
	default_value: z.union([z.string(), z.number(), z.boolean(), z.null()]).optional(),
	data_type: z.enum(['text', 'select', 'boolean', 'multi-select', 'date', 'number']),
	choice_list: z.array(z.string()).max(50).optional()
});

interface Errors {
	name?: [string];
	batch_attributes?: [string];
	server?: [string];
}

const dataToValidateSchema = z.object({
	name: z
		.string({ required_error: 'Product type name is required' })
		.min(3, { message: 'Product type name should be at least 3 characters' })
		.trim(), // 'name' is optional
	batch_attributes: z.array(batchAttrSchema)
});

export const actions: Actions = {
	manage_type: async ({ fetch, request }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const batch_attributes = formData.get('batch_attributes');

		const dataToValidate = {
			...(name && { name }),
			...(batch_attributes && { batch_attributes })
		};

		dataToValidate.batch_attributes = JSON.parse(dataToValidate.batch_attributes as string);

		try {
			const validatedData = dataToValidateSchema.parse(dataToValidate);
			console.log(validatedData);
			const createProductType = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/product-type/`, {
				body: JSON.stringify(validatedData),
				method: 'post'
			});
			if (createProductType.ok) {
				const newProductType = await createProductType.json();

				return {
					newProductType
				};
			} else {
				console.log(createProductType.status);
				const body = await createProductType.json();
				return fail(400, body);
			}
		} catch (error) {
			const toSend = { message: 'Ooops something went wrong', errors: {} as Errors };
			if (error instanceof z.ZodError) {
				toSend.errors = error.flatten().fieldErrors;
				toSend.message = 'Validation error';

				return fail(400, toSend);
			}

			return fail(500, { error, message: 'Oooops something went wrong' });
		}
	}
};
