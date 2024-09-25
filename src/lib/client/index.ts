import { browser } from '$app/environment';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import axios from 'axios';
import { logout, refreshToken } from './auth';
import { goto } from '$app/navigation';

export const client = axios.create({
	baseURL: PUBLIC_API_ENDPOINT,
	headers: {
		'Content-Type': 'application/json'
	}
});

client.interceptors.request.use((config) => {
	config.headers['Content-Type'] = 'application/json';
	if (browser) {
		const access_token = localStorage.getItem('access_token');
		if (access_token) {
			config.headers['Authorization'] = `Bearer ${access_token}`;
		}
	}
	return config;
});

const createAuthRefreshInterceptor = () => {
	const interceptor = client.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error.response.status !== 401) {
				return Promise.reject(error);
			}

			/*
			 * When response code is 401, try to refresh the token.
			 * Eject the interceptor so it doesn't loop in case
			 * token refresh causes the 401 response.
			 *
			 * Must be re-attached later on or the token refresh will only happen once
			 */

			axios.interceptors.response.eject(interceptor);

			return refreshToken()
				.then((response) => {
					error.response.config.headers['Authorization'] = `Bearer ${response.access}`;
					return client(error.response.config); // retry the request that errored out with 401
				})
				.catch((error2) => {
					logout();
					goto('/auth/sign-in');
					return Promise.reject(error2);
				})
				.finally(createAuthRefreshInterceptor);
		}
	);
};

createAuthRefreshInterceptor();
