import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export const load: LayoutServerLoad = async ({ cookies, fetch, url }) => {
	const access = cookies.get('access');

	let currUrl = url.pathname;

	const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/`, {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access}`
		}
	});
	console.log('user', res.status);

	if (res.ok) {
		const allPermission = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/permissions/`);
		const user = await res.json();
		const permissions = await allPermission.json();
		const getImages = await fetch(`${PUBLIC_API_ENDPOINT}api/images/?limit=10`);

		if (getImages.ok && allPermission.ok) {
			const images = await getImages.json();

			return { images, user, permissions };
		} else if (getImages.status === 401) {
			throw redirect(302, `/auth/login?from=${url.pathname}`);
		}
	} else if (!res.ok) {
		throw redirect(302, `/auth/login?from=${url.pathname}`);
	}
};
