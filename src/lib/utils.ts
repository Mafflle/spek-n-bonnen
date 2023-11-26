import { goto } from '$app/navigation';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import axios from 'axios';
import toast from 'svelte-french-toast';
import { passwordModal } from '$lib/stores';

import { getCurrentUser } from './user';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'custom';
export const showToast = (message: string, type: ToastType) => {
	if (message) {
		if (type === 'success') {
			toast(message, {
				style: 'background: #8fef98; color: #06111F;',
				position: 'bottom-right'
			});
		} else if (type === 'error') {
			toast(message, {
				style: 'background: #ef8f8f; color: #ed3434;',
				position: 'bottom-right'
			});
		} else if (type === 'warning') {
			toast(message, {
				style: 'background: #fff3cd; color: #fbbf24;',
				position: 'bottom-right'
			});
		} else if (type === 'info') {
			// Blue background with white text
			toast(message, {
				style: 'background: #bab6b6; color: #111111;',
				position: 'bottom-right'
			});
		} else {
			toast(message, {
				style: 'background: #bab6b6; color: #111111;',
				position: 'bottom-right'
			});
		}
	}
};

export const client = axios.create({
	//axios client
	baseURL: PUBLIC_API_ENDPOINT,
	withCredentials: true
});

export const checkForUserInDatabase = async () => {
	const res = await client.get('users/any-in-database');

	return res.data;
};
