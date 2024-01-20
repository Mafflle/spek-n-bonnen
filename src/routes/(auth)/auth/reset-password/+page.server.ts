import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const resetSchema = z
	.object({
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

export const load: PageServerLoad = async ({ url, fetch }) => {
	const token = url.searchParams.get('token');
	// console.log(token);

	if (token) {
		const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/reset-password/validate_token/`, {
			method: 'POST',
			body: JSON.stringify({ token })
		});
		// console.log(res);

		if (!res.ok) {
			throw redirect(
				302,
				'forgot-password?message=Token has expired, get a new one here&type=error'
			);
		}
	}
};

export const actions: Actions = {
	resetpassword: async ({ request, fetch, url, route }) => {
		const formData = await request.formData();

		const password = formData.get('password');
		const confirmPassword = formData.get('confirm-password');
		const token = formData.get('token');

		const dataToValidate = {
			...(password && { password }),
			...(confirmPassword && { confirmPassword })
		};

		// console.log(token);

		try {
			if (!token) {
				throw redirect(
					302,
					'forgot-password?message=No token provided, get a new one here&type=error'
				);
			}
			resetSchema.parse(dataToValidate);
			const validatedData = dataToValidate;
			delete validatedData.confirmPassword;

			const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/reset-password/`, {
				method: 'POST',
				body: JSON.stringify({ ...validatedData, token: token })
			});

			// console.log(res);

			if (res.ok) {
				return {
					success: true
				};
			} else if (!res.ok && res.status === 401) {
				// const setupErrors = await res.json();
				throw redirect(302, 'forgot-password?message=Token expired, get a new one here&type=info');
			} else if (!res.ok && res.status === 400) {
				const resetErrors = await res.json();
				return fail(400, { errors: resetErrors });
			} else if (!res.ok && res.status === 404) {
				const resetErrors = await res.json();

				return fail(400, { errors: resetErrors });
			} else if (!res.ok) {
				console.log(res.status, res.url, res.statusText);

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

			if (error instanceof z.ZodError) {
				toSend.message = 'Validation error';
				toSend.errors = error.flatten().fieldErrors;

				return fail(400, toSend);
			}

			console.log('error', error);
			return fail(500, toSend);
		}
	}
};
