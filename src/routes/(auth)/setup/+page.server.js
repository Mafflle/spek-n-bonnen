
import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';

import { ZodError, z } from 'zod';

const setupSchema = z
	.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'Not a valid email' })
			.trim(),
		firstName: z
			.string({ required_error: 'First name is required' })
			.min(3, { message: 'Minimum of 3 characters is required' })
			.trim(),
		lastName: z
			.string({ required_error: 'Last name is required' })
			.min(3, { message: 'Minimum of 3 characters is required' })
			.trim(),
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

/**
 * @typedef {object} setupError
 * @property {string[]=} email
 * @property {string[]=} firstName
 * @property {string[]=} lastName
 * @property {string[]=} password
 * @property {string[]=} confirmPassword
 * @property {string[]=} server
 */

/** @type {import('./$types').Actions} */
export const actions = {
	setup: async ({ request, fetch }) => {
		const formData = await request.formData();

		const email = formData.get('email');
		const firstName = formData.get('first-name');
		const lastName = formData.get('last-name');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirm-password');

		const dataToValidate = {
			...(email && { email }),
			...(firstName && { firstName }),
			...(lastName && { lastName }),
			...(password && { password }),
			...(confirmPassword && { confirmPassword })
		};

		try {
			const validatedData = setupSchema.parse(dataToValidate);

			const setup = await fetch(`${PUBLIC_API_ENDPOINT}users/setup-admin`, {
				method: 'POST',
				body: JSON.stringify(validatedData)
			});

			if (setup.ok && setup.status == 201) {
				// console.log(setup.status);
				throw redirect(302, '/auth/login');
			} else if (!setup.ok) {
				console.log(setup.status, setup.url);
			}
		} catch (error) {
			/**
			 * @typedef {object} errorType
			 * @property {string} message
			 * @property {setupError} errors
			 */

			/**
			 * @type {errorType}
			 */
			const toSend = {
				message: 'Ooops something went wrong',
				errors: {}
			};

			if (error instanceof ZodError) {
				toSend.message = 'Validation error';
				toSend.errors = error.flatten().fieldErrors;

				return fail(400, toSend);
			}

			console.log('error', error);
			return fail(500, toSend);
		}
	}
};
