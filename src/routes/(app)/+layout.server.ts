import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export const load: LayoutServerLoad = async ({ cookies, fetch, url, locals, parent }) => {
	let currUrl = url.pathname;

	try {
		const profileResponse = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/`, {
			headers: {
				Authorization: `Bearer ${cookies.get('access')}`
			}
		});

		if (profileResponse.ok) {
			const user = await profileResponse.json();
			locals.user = user;
		} else if (profileResponse.status === 401) {
			// Handle 401 (unauthorized) - clear cookies and redirect to login
			cookies.delete('access', { path: '/' });
			cookies.delete('refresh', { path: '/' });
			throw redirect(302, `/auth/login?from=${currUrl}`);
		} else {
			// Handle other errors from fetching profile
			throw new Error('Failed to fetch user profile');
		}

		if (locals.user) {
			const allPermission = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/permissions/`, {
				headers: {
					Authorization: `Bearer ${cookies.get('access')}`
				}
			});
			const getImages = await fetch(`${PUBLIC_API_ENDPOINT}api/images/?limit=10`);

			if (locals.user.staff_profile === null && url.pathname !== '/settings') {
				throw redirect(302, '/settings?staff_profile=null');
			}

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

		// Consider returning an error page or appropriate response based on the error type
		// For example:
		// if (error instanceof Redirect) {
		//   throw error; // Re-throw redirect if it's the intended behavior
		// } else {
		//   return {
		//     status: 500,
		//     error: 'Internal Server Error'
		//   };
		// }
	}

	// If no user is found or there's an error, clear cookies and redirect
	cookies.delete('access', { path: '/' });
	cookies.delete('refresh', { path: '/' });
	throw redirect(302, `/auth/login?from=${currUrl}`);
};
