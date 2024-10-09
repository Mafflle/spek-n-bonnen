import { writable } from 'svelte/store';

import { AxiosError } from 'axios';
import { checkIfAdminExists, getCurrentUser } from '$lib/generated/services.gen';
import type { Account } from '$lib/generated';
import { browser } from '$app/environment';
import { updateLoggedinUsers } from '$lib/utils';
export const userLoading = writable(false);

export const adminExists = writable(true);

export const checkAdminExists = async () => {
	const { data } = await checkIfAdminExists();
	adminExists.set(data?.admin_exists ?? true);
};
const fetchCurrentUser = async () => {
	try {
		const { data } = await getCurrentUser();

		store.set(data as Account);
	} catch (error) {
		store.set(null);

		if (error instanceof AxiosError && error.response?.status === 401) {
			return;
		}

		console.error(error);
	}
};

const createStore = () => {
	const { subscribe, set: ogSetter } = writable<Account | null>(null);

	const instanceOfAccount = (object) => {
		return 'last_login' in object;
	};

	const get = () => {
		let value;
		subscribe((state) => (value = state));

		return value;
	};

	const refresh = async () => {
		userLoading.set(true);
		try {
			await checkAdminExists();
			await fetchCurrentUser();
		} finally {
			userLoading.set(false);
		}
	};

	const set = (update: Account | null) => {
		console.log(update);

		if (instanceOfAccount(update) && browser) {
			updateLoggedinUsers(update as Account);
		}
		ogSetter(update);
	};
	return {
		get,
		set,
		refresh,
		subscribe
	};
};

const store = createStore();

export default store;
