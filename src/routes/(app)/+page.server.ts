import { PUBLIC_API_ENDPOINT } from "$env/static/public";
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { currentUser } from "$lib/user";

export const actions: Actions = {
  logout: async ({ cookies }) => {
    cookies.delete('access')
    cookies.delete('refresh ');
    currentUser.set(null)
    throw redirect(302, 'auth/login');
    
  }
};