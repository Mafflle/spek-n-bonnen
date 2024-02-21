import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export const load: LayoutServerLoad = async ({ cookies, fetch, url, locals }) => {
	let currUrl = url.pathname;

	if (locals.user) {
		const allPermission = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/permissions/`);
		const user = locals.user;
		// console.log(user);

		const permissions = await allPermission.json();
		const getImages = await fetch(`${PUBLIC_API_ENDPOINT}api/images/?limit=10`);

		if (getImages.ok && allPermission.ok) {
			const images = await getImages.json();

			return { images, user, permissions };
		} else if (getImages.status === 401) {
			throw redirect(302, `/auth/login?from=${currUrl}`);
		}
	} else if (!locals.user) {
		throw redirect(302, `/auth/login?from=${currUrl}`);
	}
};
