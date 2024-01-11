import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import { currentUser, getCurrentUser, initCurrentUser } from '$lib/user';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export const load: LayoutServerLoad = async ({ cookies, locals, fetch }) => {
	const access = cookies.get('access');
	const refresh = cookies.get('refresh');
	// console.log(access, refresh);

	if (access) {
		await initCurrentUser(access, cookies, refresh);
		// console.log('works');
	} else {
	}
	const currUser = getCurrentUser();
	// console.log('current', currUser);
	if (currUser === null || !currUser) {
		throw redirect(302, 'auth/login');
	}

	const getImages = await fetch(`${PUBLIC_API_ENDPOINT}api/images/`);

	if (getImages.ok) {
		const images = await getImages.json();

		return { currUser, images };
	}
	console.log(getImages);
};
