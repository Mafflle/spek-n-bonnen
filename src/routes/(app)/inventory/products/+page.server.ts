import type { PageServerLoad } from './$types';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export const load: PageServerLoad = async ({ fetch }) => {
	const getAllProducts = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/product/`);

	if (getAllProducts.ok) {
		const allProducts = await getAllProducts.json();
		return {
			products: allProducts
		};
	}
};
