import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, url, cookies }) => {
	const checkIfAdminExist = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/admin-exists/`);
	let currUrl = url.pathname;
	if (checkIfAdminExist.ok) {
		const adminExists = await checkIfAdminExist.json();

		if (adminExists.admin_exists === false && currUrl !== 'setup-admin') {
			cookies.delete('access', { path: '/' });
			cookies.delete('refresh', { path: '/' });

			throw redirect(302, `/auth/setup-admin`);
		}
	}
};
