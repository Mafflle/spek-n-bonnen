import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const getMainGroups = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/main_groups/`);

	if (getMainGroups.ok) {
		const groups = await getMainGroups.json();
		return {
			groups
		};
	} else {
		console.log(getMainGroups);
	}
};

export const actions: Actions = {
	delete: async ({ fetch, request }) => {
		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string);

		if (!isNaN(id)) {
			const deleteGroup = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/main_groups/${id}/`, {
				method: 'delete'
			});

			if (deleteGroup.ok) {
				return {
					deleted: true
				};
			} else {
				console.log(deleteGroup);
				return fail(500);
			}
		}
	}
};
