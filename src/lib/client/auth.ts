import { browser } from '$app/environment';
import { goto } from '$app/navigation';

import type { SetupAdminPayload, User } from '$lib/types/user.types';
import { currentUser } from '../stores/user';
import {
	refreshAuthTokens,
	getAuthTokens,
	setupUser,
	requestPasswordResetToken
} from '$lib/generated/services.gen';
import {
	type RefreshAuthTokensResponse,
	type TokenObtainPairResponse
} from '$lib/generated/types.gen';

import type { forgotPasswordPayload, LoginPayload } from '../types/auth.types';

const createAuth = () => {
	const login = async (payload: LoginPayload): Promise<TokenObtainPairResponse> => {
		const response = await getAuthTokens({
			body: {
				email: payload.email,
				password: payload.password
			}
		});

		if (browser) {
			localStorage.setItem('access_token', response.data?.access as string);
			localStorage.setItem('refresh_token', response.data?.refresh as string);
		}

		return response.data as TokenObtainPairResponse;
	};

	const refreshToken = async (): Promise<RefreshAuthTokensResponse> => {
		if (!browser) {
			throw new Error('Cannot refresh token on server');
		}

		const response = await refreshAuthTokens({
			body: {
				access: '',
				refresh: localStorage.getItem('refresh_token') as string
			}
		});

		localStorage.setItem('access_token', response.data?.access as string);
		localStorage.setItem('refresh_token', response.data?.refresh as string);

		return response.data as RefreshAuthTokensResponse;
	};

	const logout = (): void => {
		if (browser) {
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			currentUser.set(null);
			goto('/auth/sign-in');
			return;
		}
	};

	const setUpAdmin = async (data: SetupAdminPayload) => {
		try {
			const { confirmPassword: password2, ...rest } = data;
			const response = await setupUser({ body: { ...rest, password2 } });
			return response.data;
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const getResetPasswordMail = async (data: forgotPasswordPayload) => {
		try {
			const response = await requestPasswordResetToken({ body: data });
			console.log(response);

			return response.data;
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	return {
		login,
		refreshToken,
		logout,
		setUpAdmin,
		getResetPasswordMail
	};
};

const auth = createAuth();

export default auth;
