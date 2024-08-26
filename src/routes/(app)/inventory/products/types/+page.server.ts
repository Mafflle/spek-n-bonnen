import type { PageServerLoad } from '../$types';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { check, showToast } from '$lib/utils';
import { fail, type Actions, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, cookies, locals }) => {
	if (check('view_group', locals.user) || check('view_permission', locals.user)) {
		throw redirect(302, "/?message=You don't have the permission to view this page&&type=info");
	}

	const res = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/product-type/`);
	const access = cookies.get('access');
	const refresh = cookies.get('refresh');

	if (res.ok) {
		const types = await res.json();
		return {
			types,
			access,
			refresh
		};
	} else {
		if (!res.ok) {
			showToast('Error fetching types', 'error');
		}
		return {
			permissions: null,
			roles: null,
			access,
			refresh
		};
	}
};

export const actions: Actions = {
	delete_type: async ({ fetch, request }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		if (id) {
			console.log('id', id);
			const deleteType = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/product-type/${id}/`, {
				method: 'DELETE'
			});

			console.log('deleting type');
			if (deleteType.ok) {
				console.log('deleting type ok');
				return { success: true };
			} else {
				console.log('deleting type error');
				return { status: 400, body: { message: 'Error while deleting type' } };
			}
		} else {
			return { status: 400, body: { message: 'Type ID is required for deletion' } };
		}
	}
};
