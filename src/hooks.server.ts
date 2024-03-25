import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { HandleFetch } from '@sveltejs/kit';

export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
	if (request.url.startsWith(PUBLIC_API_ENDPOINT)) {
		request.headers.set('Origin', event.url.origin);
		if (!request.url.includes('/images/')) {
			request.headers.set('Content-Type', 'application/json');
		}
		const access = event.cookies.get('access');

		if (access) {
			request.headers.set('Authorization', `Bearer ${access}`);
		}
	}

	const retryRequest = async (attempt = 1) => {
		const maxAttempts = 4; // Adjust as needed
		const delay = Math.pow(2, attempt - 1) * 1000;
		console.log(maxAttempts, attempt);

		try {
			const refreshToken = event.cookies.get('refresh');
			// refreshes tokens
			const refreshTokens = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/refresh/`, {
				method: 'POST',
				body: JSON.stringify({ refresh: refreshToken }),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			});
			if (refreshTokens.ok) {
				const tokens = await refreshTokens.json();
				console.log('successfully refreshed');

				event.cookies.set('access', tokens.access, {
					httpOnly: true,
					secure: true,
					sameSite: 'lax',
					path: '/'
				});
				event.cookies.set('refresh', tokens.refresh, {
					httpOnly: true,
					secure: true,
					sameSite: 'lax',
					path: '/'
				});

				const newAccessToken: string | undefined = event.cookies.get('access');
				if (newAccessToken) {
					request.headers.set('Authorization', `Bearer ${newAccessToken}`);
				}
				const res = await fetch(request.clone());
				return res;
			}
		} catch (error) {
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
		}
	};

	const res = await fetch(request.clone());

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
	const retryRequest = async (attempt = 1) => {
		const maxAttempts = 4; // Adjust as needed
		const delay = Math.pow(2, attempt - 1) * 1000;
		console.log(maxAttempts, attempt);

		try {
			console.log('refreshing');

			const refreshToken = event.cookies.get('refresh');
			// refreshes tokens
			const refreshTokens = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/refresh/`, {
				method: 'POST',
				body: JSON.stringify({ refresh: refreshToken }),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			});
			if (refreshTokens.ok) {
				const tokens = await refreshTokens.json();
				console.log('successfully refreshed');

				event.cookies.set('access', tokens.access, {
					httpOnly: true,
					secure: true,
					sameSite: 'lax',
					path: '/'
				});
				event.cookies.set('refresh', tokens.refresh, {
					httpOnly: true,
					secure: true,
					sameSite: 'lax',
					path: '/'
				});
			}
		} catch (error) {
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
		}
	};
	if (!event.url.pathname.includes('auth')) {
		const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/`, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access}`
			}
		});

		if (res.ok) {
			const user = await res.json();
			event.locals.user = user;
		} else if (!res.ok) {
			try {
				await retryRequest();
			} finally {
				const newAccessToken: string | undefined = event.cookies.get('access');
				if (newAccessToken) {
					const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/`, {
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							Authorization: `Bearer ${access}`
						}
					});

					if (res.ok) {
						const user = await res.json();
						event.locals.user = user;
					}
				}
			}
		}
	}

	return await resolve(event);
};
