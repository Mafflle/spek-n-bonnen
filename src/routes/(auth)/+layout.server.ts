import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getCurrentUser } from '$lib/user';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
	const currentUser = getCurrentUser();
	const access = cookies.get('access');
	const previous = url.searchParams.get('from');

	if (currentUser) {
		if (previous) {
			if (previous === '/') {
				throw redirect(302, '/');
			} else throw redirect(302, `${previous}`);
		} else {
			throw redirect(302, '/');
		}
	}
};
