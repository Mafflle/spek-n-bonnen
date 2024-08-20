import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { HandleFetch } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

import type { RequestEvent } from './routes/$types';

// Helper functions for token management

export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
	let access = event.cookies.get('access');

	// if (request.url.startsWith(PUBLIC_API_ENDPOINT)) {
	request.headers.set('Origin', event.url.origin);
	if (!request.url.includes('/images/')) {
		request.headers.set('Content-Type', 'application/json');
	}

	if (access) {
		request.headers.set('Authorization', `Bearer ${access}`);
	}

	// Make the initial request
	let response = await fetch(request.clone()); // Clone to allow retrying

	// Retry if 401 Unauthorized

	if (response.ok) {
		return response;
	} else {
		let refreshToken = event.cookies.get('refresh');
		const retryTokens = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/refresh/`, {
			method: 'POST',
			body: JSON.stringify({ refresh: refreshToken }),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});

		if (retryTokens.ok) {
			const tokens = await retryTokens.json();
			console.log('Successfully refreshed tokens');

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

			access = event.cookies.get('access');
			request.headers.delete('Authorization');
			request.headers.set('Authorization', `Bearer ${access}`);

			let newRequest = await fetch(request.clone());

			return newRequest;
		} else {
			console.log('Unable to refresh tokens');
			return response;
		}
	}

	// console.log('hey');
};

export async function handle({ event, resolve }) {
	const { url, fetch } = event;
	const currUrl = url.pathname;

	try {
		const profileResponse = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/`, {
			headers: {
				Authorization: `Bearer ${event.cookies.get('access')}`
			}
		});

		if (profileResponse.ok) {
			const user = await profileResponse.json();
			event.locals.user = user; // Set user data in event.event.locals
		} else if (profileResponse.status === 401) {
			let refreshToken = event.cookies.get('refresh');
			const retryTokens = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/refresh/`, {
				method: 'POST',
				body: JSON.stringify({ refresh: refreshToken }),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			});
			if (retryTokens.ok) {
				const tokens = await retryTokens.json();

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
				const retryProfileFetch = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/`, {
					headers: {
						Authorization: `Bearer ${event.cookies.get('access')}`
					}
				});
				if (retryProfileFetch.ok) {
					const profile = await retryProfileFetch.json();
					event.locals.user = profile;
				}
			}
			throw redirect(302, `/auth/login?from=${currUrl}`);
		} else {
			// Handle other errors from fetching profile
			throw new Error('Failed to fetch user profile');
		}
	} catch (error) {
		console.error('Error in hooks.server.js:', error);
		// Handle errors appropriately (e.g., redirect to error page)
	}

	const response = await resolve(event);
	return response;
}
