import { browser } from '$app/environment';

import auth from './auth';

import { client } from '$lib/generated/services.gen';
import { goto } from '$app/navigation';
import { AxiosError } from 'axios';

const addAuthHeader = () => {
	client.instance.interceptors.request.use((config) => {
		config.headers['Content-Type'] = 'application/json';
		if (browser) {
			const access_token = localStorage.getItem('access_token');
			if (access_token) {
				config.headers['Authorization'] = `Bearer ${access_token}`;
			}
		}
		return config;
	});
};

const createAuthRefreshInterceptor = () => {
	const interceptor = client.instance.interceptors.response.use(
		(response) => response,
		async (error) => {
			if (error.response.status !== 401) {
				return Promise.reject(error);
			}

			if (error.response.config.url === '/auth/login/') {
				return Promise.reject(error);
			}

			/*
			 * When response code is 401, try to refresh the token.
			 * Eject the interceptor so it doesn't loop in case
			 * token refresh causes the 401 response.
			 *
			 * Must be re-attached later on or the token refresh will only happen once
			 */

			client.instance.interceptors.response.eject(interceptor);

			try {
				const response = await auth.refreshToken();
				error.response.config.headers['Authorization'] = `Bearer ${response.access}`;
				return client.instance(error.response.config); // retry the request that errored out with 401
			} catch (error2) {
				console.log('two', error2);

				const currentPath = window.location.pathname;
				if (!currentPath.startsWith('/auth')) {
					auth.logout();
					goto('/auth/sign-in');
				}

				return Promise.reject(error);
			} finally {
				createAuthRefreshInterceptor();
			}
		}
	);
};

export const initInterceptors = () => {
	addAuthHeader();
	createAuthRefreshInterceptor();
};
