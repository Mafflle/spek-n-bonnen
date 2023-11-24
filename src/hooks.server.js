/** @type {import('@sveltejs/kit').HandleFetch} */

export const handleFetch = ({ request, fetch }) => {
	//Intercepts all fetch request made using the native fetch web api
	request.headers.set('Content-type', 'application/json');

	// if (request.url.startsWith('http://localhost:5173/')) {
	// 	request = new Request(
	// 		request.url.replace('http://localhost:5173/', `${PUBLIC_API_ENDPOINT}`),
	// 		request
	// 	);
	// }
	return fetch(request);
};
