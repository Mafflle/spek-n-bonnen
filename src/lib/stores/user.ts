import { writable } from 'svelte/store';
import { client } from '../client';
import { AxiosError } from 'axios';

export const userLoading = writable(true);

export const currentUser = writable(null);
export const adminExists = writable(false);

export const checkAdminExists = async () => {
	try {
		const response = await client.get('/auth/admin-exists');
		adminExists.set(response.data.admin_exists);
	} catch (error) {
		adminExists.set(false);
		if (error instanceof AxiosError && error.response?.status === 401) {
			return;
		}

		console.error(error);
	}
};

export const fetchCurrentUser = async () => {
	try {
		const response = await client.get('/auth/me');
		currentUser.set(response.data);
	} catch (error) {
		currentUser.set(null);

		if (error instanceof AxiosError && error.response?.status === 401) {
			return;
		}

		console.error(error);
	}
};

export const initializeUserStore = async () => {
	userLoading.set(true);
	try {
		await checkAdminExists();
		await fetchCurrentUser();
	} finally {
		userLoading.set(false);
	}
};
