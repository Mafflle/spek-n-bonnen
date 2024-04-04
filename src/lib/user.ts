import { writable } from 'svelte/store';
import type { Role } from './stores';
import { z } from 'zod';

export type User = {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	is_superuser: boolean;
	is_active: boolean;
	is_staff: boolean;
	is_pro_user: boolean;
	date_joined: Date;
	profile_picture: {
		id: number;
		title: string;
		image: string;
		updated_at: Date;
		created_at: Date;
	} | null;
	groups: Role[];
};

export const profileSchema = z.object({
	first_name: z
		.string({ required_error: 'First name is required' })
		.min(3, { message: 'First name should be longer' })
		.trim(),
	last_name: z
		.string({ required_error: 'Last name is required' })
		.min(3, { message: 'Last name should be longer' })
		.trim(),
	email: z
		.string({ required_error: 'Email is required' })
		.min(3, { message: 'Email should be longer' })
		.email({ message: 'This email is not valid' })
		.trim(),
	profile_picture_id: z.number().optional()
});
export type profileErrors = {
	first_name?: [string];
	last_name?: [string];
	email?: [string];
	profile_picture_id?: [string];
};
export const currentUser = writable<User | undefined>(); //current user store

export const Users = writable<User[]>([]);
