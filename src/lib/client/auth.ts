import { browser } from '$app/environment';
import { client } from '.';
import { currentUser } from '../stores/user';
import type { AuthenticationCodes, LoginPayload } from '../types/auth.types';

export const login = async (payload: LoginPayload): Promise<AuthenticationCodes> => {
	const response = await client.post<AuthenticationCodes>('/auth/login/', payload);

	if (browser) {
		localStorage.setItem('access_token', response.data.access);
		localStorage.setItem('refresh_token', response.data.refresh);
	}

	return response.data;
};

export const refreshToken = async (): Promise<AuthenticationCodes> => {
	if (!browser) {
		throw new Error('Cannot refresh token on server');
	}

	const response = await client.post<AuthenticationCodes>('/auth/refresh/', {
		refresh: localStorage.getItem('refresh_token')
	});

	localStorage.setItem('access_token', response.data.access);
	localStorage.setItem('refresh_token', response.data.refresh);

	return response.data;
};

export const logout = (): void => {
	if (browser) {
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
	}

	currentUser.set(null);
};
