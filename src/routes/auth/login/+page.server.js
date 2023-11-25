/** @type {import('./$types').Actions} */
import { fail } from '@sveltejs/kit';
import { ZodError, z } from 'zod';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';

/**
 * @typedef {object} loginError
 * @property {string[]=} email
 * @property {string[]=} password
 * @property {string[]=} server
 */

const loginSchema = z.object({
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

export const actions = {
	login: async ({ fetch, locals, request }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		const dataToValidate = {
			...(email && { email }),
			...(password && { password })
		};

		try {
			const validatedData = loginSchema.parse(dataToValidate);

			const login = await fetch(`${PUBLIC_API_ENDPOINT}auth/login`, {
				method: 'POST',
				body: JSON.stringify(validatedData)
			});

			if (login.ok) {
				const user = await fetch(`${PUBLIC_API_ENDPOINT}auth/profile`);

				if (user.ok) {
					const currentUser = await user.json();

					locals.user = currentUser;

					return {
						currentUser
					};
				}
			} else if (!login.ok && login.status === 401) {
				return fail(401);
			}
		} catch (error) {
			/**
			 * @typedef {object} errorType
			 * @property {string} message
			 * @property {loginError} errors
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
