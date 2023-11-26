import type { User } from '$lib/user';
import { client, showToast } from '$lib/utils';
import { AxiosError } from 'axios';
import { z } from 'zod';

export const loginSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Not a valid email' })
		.trim(),
	password: z
		.string({ required_error: 'Password is required' })
		.min(8, { message: 'Password must be at least 8 characters' })
		.max(32, { message: 'Password must be less than 32 characters' })
		.trim()
});

export const login = async (requestBody: { email: string; password: string }): Promise<User> => {
	const res = await client.post('auth/login', { ...requestBody });
	return res.data;
};
