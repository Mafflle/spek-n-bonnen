import { goto } from "$app/navigation";
import { getCurrentUser } from "$lib/user";
import { checkForUserInDatabase } from "$lib/utils";
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({url}) => {
  const profile = await getCurrentUser()
//  if (profile) {
//   goto('/')
  //  }
  if (url.pathname === '/auth/setup') {
   
  	const isUserInDB = await checkForUserInDatabase();
		const userProfile = await getCurrentUser();
		if (userProfile && isUserInDB ) {
      throw redirect(302, '/')
		} else if (!isUserInDB && !userProfile) {
			throw redirect(302, 'login')
     
      
		}
  }
  
  return {
    success: 'true'
  }
  
  
};