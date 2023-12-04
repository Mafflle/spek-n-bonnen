import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export const handleFetch = async ({ request, fetch, event }) => {
	//Intercepts all fetch request made using the native fetch web api

	request.headers.set('Content-type', 'application/json');
	request.headers.set('Accept', 'application/json');
		const access = event.cookies.get('access');
// console.log('handleFetch');
if (access) {
	request.headers.set('Authorization', `Bearer ${access}`);
	
}


	// console.log('hey');
	
	
	return fetch(request);
};

