import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { writable } from 'svelte/store';

export type User = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	isSuperuser: boolean;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export const currentUser = writable<User | null>(); //current user store

export const getCurrentUser = (): Promise<User | null> => {
	return new Promise((resolve) => {
		currentUser.subscribe((currUser) => {
			resolve(currUser);
		});
	});
};

export const initCurrentUser = async (
	acessToken: string | undefined,
	cookies?: any,
	refreshToken?: string | undefined
) => {
	const res = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/me/`, {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${acessToken}`
		}
	});
	// console.log(res);

	if (res.ok) {
		const user = await res.json();
		// console.log(currentUser);
		currentUser.set(user);
	} else if (!res.ok && res.status === 401) {
		const refreshTokens = await fetch(`${PUBLIC_API_ENDPOINT}api/auth/refresh/`, {
			method: 'POST',
			body: JSON.stringify({ refresh: refreshToken }),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});
		// console.log('refresh',refreshTokens);

		if (refreshTokens.ok) {
			const tokens = await refreshTokens.json();
			cookies.set('access', tokens.access, {
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				path: '/'
			});
			cookies.set('refresh', tokens.refresh, {
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				path: '/'
			});
			const newAccessToken: string | undefined = cookies.get('access');

			initCurrentUser(newAccessToken, cookies);
		} else if (!refreshTokens.ok) {
			currentUser.set(null);
		}
	} else if (!res.ok) {
		currentUser.set(null);
	}
};
