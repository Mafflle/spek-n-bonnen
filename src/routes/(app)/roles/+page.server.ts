import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { client, showToast } from '$lib/utils';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/permissions/?page=1`);
	const rolesRes = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/groups/`);
	const access = cookies.get('access');
	const refresh = cookies.get('refresh');

	if (res.ok && rolesRes.ok) {
		const permissions = await res.json();
		const roles = await rolesRes.json();

		permissions.results = permissions.results.map((perm) => {
			return {
				value: perm.id,
				label: perm.codename
			};
		});

		return {
			permissions,
			roles,
			access,
			refresh
		};
	} else if (!res.ok) {
		console.log('permissions', res);

		showToast('Error fetching permissions', 'error');
	} else if (!rolesRes.ok) {
		console.log('roles', rolesRes);

		showToast('Error fetching roles', 'error');
	}
};
