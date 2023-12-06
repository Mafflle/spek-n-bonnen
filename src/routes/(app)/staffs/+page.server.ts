import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { showToast } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/groups/`);

	if (res.ok) {
		const groups = await res.json();

		return {
			groups
		};
	} else if (!res.ok) {
		console.log(res);

		showToast('Error fetching permissions', 'error');
	}
};
