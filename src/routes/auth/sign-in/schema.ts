import { z } from 'zod';

export const loginSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Invalid email address' })
		.trim()
		.transform((v) => v.toLowerCase()),
	password: z.string({ required_error: 'Password is required' }).trim()
});
