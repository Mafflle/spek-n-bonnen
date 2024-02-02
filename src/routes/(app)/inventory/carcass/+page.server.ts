import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const getAllCarcasses = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/carcasses/`);

	if (getAllCarcasses.ok) {
		const carcasses = await getAllCarcasses.json();

		return {
			carcasses
		};
	}
};
