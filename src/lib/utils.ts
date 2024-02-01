import { goto } from '$app/navigation';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import axios from 'axios';
import toast from 'svelte-french-toast';
import { passwordConfirmation, passwordModal, inviteUserModal } from '$lib/stores';

// types
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'custom';
export type Option = {
	value: number;
	label: string;
};
export type CarcassErrors = {
	purchase_price?: [string];
	cold_weight?: [string];
	weight?: [string];
	lot_number?: [string];
	ahdb_code?: [string];
	vendor_code?: [string];
	vendor_item_name?: [string];
	vendor_moq?: [string];
	vendor_moq_unit?: [string];
	origin_and_terroir?: [string];
	certifications?: [string];
	country_of_origin?: [string];
	ear_tag?: [string];
	lairage_number?: [string];
	carcass_number?: [string];
	sex_category?: [string];
	conformation?: [string];
	fat_score?: [string];
	date_of_slaughter?: [string];
	date_received?: [string];
	farm_id?: [string];
	slaughter_house_id?: [string];
	butcher_shop_id?: [string];
	manufacturer_id?: [string];
	brand_id?: [string];
	vendor_id?: [string];
	server?: [string];
};

// utility functions
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

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};
export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;
	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;
		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;
		return valueB;
	};
	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + key + ':' + style[key] + ';';
		}, '');
	};
	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);
			return styleToString({
				transform: transform + 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scale + ')',
				opacity: t
			});
		},
		easing: cubicOut
	};
};
