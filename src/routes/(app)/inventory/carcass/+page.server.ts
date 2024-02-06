import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { showToast } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const getAllCarcasses = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/carcasses/`);

	if (getAllCarcasses.ok) {
		const carcasses = await getAllCarcasses.json();

		return {
			carcasses
		};
	}
};

export const actions = {
	delete: async ({ cookies, request }) => {
		const data = await request.formData();
		const id = data.get('carcass-id');
		const response = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/carcasses/${id}`, {
			method: 'DELETE',
		});

		if (response.ok) {
			showToast('Carcass deleted successfully', 'success');
			return { status: 200 };
		} else {
			// handle error
			const error = await response.json();
			showToast('Failed to delete carcass', 'error');
			return { status: response.status, error };
		}
	}
}