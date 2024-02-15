import { PUBLIC_API_ENDPOINT } from "$env/static/public";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ fetch, params }) => {
    const getCarcass = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/carcasses/${params.slug}`)
    if(getCarcass.ok){
        const carcass = getCarcass.json()
        return{
            carcass
        }
    }
}