import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export const handleFetch = async ({ request, fetch, event }) => {
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

	// console.log('hey');

	return fetch(request);
};

export const handle = async ({ event, resolve }) => {
	const access = event.cookies.get('access');
	const refresh = event.cookies.get('refresh');

	// console.log(access);
	if (access && refresh) {
		event.locals.accessToken = access;
		event.locals.refreshToken = refresh;
		event.request.headers.set('Authorization', `Bearer ${access}`);
	}

	return await resolve(event);
};
