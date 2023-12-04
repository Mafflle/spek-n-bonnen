
import { PUBLIC_API_ENDPOINT } from "$env/static/public";
import { currentUser, getCurrentUser, initCurrentUser} from "$lib/user";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";


export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  
  
};