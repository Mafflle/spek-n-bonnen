import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import { currentUser, getCurrentUser } from '$lib/user';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export const load: LayoutServerLoad = async ({ cookies, fetch, url }) => {
	const access = cookies.get('access');
	// const refresh = cookies.get('refresh');
	// // console.log(access, refresh);

	// if (access) {
	// 	await initCurrentUser(access, cookies, refresh);
	// 	// console.log('works');
	// } else {
	// }

	// const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/`, {
	// 	headers: {
	// 		Accept: 'application/json',
	// 		'Content-Type': 'application/json',
	// 		Authorization: `Bearer ${access}`
	// 	}
	// });
	// // console.log(res);

	// if (res.ok) {
	// 	const user = await res.json();
	// 	currentUser.set(user);
	// 	const getImages = await fetch(`${PUBLIC_API_ENDPOINT}api/images/?limit=10`);

	// 	if (getImages.ok) {
	// 		const images = await getImages.json();

	// 		return { images };
	// 	} else if (getImages.status === 401) {
	// 		throw redirect(302, `/auth/login?from=${url.pathname}`);
	// 	}
	// } else if (!res.ok && res.status === 401) {
	// 	currentUser.set(null);
	// 	throw redirect(302, `/auth/login?from=${url.pathname}`);
	// }
};
