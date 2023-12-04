import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export const handleFetch = async ({ request, fetch, event }) => {

	if (request.url.startsWith(PUBLIC_API_ENDPOINT)) {
	request.headers.set('Content-type', 'application/json');
	request.headers.set('Accept', 'application/json');
		request.headers.set('origin', event.url.origin)
		// console.log(event.url.origin);
		
	const access = event.cookies.get('access');
	if (access) {
	// console.log('token is available')
	request.headers.set('Authorization', `Bearer ${access}`);
	
	}
}



	// console.log('hey');
	
	
	return fetch(request);
};

