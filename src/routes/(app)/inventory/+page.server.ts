import { getInventory } from '$lib/api';

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