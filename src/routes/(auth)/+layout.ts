import { goto } from "$app/navigation";
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({url}) => {
 
//  if (profile) {
//   goto('/')
  //  }
  if (url.pathname === '/auth/setup') {
   
  }
  
  return {
    success: 'true'
  }
  
  
};