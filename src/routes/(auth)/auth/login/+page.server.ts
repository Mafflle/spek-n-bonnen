import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';

const loginSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.trim()
		.email({ message: 'Not a valid email' }),
	password: z
		.string({ required_error: 'Password is required' })
		.min(8, { message: 'Password must be at least 8 characters' })
		.max(32, { message: 'Password must be less than 32 characters' })
		.trim()
});
type Errors = {
	email?: [string];
	password?: [string];
};
export const actions: Actions = {
	login: async ({ fetch, request, cookies, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		const dataToValidate = {
			...(email && { email }),
			...(password && { password })
		};

		try {
			const validatedData = loginSchema.parse(dataToValidate);
			// console.log('works');

			const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/login/`, {
				method: 'POST',
				body: JSON.stringify(validatedData)
			});
			console.log(res.status);
			if (res.ok) {
				const tokens = await res.json();
				cookies.set('access', tokens.access, {
					httpOnly: true,
					secure: false,
					sameSite: 'lax',
					path: '/'
				});
				cookies.set('refresh', tokens.refresh, {
					httpOnly: true,
					secure: false,
					sameSite: 'lax',
					path: '/'
				});

				const access = cookies.get('access');
				const getLoggedInUser = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/`, {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${access}`
					}
				});
				if (getLoggedInUser.ok) {
					const user = await getLoggedInUser.json();
					return {
						success: 'true',
						currUser: user
					};
				}
			} else if (!res.ok && res.status === 401) {
				return fail(401, { message: 'Invalid email or password' });
			} else {
				console.log(res.status);
				console.log(await res.json());
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

// export const login = async (requestBody: { email: string; password: string }): Promise<User> => {
// 	const res = await client.post('auth/login', { ...requestBody });
// 	return res.data;
// };
