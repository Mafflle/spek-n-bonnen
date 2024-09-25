import { z } from 'zod';

export const setupAdminSchema = z
	.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'Invalid email' })
			.trim()
			.transform((v) => v.toLowerCase()),
		password: z
			.string({ required_error: 'Password is required' })
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/, {
				message: `Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number`
			}),
		confirmPassword: z.string({ required_error: 'Confirm password is required' })
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Passwords do not match',
				path: ['confirmPassword']
			});
		}
	});
