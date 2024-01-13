import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import { currentUser, getCurrentUser, initCurrentUser } from '$lib/user';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export const load: LayoutServerLoad = async ({ cookies, fetch, url }) => {
	const access = cookies.get('access');
	const refresh = cookies.get('refresh');
	// console.log(access, refresh);

	if (access) {
		await initCurrentUser(access, cookies, refresh);
		// console.log('works');
	} else {
	}
	const currUser = getCurrentUser();
	const currUrl = url.pathname;
	// console.log('curr', currUrl);

	if (currUser === null || !currUser) {
		throw redirect(302, `/auth/login?from=${currUrl}`);
	}

	const getImages = await fetch(`${PUBLIC_API_ENDPOINT}api/images/?limit=10`);

	if (getImages.ok) {
		const images = await getImages.json();

		return { currUser, images };
	}
	console.log(getImages);
};
