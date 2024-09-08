import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export const load: LayoutServerLoad = async ({ cookies, fetch, url, locals }) => {
	let currUrl = url.pathname;

	if (locals.user?.staff_profile === null && !currUrl.includes('settings')) {
		redirect(302, '/settings?staff_profile=null/');
	}
	try {
		if (locals.user) {
			const allPermission = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/permissions/`, {
				headers: {
					Authorization: `Bearer ${cookies.get('access')}`
				}
			});
			const getImages = await fetch(`${PUBLIC_API_ENDPOINT}api/images/?limit=10`);

			if (getImages.ok && allPermission.ok) {
				const permissions = await allPermission.json();
				const images = await getImages.json();

				return { images, user: locals.user, permissions };
			} else if (getImages.status === 401 || allPermission.status === 401) {
				// Handle 401 for any of the subsequent fetches
				throw redirect(302, `/auth/login?from=${currUrl}`);
			} else {
				// Handle other errors from fetching permissions or images
				throw new Error('Failed to fetch permissions or images');
			}
		}
	} catch (error) {
		// Centralized error handling
		console.error('Error in layout.server.ts:', error);
	}
};
