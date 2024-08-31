import { PUBLIC_API_ENDPOINT } from "$env/static/public";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({params, fetch}) => {
	const res = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/product/${params.id}/`);
    const product = await res.json();
    return { product };
};