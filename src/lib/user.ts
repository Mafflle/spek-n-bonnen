import { writable } from 'svelte/store';

export type User = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	is_superuser: boolean;
	is_active: boolean;
	is_staff: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export const currentUser = writable<User | null>(); //current user store

export const getCurrentUser = (): User | null => {
	let user: User | null;
	currentUser.subscribe((currUser) => {
		user = currUser;
	});
	return user;
};
