import { goto } from '$app/navigation';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import axios from 'axios';
import toast from 'svelte-french-toast';
import { passwordConfirmation, passwordModal, inviteUserModal } from '$lib/stores';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'custom';
export type Option = {
	value: number;
	label: string;
};
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

export const openPasswordResetModal = () => {
	passwordModal.set(true);
};

export const closePasswordResetModal = () => {
	passwordModal.set(false);
};

export const openPasswordConfirmation = () => {
	passwordConfirmation.set(true);
};

export const closePasswordConfirmation = () => {
	passwordConfirmation.set(false);
};

export const openInviteUserModal = () => {
	inviteUserModal.set(true);
};

export const closeInviteUserModal = () => {
	inviteUserModal.set(false);
};

export const getToastType = (error: string | undefined): ToastType => {
	switch (error) {
		case 'error':
			return 'error';
		case 'success':
			return 'success';
		case 'info':
			return 'info';
		case 'warning':
			return 'warning';
		default:
			return 'custom';
	}
};

export const debounce = (cb: Function, delay = 1000) => {
	let timeout: any;
	return async (...args: any) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			cb(...args);
		}, delay);
	};
};

export const isEqual = (obj1: Option, obj2: Option) => {
	return obj1.value === obj2.value && obj1.label === obj2.label;
};
