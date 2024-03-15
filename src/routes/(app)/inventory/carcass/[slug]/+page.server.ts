import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { PageServerLoad } from '../$types';
import { z } from 'zod';
import dayjs from 'dayjs';
import { redirect } from '@sveltejs/kit';

const batchSchema = z.object({
	carcass_id: z.number({
		required_error: 'carcass is required'
	}),
	primal_id: z.number({
		required_error: 'primal is required'
	}),
	ean_barcode: z.string({
		required_error: 'ean barcode is required'
	}),
	quantity: z
		.number({
			required_error: 'Quantity is required'
		})
		.min(-2147483648, 'Quantity below minumum acceptable')
		.max(2147483647, 'Quantity above maximum acceptable'),
	expiry_date: z.coerce
		.date({
			required_error: 'Date is required'
		})
		.transform((val) => dayjs(val).format('YYYY-MM-DD'))
});

export const load = async ({ fetch, params, cookies }) => {
	if (params.slug) {
		const getCarcass = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/carcasses/${params.slug}`);
		const getPrimals = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/primals/`);
		const getBatches = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/batches/`);
		if (getCarcass.ok && getPrimals.ok) {
			const carcass = getCarcass.json();
			const primals = getPrimals.json();
			const batches = getBatches.json();
			const access = cookies.get('access');

			return {
				carcass,
				primals,
				batches,
				access
			};
		} else if (getCarcass.status === 404) {
			throw redirect(302, '/inventory/carcass?message=This carcass does not exist&&type=error');
		}
	} else {
		throw redirect(302, '/inventory/carcass?message=This carcass does not exist&&type=error');
	}
};

export const actions = {
	'manage-batch': async ({ fetch, request, cookies, url }) => {
		const formData = await request.formData();

		const batch_id = formData.get('batch_id');
		const primal_id = Number(formData.get('primal_id'));
		const carcass_id = Number(formData.get('carcass_id'));
		const ean_barcode = formData.get('ean_barcode');
		const quantity = Number(formData.get('quantity'));
		const expiry_date = dayjs(formData.get('expiry_date') as string).format('YYYY-MM-DD');

		const dataToValidate = {
			...(batch_id && { batch_id }),
			primal_id,
			carcass_id,
			ean_barcode,
			quantity,
			expiry_date
		};

		try {
			const validatedData = batchSchema.parse(dataToValidate);

			if (validatedData.batch_id > 0) {
				// Update existing batch
				const response = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/batches/${validatedData.batch_id}`, {
					method: 'PUT',
					body: JSON.stringify(validatedData),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${cookies.get('access')}`
					}
				});

				if (response.ok) {
					const updatedBatch = await response.json();
					return {
						updatedBatch,
						edited: true
					};
				} else if (response.status === 400) {
					const badBody = await response.json();
					console.log(badBody);
				} else if (response.status === 401) {
					throw redirect(302, `/auth/login?from=${url.pathname}`);
				} else {
					console.log(response);
				}
			} else {
				// Create new batch
				const response = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/batches/`, {
					method: 'POST',
					body: JSON.stringify(validatedData),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${cookies.get('access')}`
					}
				});

				if (response.ok) {
					const newBatch = await response.json();
					return {
						newBatch
					};
				} else if (response.status === 400) {
					const badBody = await response.json();
					console.log(badBody);
				} else if (response.status === 401) {
					throw redirect(302, `/auth/login?from=${url.pathname}`);
				} else {
					console.log(response);
				}
			}
		} catch (error) {
			const toSend = {
				message: 'Ooops something went wrong',
				errors: {} as Error
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
	delete: async ({ fetch, request, cookies }) => {
		const formData = await request.formData();
		const batch_id = Number(formData.get('batch_id'));
		const response = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/batches/${batch_id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${cookies.get('access')}`
			}
		});
		if (response.ok) {
			console.log('response', response);
			return { status: 200 };
		} else {
			const errorData = await response.json(); // Extract error data from response
			console.log('error', errorData);
			return { status: 400, error: errorData }; // Return error data instead of response object
		}
	}
};
