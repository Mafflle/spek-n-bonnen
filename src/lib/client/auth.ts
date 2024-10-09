import { browser } from '$app/environment';
import { goto } from '$app/navigation';

import type { SetupAdminPayload } from '$lib/types/user.types';
import user from '../stores/user';
import {
	refreshAuthTokens,
	getAuthTokens,
	setupUser,
	requestPasswordResetToken,
	validatePasswordResetToken,
	confirmPasswordReset
} from '$lib/generated/services.gen';
import type { RefreshAuthTokensResponse } from '$lib/generated/types.gen';

import type { forgotPasswordPayload, LoginPayload } from '../types/auth.types';
import { toast } from 'svelte-sonner';

export const createAuth = () => {
	const login = async (payload: LoginPayload) => {
		const response = await getAuthTokens({
			body: {
				email: payload.email,
				password: payload.password
			}
		});

		if (response.status === 200 && response.data) {
			if (browser) {
				localStorage.setItem('access_token', response.data?.access as string);
				localStorage.setItem('refresh_token', response.data?.refresh as string);
				await user.refresh();
			}
		} else if (response.status === 401 && response.error) {
			toast.error('Invalid email or password');
		} else if (response.error) {
			toast.error(response.error.message ?? 'error has no message');
		}
	};

	const refreshToken = async (): Promise<RefreshAuthTokensResponse | any> => {
		if (!browser) {
			throw new Error('Cannot refresh token on server');
		}

		const response = await refreshAuthTokens({
			body: {
				access: '',
				refresh: localStorage.getItem('refresh_token') as string
			}
		});

		if (response.status == 200) {
			localStorage.setItem('access_token', response.data?.access as string);
			localStorage.setItem('refresh_token', response.data?.refresh as string);

			return response.data as RefreshAuthTokensResponse;
		}
	};

	const logout = async (): void => {
		if (browser) {
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			user.set(null);
			await goto('/auth/sign-in');
		}
	};

	const setUpAdmin = async (data: SetupAdminPayload) => {
		try {
			const { confirmPassword: password2, ...rest } = data;
			const response = await setupUser({ body: { ...rest, password2 } });

			if (response.status === 201) {
				toast.success('Admin account created successfully');
				if (browser) {
					goto('/auth/sign-in');
				}
			} else if (response.status === 403) {
				toast.error('An admin with this email already exists');
				return;
			} else {
				console.log(response);
			}
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const getResetPasswordMail = async (data: forgotPasswordPayload) => {
		const response = await requestPasswordResetToken({ body: data });

		if (response.status === 200) {
			toast.success('Password reset link sent successfully');
			return true;
		} else if (response.status === 400) {
			toast.error('No account associated with the email was found');
			return false;
		} else {
			console.log(response);
		}
	};

	const resetPassword = async (password: string, token: string) => {
		const validateToken = await validatePasswordResetToken({ body: { token } });

		if (validateToken.status === 200 && validateToken.data?.status === 'OK') {
			const resetRespone = await confirmPasswordReset({ body: { password, token } });
			if (resetRespone.status === 200) {
				toast.success('Password reset successful');
				return true;
			} else if (resetRespone.status === 404) {
				toast.error('Token expired');
				toast.error('Please request another reset password link');
				return false;
			} else {
				toast.error('Ooops something went wrong');
				return false;
				console.log(resetRespone);
			}
		} else if (validateToken.status === 404) {
			toast.error('Token expired');
			toast.error('Please request another reset password link');
			return false;
		} else {
			toast.error('Ooops something went wrong');
			console.log(validateToken);
			return false;
		}
	};

	return {
		login,
		refreshToken,
		logout,
		setUpAdmin,
		resetPassword,
		getResetPasswordMail
	};
};

const auth = createAuth();

export default auth;
