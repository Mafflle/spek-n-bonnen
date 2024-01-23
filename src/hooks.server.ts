import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { HandleFetch } from '@sveltejs/kit';

export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
	const refreshToken = event.cookies.get('refresh');
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

	const retryRequest = async (attempt = 1) => {
		const maxAttempts = 4; // Adjust as needed
		const delay = Math.pow(2, attempt - 1) * 1000;
		console.log(maxAttempts, attempt);

		// refreshes tokens
		const refreshTokens = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/refresh/`, {
			method: 'POST',
			body: JSON.stringify({ refresh: refreshToken }),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});

		// upon successfull token refresh
		console.log('refreshing', refreshTokens);

		if (attempt < maxAttempts && refreshTokens.ok) {
			console.log('successfully refreshed');

			const tokens = await refreshTokens.json();
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
				request.headers.set('Authorization', `Bearer ${access}`);
			}
			console.log('request headers set');
		} else if (attempt < maxAttempts && !refreshTokens.ok) {
			console.log(refreshTokens.status, refreshTokens.statusText);

			//when refresh fails, it tries again for confirmation
			console.log(`Refresh attempt ${attempt} failed, retrying in ${delay}ms`);
			// wait for a bit before refreshing
			await new Promise((resolve) => setTimeout(resolve, delay));
			// after timeout refresh begins till its over *note the previous value of 'attempt' will be used due to closure
			await retryRequest(attempt + 1);
		} else {
			// can't think of anything better to do here
			event.cookies.delete('access');
			event.cookies.delete('refresh');
		}
	};

	const res = fetch(request.clone());

	if (!(await res).ok && (await res).status === 401) {
		const body = await (await res).json();
		console.log('response', body);

		console.log('request intercepted');
		await retryRequest();
	}
	return fetch(request.clone())
		.then((res) => res)
		.catch((error) => {
			console.log('failed', error);
		});

	// console.log('hey');
};

export const handle = async ({ event, resolve }) => {
	const access = event.cookies.get('access');
	const refresh = event.cookies.get('refresh');

	return await resolve(event);
};
