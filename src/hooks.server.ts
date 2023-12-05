import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export const handleFetch = async ({ request, fetch, event }) => {
	if (request.url.startsWith(PUBLIC_API_ENDPOINT)) {
		request.headers.set('Origin', event.url.origin);
		request.headers.set('Content-Type', 'application/json');

		const access = event.cookies.get('access');

		if (access) {
			request.headers.set('Authorization', `Bearer ${access}`);
		}
	}

	// console.log('hey');

	return fetch(request);
};
