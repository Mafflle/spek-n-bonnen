import { check } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (check('view_carcass', locals.user)) {
		throw redirect(302, "/?message=You don't have the permission to view this page&&type=info");
	}
};
