import { writable } from 'svelte/store';
import type { Permission, Role } from './stores';

export type User = {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	is_superuser: boolean;
	is_active: boolean;
	is_staff: boolean;
	createdAt: Date;
	updatedAt: Date;
	groups: Role[];
};

export const currentUser = writable<User | undefined>(); //current user store
