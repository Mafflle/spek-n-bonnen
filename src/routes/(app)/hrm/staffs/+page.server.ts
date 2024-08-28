import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { check } from '$lib/utils';

type Errors = {
	email?: [string];
	password?: [string];
	password2?: [string];
	groups?: [string];
};

const inviteSchema = z
	.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'Invalid email' })
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
		password2: z
			.string({ required_error: 'Confirm password is required' })
			.min(8, { message: 'Password must be at least 8 characters' })
			.max(32, { message: 'Password must be less than 32 characters' })
			.trim(),
		groups: z
			.array(z.number({ required_error: 'Roles are required' }))
			.nonempty({ message: 'Roles are required' }),
		managers: z
			.array(z.number({ required_error: 'You need to assign this employee a manager ' }))
			.nonempty({ message: 'You need to assign this employee a manager' })
			.optional(),
		is_manager: z
			.string()
			.transform((val) => val === 'true')
			.optional()
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

export const load: PageServerLoad = async ({ fetch, cookies, locals }) => {
	const access = cookies.get('access');

	if (check('view_account', locals.user) || check('view_group', locals.user)) {
		throw redirect(302, "/?message=You don't have the permission to view this page&&type=info");
	}
	const groups = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/groups/?limit=20`);
	const staffs = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/users/?is_staff=true`);
	const managers = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/users/?is_manager=true`);

	if (groups.ok && staffs.ok && managers.ok) {
		const data = await groups.json();
		let users = await staffs.json();
		let staffManagers = await managers.json();

		return {
			access,
			groups: data,
			users: users,
			staffManagers
		};
	}
};

export const actions: Actions = {
	invite_staff: async ({ fetch, request }) => {
		const formData = await request.formData();

		const roles = formData.getAll('role');
		const email = formData.get('email');
		const password = formData.get('password');
		const password2 = formData.get('confirm-password');
		const is_manager = formData.get('is_manager');
		const assigned_managers = formData.getAll('assigned_manager');

		const groups = roles.map((role) => parseInt(role));

		const managers = assigned_managers.map((manager) => parseInt(manager as string));
		const dataToValidate = {
			...(email && { email }),
			...(password && { password }),
			...(password2 && { password2 }),
			...(groups && { groups }),
			...(is_manager && { is_manager }),
			...(managers && { managers })
		};

		console.log(JSON.stringify(dataToValidate));

		try {
			const validatedData = inviteSchema.parse(dataToValidate);

			const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/users/invite/`, {
				method: 'POST',
				body: JSON.stringify(validatedData)
			});

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
				console.log(toSend.errors);

				return fail(400, toSend);
			}

			console.log('error', error);
			return fail(500, toSend);
		}
	}
};
