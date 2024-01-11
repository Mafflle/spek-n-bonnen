import { getInventory } from '$lib/api';
import type { Actions } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
	try {
		const inventory = await getInventory();
		return {
			props: {
				data: inventory
			}
		};
	} catch (error) {
		console.error(error);
		return {
			status: 500,
			error: 'Unable to fetch inventory'
		};
	}
}

export const actions: Actions = {};
