import { writable } from 'svelte/store';
import { AxiosError } from 'axios';
import { checkIfAdminExists, getCurrentUser } from '$lib/generated/services.gen';
import type { Account } from '$lib/generated';
export const userLoading = writable(false);

export const currentUser = writable<Account | null>(null);
export const adminExists = writable(true);

export const checkAdminExists = async () => {
	const { data } = await checkIfAdminExists();
	adminExists.set(data?.admin_exists ?? true);
};

export const fetchCurrentUser = async () => {
	try {
		const { data } = await getCurrentUser();

		currentUser.set(data as Account);
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
