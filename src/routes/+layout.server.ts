
import { PUBLIC_API_ENDPOINT } from "$env/static/public";
import {  getCurrentUser, initCurrentUser} from "$lib/user";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";


