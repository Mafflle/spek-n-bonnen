import { redirect } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";
import { currentUser, getCurrentUser, initCurrentUser } from "$lib/user";

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
 const access = cookies.get('access');
  const refresh = cookies.get('refresh');
  // console.log(access, refresh);
  

  if (access) {
    await initCurrentUser(access, cookies, refresh);
    console.log('works');
    
  } else {
  }
  const currUser = getCurrentUser();
  // console.log('current', currUser);
  
  if (!currUser) {
    throw redirect(302, 'auth/login')
  } else {
    return currUser
  }
};