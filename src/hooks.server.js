import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import axios from 'axios';

/** @type {import('@sveltejs/kit').HandleFetch} */
export const handleFetch = ({ request, fetch }) => {
	//Intercepts all fetch request made using the native fetch web api

	// if (request.url.startsWith('http://localhost:5173/')) {
	// 	request = new Request(
	// 		request.url.replace('http://localhost:5173/', `${PUBLIC_API_ENDPOINT}`),
	// 		request
	// 	);
	// }
	return fetch(request);
};

/** @type {import('@sveltejs/kit').Handle} */
// export const handle = async ({ event, resolve }) => {
// 	// console.log('cookies', event.cookies.getAll());
// 	if (!event.locals.user) {
// 		const res = await fetch(`${PUBLIC_API_ENDPOINT}auth/profile`);
// 		// console.log(res.url);
// 		if (res.ok) {
// 			const user = await res.json();
// 			console.log('works');
// 			event.locals.user = user;
// 		} else {
// 			// console.log(res);
// 		}
// 	}
// 	return resolve(event);
// };
