import { client } from "$lib/utils";
import { z } from "zod";

export const schema = z.object({
  email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'Not a valid email' })
			.trim(),
})

export const resetPasswordSchema = z
  .object({
    token: z.string(),
		password: z
			.string({ required_error: 'Password is required' })
			.min(8, { message: 'Password must be at least 8 characters' })
			.max(32, { message: 'Password must be less than 32 characters' })
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/, {
				message:
					'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number'
			})
			.trim(),
		confirmPassword: z
			.string({ required_error: 'Confirm password is required' })
			.min(8, { message: 'Password must be at least 8 characters' })
			.max(32, { message: 'Password must be less than 32 characters' })
			.trim()
	})
	.superRefine(({ password, confirmPassword }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Passwords do not match',
				path: ['confirmPassword']
			});
		}
	});

export const sendForgotPasswordMail = async (requestBody: {email?: string }) => {
  const res = await client.post('auth/forgot-password',  requestBody )
  return res;
}
export const resetPassword = async (data: { token: string; password: string; confirmPassword: string}) => {
  const res = await client.post('auth/forgot-password/reset', data);
  return res
}