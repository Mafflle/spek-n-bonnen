import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export const GET = async ({ request, url }) => {
	const access = request.headers.get('access');
	const search = url.searchParams.get('search');

	let endpoint = request.headers.get('to');
	let moreQuery = request.headers.get('query');

	let queries = moreQuery ? `?is_staff=true&search=${search}` : `?search=${search}`;
	const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/${endpoint}/${queries}`, {
		headers: {
			Authorization: `Bearer ${access}`
		}
	});

	// console.log(res.status, res.ok, res.url);

	if (res.ok) {
		const filteredResults = await res.json();
		if (endpoint !== 'permissions' && endpoint !== 'groups') {
			return new Response(JSON.stringify(filteredResults), { status: 200 });
		} else {
			filteredResults.results = filteredResults.results.map((perm) => {
				return {
					value: perm.id,
					label: perm.name
				};
			});
			return new Response(JSON.stringify(filteredResults), { status: 200 });
		}
	} else {
		return new Response(JSON.stringify({ message: 'Unable to fetch permissions' }), {
			status: 404
		});
	}
};
