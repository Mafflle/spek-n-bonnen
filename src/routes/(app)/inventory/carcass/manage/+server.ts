import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { Brand, ButcherShop, Farm, Manufacturer, SlaughterHouse, Vendor } from '$lib/stores';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, url, fetch }) => {
	const access = request.headers.get('access');
	const endpoint = request.headers.get('to');
	const searchParams = url.searchParams.get('search');

	const search = await fetch(`${PUBLIC_API_ENDPOINT}${endpoint}?search=${searchParams}`, {
		headers: {
			Authorization: `Bearer ${access}`
		}
	});

	if (search.ok) {
		const searchResults = await search.json();

		searchResults.results = searchResults.results.map(
			(item: Vendor | Manufacturer | Brand | Farm | ButcherShop | SlaughterHouse) => {
				return {
					value: item.id,
					label: item.name
				};
			}
		);

		return new Response(JSON.stringify(searchResults), { status: 200 });
	} else {
		return new Response(JSON.stringify({ message: 'Ooops something went wrong' }), {
			status: search.status
		});
	}
};
