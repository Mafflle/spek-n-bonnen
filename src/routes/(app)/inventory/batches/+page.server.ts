import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { PageServerLoad } from '../$types';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { z } from 'zod';

const createBatchSchema = z.object({
	name: z
		.string({ required_error: 'Batch name is required' })
		.trim()
		.min(3, { message: 'Batch name should be at least 3 characters ' })
});

type Errors = {
	name?: [string];
	server?: [string];
};

export const load: PageServerLoad = async ({ fetch, url }) => {
	const getAllBatches = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/batches/`);

	if (getAllBatches.ok) {
		const batches = await getAllBatches.json();
		console.log(batches);
		return {
			batches
		};
	} else {
		return {
			status: getAllBatches.status,
			error: 'Failed to fetch batches'
		};
	}
};
export const actions: Actions = {
	'manage-batch': async ({ fetch, request }) => {
		const formData = await request.formData();

		const id = formData.get('batch-id');
		const name = formData.get('batch-name');

		const dataToValidate = {
			...(name && { name })
		};

		try {
			const validatedData = createBatchSchema.parse(dataToValidate);

			if (id) {
				const editBatches = await fetch(
					`${PUBLIC_API_ENDPOINT}api/inventory/batches/${id}/`,
					{
						method: 'PUT',
						body: JSON.stringify(validatedData)
					}
				);

				if (editBatches.ok) {
					const updatedBatch = await editBatches.json();
					return {
						batch: updatedBatch,
						edited: true
					};
				} else if (editBatches.status === 400) {
					const badBody = await editBatches.json();
					console.log(badBody);
				} else if (editBatches.status == 401) {
					throw redirect(302, `/auth/login?from=${url.pathname}`);
				} else {
					console.log(editBatches);
				}
			} else {
				const createBatch = await fetch(
					`${PUBLIC_API_ENDPOINT}api/inventory/batches/`,
					{
						method: 'POST',
						body: JSON.stringify(validatedData)
					}
				);

				if (createBatch.ok) {
					const newBatch = await createBatch.json();
					return {
						batch: newBatch
					};
				} else if (createBatch.status === 400) {
					const badBody = await createBatch.json();
					console.log(badBody);
				} else if (createBatch.status == 401) {
					throw redirect(302, `/auth/login?from=${url.pathname}`);
				} else {
					console.log(createBatch);
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

		const id = formData.get('batch-id');
		if (id) {
			const deleteBatch = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/batches/${id}/`, {
				method: 'delete'
			});

			if (deleteBatch.ok) {
				return {
					success: true
				};
			} else if (!deleteBatch.ok) {
				console.log(deleteBatch);
			}
		} else return fail(400);
	}
};
