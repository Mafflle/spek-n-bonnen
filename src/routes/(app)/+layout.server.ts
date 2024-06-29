import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export const load: LayoutServerLoad = async ({ cookies, fetch, url, locals }) => {
	let currUrl = url.pathname;

	if (locals.user) {
		const allPermission = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/permissions/`);
		const getImages = await fetch(`${PUBLIC_API_ENDPOINT}api/images/?limit=10`);
		const user = locals.user;

		// console.log(url.pathname);

		if (locals.user.staff_profile === null && url.pathname !== '/settings') {
			throw redirect(302, '/settings?staff_profile=null');
		}

		// console.log(getImages.status);

		if (getImages.ok && allPermission.ok) {
			const permissions = await allPermission.json();
			const images = await getImages.json();

			return { images, user, permissions };
		} else if (getImages.status === 401) {
			// console.log(getImages.status);
			// console.log(allPermission.status);

			throw redirect(302, ` /auth/login?from=${currUrl}`);
		}
	} else if (!locals.user) {
		cookies.delete('access', { path: '/' });
		cookies.delete('refresh', { path: '/' });
		throw redirect(302, `/auth/login?from=${currUrl}`);
	}
};
