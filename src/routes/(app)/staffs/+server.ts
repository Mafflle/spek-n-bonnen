import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export const GET = async ({ request, url }) => {
	const access = request.headers.get('access');
	const search = url.searchParams.get('search');

	const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/groups?search=${search}`, {
		headers: {
			Authorization: `Bearer ${access}`
		}
	});

	// console.log(res.headers.get('Authorization'));

	if (res.ok) {
		const filteredPerms = await res.json();
		filteredPerms.results = filteredPerms.results.map((perm) => {
			return {
				value: perm.id,
				label: perm.name
			};
		});

		return new Response(JSON.stringify(filteredPerms), { status: 200 });
	} else {
		return new Response(JSON.stringify({ message: 'Unable to fetch permissions' }), {
			status: 404
		});
	}
};
