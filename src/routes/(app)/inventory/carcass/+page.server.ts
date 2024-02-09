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
	
	search: async ({ cookies, request }) => {
		console.log('searching');
		const data = await request.formData();
		console.log(data);
		const search = data.get('search');
	
		const response = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/carcasses/?search=${search}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.get('access')}`
			}
		});

		if (response.ok) {
			const carcasses = await response.json();
			console.log("carcassss search", carcasses);
			return { carcasses };
		} else {
			// handle error
			const error = await response.json();
			console.log(error);
			return { status: response.status, error };
		}
	},
	delete: async ({ cookies, request }) => {
		const data = await request.formData();
		const id = data.get('carcass-id');
		const response = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/carcasses/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.get('access')}`
			}
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