import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getCurrentUser } from '$lib/user';
import { goto } from '$app/navigation';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const currentUser = getCurrentUser();
	const access = cookies.get('access');
	if (currentUser) {
		throw redirect(302, '/');
	}
};
