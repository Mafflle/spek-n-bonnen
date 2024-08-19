import type { PageServerLoad } from './$types';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export const load: PageServerLoad = async ({ fetch }) => {
	const getAllProducts = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/product/`);
	const getAllProductType = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/product-type/`);

	if (getAllProducts.ok && getAllProductType.ok) {
		const allProducts = await getAllProducts.json();
		const allProductType = await getAllProductType.json();

		return {
			products: allProducts,
			productTypes: allProductType
		};
	}
};
