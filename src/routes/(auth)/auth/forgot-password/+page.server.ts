import { PUBLIC_API_ENDPOINT } from "$env/static/public";
import { client } from "$lib/utils";
import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";

 const schema = z.object({
  email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'Not a valid email' })
			.trim(),
})

// export const resetPasswordSchema = z
//   .object({
//     token: z.string(),
// 		password: z
// 			.string({ required_error: 'Password is required' })
// 			.min(8, { message: 'Password must be at least 8 characters' })
// 			.max(32, { message: 'Password must be less than 32 characters' })
// 			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/, {
// 				message:
// 					'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number'
// 			})
// 			.trim(),
// 		confirmPassword: z
// 			.string({ required_error: 'Confirm password is required' })
// 			.min(8, { message: 'Password must be at least 8 characters' })
// 			.max(32, { message: 'Password must be less than 32 characters' })
// 			.trim()
// 	})
// 	.superRefine(({ password, confirmPassword }, ctx) => {
// 		if (confirmPassword !== password) {
// 			ctx.addIssue({
// 				code: 'custom',
// 				message: 'Passwords do not match',
// 				path: ['confirmPassword']
// 			});
// 		}
// 	});


type Errors = {
	email?: [string];
}

export const actions: Actions = {
	sendForgotPasswordMail:async ({request, fetch}) => {
		const formData = await request.formData();

		const email = formData.get('email');

		const dataToValidate = {
			...(email && {email})
		}

		try {
			const validatedData = schema.parse(dataToValidate);

			const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/password-reset/`, {
				body: JSON.stringify(validatedData),
				method: 'POST'
			})

			if (res.ok) {
				const status = await res.json()
				console.log(status);
				
			} else if (!res.ok) {
				console.log(res);
				return fail(500, {message: 'Ooops something went wrong'})
				
			}
		} catch (error) {
				const toSend = {
				message: 'Ooops something went wrong',
				errors: {} as Errors
			};
				if (error instanceof z.ZodError) {
				toSend.message = 'Validation error';
				toSend.errors = error.flatten().fieldErrors;

				return fail(400, toSend);
			}

			console.log('error', error);
			return fail(500, toSend);
		}
		}
	}



// export const sendForgotPasswordMail = async (requestBody: {email?: string }) => {
//   const res = await client.post('auth/forgot-password',  requestBody )
//   return res;
// }
// export const resetPassword = async (data: { token: string; password: string; confirmPassword: string}) => {
//   const res = await client.post('auth/forgot-password/reset', data);
//   return res
// }