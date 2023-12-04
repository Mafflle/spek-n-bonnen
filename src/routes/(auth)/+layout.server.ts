import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getCurrentUser } from "$lib/user";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  const currentUser = getCurrentUser()
  const access = cookies.get('access')
  if (currentUser || access) {
   
  throw redirect(302, '/');
 }
  
  
};