import { writable } from 'svelte/store';
import type { Role } from './stores';
import { z } from 'zod';
import dayjs from 'dayjs';

export type User = {
	id: string;
	email: string;

	is_superuser: boolean;
	is_active: boolean;
	is_staff: boolean;
	is_pro_user: boolean;
	date_joined: Date;
	staff_profile: StaffProfile;
	groups: Role[];
} | null;

export type StaffProfile = {
	first_name: string;
	last_name: string;
	date_of_birth: Date;
	preferred_name: string;
	address: string;
	phone_number: string;
	emergency_contact_relationship: string;
	emergency_contact_number: string;
	emergency_contact_name: string;
	profile_picture: {
		id: number;
		title: string;
		image: string;
		created_at?: Date;
		updated_at?: Date;
	};
	created_at?: Date;
	updated_at?: Date;
} | null;

export const staffprofileSchema = z.object({
	first_name: z
		.string({ required_error: 'First name is required' })
		.min(3, { message: 'First name should be longer' })
		.trim(),
	last_name: z
		.string({ required_error: 'Last name is required' })
		.min(3, { message: 'Last name should be longer' })
		.trim(),
	date_of_birth: z.preprocess(
		(arg) => {
			if (typeof arg === 'string' || typeof arg === 'number') {
				return new Date(arg);
			}
			return arg;
		},
		z
			.date({
				required_error: 'Date of birth is required',
				invalid_type_error: 'Invalid date of birth'
			})
			.max(new Date(), { message: 'Date of birth cannot be in the future' })
			.transform((val) => dayjs(val).format('YYYY-MM-DD'))
	),
	preferred_name: z
		.string()
		.min(1, { message: 'Preffered name should be longer' })
		.trim()
		.optional(),

	address: z
		.string({
			required_error: 'Address is required'
		})
		.min(5, { message: 'Please provide a more detailed address' })
		.trim(),

	phone_number: z
		.string({
			required_error: 'Phone number is required'
		})
		.trim()
		.refine(
			(value) => {
				// Basic phone number validation - adjust as needed for your specific requirements
				return /^\+?[1-9]\d{1,14}$/.test(value);
			},
			{ message: 'Invalid phone number format' }
		),

	emergency_contact_relationship: z
		.string({
			required_error: 'Emergency contact relationship is required'
		})
		.min(2, { message: 'Please specify the relationship (e.g., spouse, parent, friend)' })
		.trim(),

	emergency_contact_name: z
		.string({
			required_error: 'Emergency contact name is required'
		})
		.min(2, { message: 'Please provide the full name of your emergency contact' })
		.trim(),

	emergency_contact_number: z
		.string({
			required_error: 'Emergency contact number is required'
		})
		.trim()
		.refine(
			(value) => {
				// Same validation as for the main phone number
				return /^\+?[1-9]\d{1,14}$/.test(value);
			},
			{ message: 'Invalid emergency contact number format' }
		),

	profile_picture_id: z.number().int().positive().optional()
});

export type staffProfileErrors = {
	first_name?: string[];
	last_name?: string[];
	preferred_name?: string[];
	staff_profile_picture_id?: string[];
	date_of_birth?: string[];
	address?: string[];
	phone_number?: string[];
	emergency_contact_relationship?: string[];
	emergency_contact_name?: string[];
	emergency_contact_number?: string[];
};
export const currentUser = writable<User>(); //current user store

export const Users = writable<User[]>([]);
