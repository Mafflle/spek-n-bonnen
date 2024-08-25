// See https://kit.svelte.dev/docs/types#app

import type { User } from '$lib/user';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User;
			accessToken: string | null;
			refreshToken: string | null;
			adminExists: boolean | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
