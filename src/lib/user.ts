import { writable } from 'svelte/store';
import { client } from './utils';
import { AxiosError } from 'axios';
import { redirect } from '@sveltejs/kit';
import { goto } from '$app/navigation';

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

export const currentUser = writable<User | null>(); //current user store

export const setCurrentUser = async (user: User) => {
	currentUser.set(user)
};
