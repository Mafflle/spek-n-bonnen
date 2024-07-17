import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { fail, redirect, type Actions } from '@sveltejs/kit';

import { ZodError, z } from 'zod';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const adminExists = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/admin-exists/`);

	if (adminExists.ok) {
		// console.log('test');
		const admin = await adminExists.json();
		if (admin.admin_exists) {
			throw redirect(302, 'login');
		}
	} else if (adminExists.status === 401) {
		throw redirect(302, '/');
	} else {
		console.log(adminExists.status);
	}
};

const setupSchema = z
	.object({
		email: z
			.string({ required_error: 'Email is required' })
			.trim()
			.email({ message: 'Not a valid email' }),

		password: z
			.string({ required_error: 'Password is required' })
			.min(8, { message: 'Password must be at least 8 characters' })
			.max(32, { message: 'Password must be less than 32 characters' })
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/, {
				message:
					'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number'
			})
			.trim(),
		password2: z
			.string({ required_error: 'Confirm password is required' })
			.min(8, { message: 'Password must be at least 8 characters' })
			.max(32, { message: 'Password must be less than 32 characters' })
			.trim()
	})
	.superRefine(({ password, password2 }, ctx) => {
		if (password2 !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Passwords do not match',
				path: ['password2']
			});
		}
	});

/**
 * @typedef {object} setupError
 * @property {string[]=} email
 * @property {string[]=} password
 * @property {string[]=} password2
 * @property {string[]=} server
 */

export const actions: Actions = {
	setup: async ({ request, fetch }) => {
		const formData = await request.formData();

		const email = formData.get('email');

		const password = formData.get('password');
		const password2 = formData.get('confirm-password');

		const dataToValidate = {
			...(email && { email }),

			...(password && { password }),
			...(password2 && { password2 })
		};

		try {
			const validatedData = setupSchema.parse(dataToValidate);

			const setup = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/setup-admin/`, {
				method: 'POST',
				body: JSON.stringify(validatedData)
			});

			console.log(setup.status, setup.statusText);

			if (setup.ok) {
				return {
					success: true
				};
			} else if (!setup.ok && setup.status === 400) {
				const setupErrors = await setup.json();
				return fail(400, { errors: setupErrors });
			} else if (!setup.ok) {
				return fail(500, { message: 'Ooops something went wrong' });
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
