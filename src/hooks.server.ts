import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { HandleFetch } from '@sveltejs/kit';

import type { Cookies } from '@sveltejs/kit';

// Helper functions for token management

export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
	const access = event.cookies.get('access');

	if (request.url.startsWith(PUBLIC_API_ENDPOINT)) {
		request.headers.set('Origin', event.url.origin);
		if (!request.url.includes('/images/')) {
			request.headers.set('Content-Type', 'application/json');
		}

		if (access) {
			request.headers.set('Authorization', `Bearer ${access}`);
		}
	}

	async function refreshTokens(): Promise<boolean> {
		const refreshToken = event.cookies.get('refresh');

		if (!refreshToken) {
			throw new Error('Refresh token not found');
		}

		const response = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/refresh/`, {
			method: 'POST',
			body: JSON.stringify({ refresh: refreshToken }),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			// console.log(response.statusText);

			const errorbody = await response.json();
			console.log('error fetching account', errorbody);
			return false;
		}

		const tokens = await response.json();
		console.log('Successfully refreshed tokens');

		event.cookies.set('access', tokens.access, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 30
		});
		event.cookies.set('refresh', tokens.refresh, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 30
		});

		return true;
	}

	const retryRequest = async (attempt = 1) => {
		const maxAttempts = 4; // Adjust as needed
		const delay = Math.pow(2, attempt - 1) * 1000;
		console.log(maxAttempts, attempt);

		if (await refreshTokens()) {
			const res = await fetch(request.clone());
			return res;
		}

		// const newAccessToken: string | undefined = event.cookies.get('access');
		// if (newAccessToken) {
		// 	request.headers.set('Authorization', `Bearer ${newAccessToken}`);
		// }

		console.error('Error refreshing token:', error);

		if (attempt < maxAttempts) {
			await new Promise((resolve) => setTimeout(resolve, delay));
			//  console.log(refreshTokens.status, refreshTokens.statusText);
			//  console.log('errorbody', errorBody);

			//when refresh fails, it tries again for confirmation
			console.log(`Refresh attempt ${attempt} failed, retrying in ${delay}ms`);
			// wait for a bit before refreshing
			// after timeout refresh begins till its over *note the previous value of 'attempt' will be used due to closure
			await retryRequest(attempt + 1);
		}
	};

	const res = await fetch(request.clone());

	console.log(res.url, res.status);

	if (!res.ok && res.status === 401 && !res.url.includes('auth')) {
		console.log('Request intercepted with 401 status');
		await retryRequest();
		console.log('done');
	}
	return res;
	// console.log('hey');
};

export const handle = async ({ event, resolve }) => {
	const access = event.cookies.get('access');

	if (!access) {
		return await resolve(event);
	}

	async function refreshTokens(): Promise<boolean> {
		const refreshToken = event.cookies.get('refresh');

		if (!refreshToken) {
			throw new Error('Refresh token not found');
		}

		const response = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/refresh/`, {
			method: 'POST',
			body: JSON.stringify({ refresh: refreshToken }),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			// console.log(response.statusText);

			const errorbody = await response.json();
			console.log('error', errorbody);
			return false;
		}

		const tokens = await response.json();
		console.log('Successfully refreshed tokens');

		event.cookies.set('access', tokens.access, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 30
		});
		event.cookies.set('refresh', tokens.refresh, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 30
		});

		return true;
	}

	if (!event.url.pathname.includes('auth')) {
		const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/`, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access}`
			}
		});

		const retryRequest = async (attempt = 1) => {
			const maxAttempts = 4; // Adjust as needed
			const delay = Math.pow(2, attempt - 1) * 1000;
			console.log(maxAttempts, attempt);

			if (await refreshTokens()) {
				const newAccessToken: string | undefined = event.cookies.get('access');
				const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/`, {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${newAccessToken}`
					}
				});
				// console.log('here we go');

				if (res.ok) {
					const user = await res.json();
					event.locals.user = user;
					// console.log('user', user);

					return await resolve(event);
				}
			}

			if (attempt < maxAttempts) {
				await new Promise((resolve) => setTimeout(resolve, delay));
				//  console.log(refreshTokens.status, refreshTokens.statusText);
				//  console.log('errorbody', errorBody);

				//when refresh fails, it tries again for confirmation
				console.log(`Refresh attempt ${attempt} failed, retrying in ${delay}ms`);
				// wait for a bit before refreshing
				// after timeout refresh begins till its over *note the previous value of 'attempt' will be used due to closure
				await retryRequest(attempt + 1);
			} else if (attempt >= maxAttempts) {
				console.log(attempt, 'attempts exceeded');

				event.cookies.delete('access', { path: '/' });
				event.cookies.delete('refresh', { path: '/' });
			}
		};

		if (res.ok) {
			const user = await res.json();
			event.locals.user = user;
		} else if (!res.ok) {
			// console.log(res.status);

			await retryRequest();
			return await resolve(event);
		}
	}

	return await resolve(event);
};
