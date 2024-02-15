import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { showToast } from '$lib/utils';
import { fail, type Action, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';

type Errors = {
	first_name?: [string];
	last_name?: [string];
	email?: [string];
	password?: [string];
	password2?: [string];
	groups?: [string];
};

const inviteSchema = z
	.object({
		first_name: z
			.string({ required_error: 'First name is required' })
			.trim()
			.min(1, { message: 'First name should be longer' }),
		last_name: z
			.string({ required_error: 'Last name is required' })
			.trim()
			.min(1, { message: 'Last name should be longer' }),
		email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email' }),
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
			.trim(),
		groups: z
			.array(z.number({ required_error: 'Roles are required' }))
			.nonempty({ message: 'Roles are required' })
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

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
	const access = cookies.get('access');
	// console.log(access);

	const groups = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/groups/?limit=10`);
	const staffs = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/users/?limit=10`);

	if (groups.ok && staffs.ok) {
		const data = await groups.json();
		const users = await staffs.json();
		return {
			access,
			groups: data.results,
			users
		};
	} else if (groups.status === 401 || staffs.status === 401) {
		throw redirect(302, `/auth/login?from=${url.pathname}`);
	}
};

export const actions: Actions = {
	invite_staff: async ({ fetch, request }) => {
		const formData = await request.formData();

		const roles = formData.getAll('role');
		const first_name = formData.get('first-name');
		const last_name = formData.get('last-name');
		const email = formData.get('email');
		const password = formData.get('password');
		const password2 = formData.get('confirm-password');

		const groups = roles.map((role) => parseInt(role));

		const dataToValidate = {
			...(first_name && { first_name }),
			...(last_name && { last_name }),
			...(email && { email }),
			...(password && { password }),
			...(password2 && { password2 }),
			...(groups && { groups })
		};

		try {
			const validatedData = inviteSchema.parse(dataToValidate);
			// console.log(validatedData);

			const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/users/invite/`, {
				method: 'POST',
				body: JSON.stringify(validatedData)
			});

			console.log('inviting', res.status, res.statusText);

			if (res.ok) {
				const invitedStaff = await res.json();

				return {
					invitedStaff
				};
			} else if (!res.ok) {
				const details = await res.json();
				// console.log('error', details);
				return fail(400, { errors: details });
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
};
