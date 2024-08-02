import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
	const access = cookies.get('access');
	const refresh = cookies.get('refresh');
	const previous = url.searchParams.get('from');

	if (access && refresh) {
		console.log('tokens present');

		if (previous) {
			if (previous === '/') {
				throw redirect(302, '/');
			} else throw redirect(302, `${previous}`);
		} else {
			throw redirect(302, '/');
		}
	} else {
		console.log('no tokens');
	}
};
