import { writable } from 'svelte/store';

export type User = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	isSuperuser: boolean;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export const currentUser = writable<User>(); //current user store

export const setCurrentUser = (user: User) => {
	currentUser.set(user);
	return currentUser;
};
