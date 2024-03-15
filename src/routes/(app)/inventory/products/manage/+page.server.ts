import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const getPrimals = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/primals/`);
	const getTags = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/tags/`);
	const getMainGroups = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/main_groups/`);

	console.log(getPrimals.statusText);
	if (getPrimals.ok && getTags.ok && getMainGroups.ok) {
		const primals = await getPrimals.json();
		const tags = await getTags.json();
		const groups = await getMainGroups.json();

		return {
			primals: primals.results,
			tags: tags.results,
			groups: groups.results
		};
	}
};
