import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { HandleFetch } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
	if (request.url.startsWith(PUBLIC_API_ENDPOINT)) {
		let access = event.cookies.get('access');
		console.log(event.url.origin);

		let requestUrl = request.url.replace(`${PUBLIC_API_ENDPOINT}`, '');
		request.headers.set('Origin', event.url.origin);
		if (!request.url.includes('/images/')) {
			request.headers.set('Content-Type', 'application/json');
		}

		if (access && requestUrl !== 'auth/me') {
			request.headers.set('Authorization', `Bearer ${access}`);
		}

		// Make the initial request

		let clonedRequest = request.clone();
		let response = await fetch(clonedRequest); // Clone to allow retrying

		if (response.ok) {
			return response;
		} else if (response.status === 401 && !requestUrl.includes('auth/login/')) {
			const responseTokens = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/refresh/`, {
				method: 'POST',
				body: JSON.stringify({ refresh: event.cookies.get('refresh') }),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			});

			if (responseTokens.ok) {
				let tokens = await responseTokens.json();
				if (tokens) {
					event.cookies.set('access', tokens.access, {
						httpOnly: true,
						secure: false,
						sameSite: 'lax',
						path: '/'
					});
					event.cookies.set('refresh', tokens.refresh, {
						httpOnly: true,
						secure: false,
						sameSite: 'lax',
						path: '/'
					});

					request.headers.set('Authorization', `Bearer ${tokens.access}`);

					try {
						let newClonedRequest = request.clone();
						let newRequest = await fetch(newClonedRequest);
						return newRequest;
					} catch (error) {
						console.log(request);

						console.error('Error in fetch request:', error);
						throw new Error('Failed to fetch');
					}
				}
			} else {
				const error = await responseTokens.json();
				// console.log(error);

				console.log('refresh error', responseTokens.status);
			}
		} else if (!response.ok) {
			console.log(response);
		} else if (response.status === 504) {
			console.log('Gateway Timeout');
		} else {
			console.log('failed here', response.url, response.status);
		}
		return response;
	}
	const response = await fetch(request);
	return response;
};

export async function handle({ event, resolve }) {
	const { url, fetch } = event;
	const currUrl = url.pathname;

	if (event.locals.adminExists == null) {
		const checkIfAdminExist = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/admin-exists/`);
		let currUrl = url.pathname;
		if (checkIfAdminExist.ok) {
			const adminExists = await checkIfAdminExist.json();
			// event.cookies.set('adminExists', adminExists.admin_exists, {
			// 	httpOnly: true,
			// 	secure: false,
			// 	sameSite: 'lax',
			// 	path: '/'
			// });
			event.locals.adminExists = adminExists.admin_exists;
			if (adminExists.admin_exists === false && !currUrl.includes('setup-admin')) {
				throw redirect(302, `/auth/setup-admin`);
			}
		}
	}

	if (!event.locals.user && !currUrl.startsWith('/auth')) {
		try {
			const profileResponse = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/`, {
				headers: {
					Authorization: `Bearer ${event.cookies.get('access')}`
				}
			});

			if (profileResponse.ok) {
				const user = await profileResponse.json();
				event.locals.user = user; // Set user data in event.event.locals
			} else {
				console.log('profile', profileResponse.status);

				console.log('Failed to fetch user profile');
			}
		} catch (error) {
			console.error('Error in hooks.server.js:', error);
		}
	}

	if (!event.locals.user && !currUrl.startsWith('/auth')) {
		event.cookies.delete('access', { path: '/' });
		event.cookies.delete('refresh', { path: '/' });
		redirect(302, `/auth/login?from=${currUrl}`);
	}

	const response = await resolve(event);

	return response;
}
