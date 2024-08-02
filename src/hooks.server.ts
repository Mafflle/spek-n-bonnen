import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { HandleFetch } from '@sveltejs/kit';

import type { Cookies } from '@sveltejs/kit';
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
	// }
	// const response = await fetch(request);

	async function refreshAndRetry(maxAttempts = 3) {
		let attempt = 1;
		while (attempt <= maxAttempts) {
			const refreshToken = event.cookies.get('refresh');

			if (!refreshToken) {
				console.error('Refresh token not found');
				return null;
			}

			try {
				const response = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/refresh/`, {
					method: 'POST',
					body: JSON.stringify({ refresh: refreshToken }),
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					}
				});

				if (response.ok) {
					const tokens = await response.json();
					console.log('Successfully refreshed tokens');

					event.cookies.set('access', tokens.access, {
						path: '/'
					});
					event.cookies.set('refresh', tokens.refresh, {
						path: '/'
					});

					return;
				} else if (response.status === 401) {
					return null;
				} else {
					console.error(`Refresh attempt ${attempt} failed:`, await response.json());
				}
			} catch (error) {
				console.error(`Refresh attempt ${attempt} failed due to a network error:`, error);
			}

			// Exponential backoff with jitter
			const delay = Math.random() * 1000 + Math.pow(2, attempt - 1) * 1000; // 1s, 3s, 7s,...
			console.log(`Retrying token refresh in ${delay / 1000} seconds...`);
			await new Promise((resolve) => setTimeout(resolve, delay));
			attempt++;
		}
		console.error('Max refresh attempts reached. Could not refresh token.');
		return null; // Indicate refresh failure
	}

	// Make the initial request
	let response = await fetch(request.clone()); // Clone to allow retrying

	// Retry if 401 Unauthorized
	if (response.status === 401 && !request.url.includes('auth')) {
		await refreshAndRetry(5);
		access = event.cookies.get('access');
		request.headers.set('Authorization', `Bearer ${access}`);
		response = await fetch(request.clone());
	}

	if (!response.ok) {
		// Handle other errors if needed
		console.log(response.url);

		console.error('API request failed:', response.status, response.statusText);
		// You might want to return a custom error response or throw an error here.
	}

	return response;

	// console.log('hey');
};

export const handle = async ({ event, resolve }) => {
	async function refreshToken(event: RequestEvent): Promise<string | null> {
		const maxAttempts = 5;
		let attempt = 1;
		const delay = 1000; // Initial delay of 1 second

		while (attempt <= maxAttempts) {
			const refreshToken = event.cookies.get('refresh');

			if (!refreshToken) {
				console.error('Refresh token not found');
				return null;
			}

			try {
				const response = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/refresh/`, {
					method: 'POST',
					body: JSON.stringify({ refresh: refreshToken }),
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					}
				});

				if (response.ok) {
					const tokens = await response.json();
					console.log('Successfully refreshed tokens');

					event.cookies.set('access', tokens.access, {
						httpOnly: true,
						secure: true,
						sameSite: 'lax',
						path: '/',
						maxAge: 60 * 60 * 24 * 30 // 30 days
					});
					event.cookies.set('refresh', tokens.refresh, {
						httpOnly: true,
						secure: true,
						sameSite: 'lax',
						path: '/',
						maxAge: 60 * 60 * 24 * 30 // 30 days
					});
					return tokens.access;
				} else if (response.status === 401) {
					return null;
				} else {
					// Log the error for debugging
					const errorBody = await response.json();
					console.error(`Refresh attempt ${attempt} failed:`, errorBody);
				}
			} catch (error) {
				console.error(`Refresh attempt ${attempt} failed due to a network error:`, error);
			}

			// Exponential backoff with jitter
			const jitter = Math.random() * 500; // Add up to 500ms of random jitter
			const nextDelay = delay * Math.pow(2, attempt - 1) + jitter;
			console.log(`Retrying token refresh in ${nextDelay / 1000} seconds...`);
			await new Promise((resolve) => setTimeout(resolve, nextDelay));
			attempt++;
		}

		console.error('Max refresh attempts reached. Could not refresh token.');
		return null;
	}

	if (event.url.pathname.startsWith('/auth') || event.locals.user) {
		return await resolve(event); // Skip user profile fetching for auth routes or existing user data
	}

	const access = event.cookies.get('access');
	if (!access) {
		return await resolve(event); // No access token, skip fetching user profile
	}
	event.locals.accessToken = access;
	try {
		const profileResponse = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/`, {
			headers: {
				Authorization: `Bearer ${access}`
			}
		});

		console.log(profileResponse.url, profileResponse.status);

		if (profileResponse.ok) {
			const user = await profileResponse.json();
			event.locals.user = user;
			event.locals.accessToken = access;
			return await resolve(event);
		} else if (profileResponse.status === 401) {
			const newAccessToken = await refreshToken(event);
			if (newAccessToken) {
				// Retry fetching the user profile with the new access token
				const retryResponse = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/`, {
					headers: {
						Authorization: `Bearer ${newAccessToken}`
					}
				});

				if (retryResponse.ok) {
					const user = await retryResponse.json();
					event.locals.user = user;
					event.locals.accessToken = newAccessToken;
					return await resolve(event);
				} else {
					// Handle the case where even after a successful token refresh, the user profile fetch still fails (e.g., user might be deleted)
					console.error('Failed to fetch user profile after token refresh.');
					return await resolve(event);
				}
			} else {
				event.locals.user = null;
				return await resolve(event);
			}
		} else {
			// Handle other error responses (e.g., 500 Internal Server Error)
			console.error('Unexpected error fetching user profile:', profileResponse.status);
			return await resolve(event);
		}
	} catch (error) {
		// Handle potential network errors
		console.error('Network error fetching user profile:', error);
		return await resolve(event);
	}
};
