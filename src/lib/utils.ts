import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import axios from 'axios';
import { toast } from 'svelte-sonner';
import { passwordConfirmation, passwordModal, inviteUserModal, LoggedinUsers } from '$lib/stores';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import type { User } from './user';
import { browser } from '$app/environment';
import type { Schedule } from './hrm';

// types
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'custom' | 'promise';
export type Option = {
	value: number;
	label: string;
	slug: string;
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
export const showToast = (message: string, type: ToastType, promise?) => {
	if (message) {
		if (type === 'success') {
			toast.success(message, {
				position: 'top-right',
				dismissable: true
				// class: 'h-[80px] md:w-[468px] w-[200px]  text-white',
				// classes: {
				// 	title: 'text-white',
				// 	success: 'bg-green-main text-white'
				// }
			});
		} else if (type === 'error') {
			toast.error(message, {
				position: 'top-right',
				dismissable: true
			});
		} else if (type === 'warning') {
			toast.warning(message, {
				position: 'top-right',
				dismissable: true
			});
		} else if (type === 'info') {
			// Blue background with white text
			toast.info(message, {
				position: 'top-right',
				dismissable: true,
				class: 'bg-yellow-500'
			});
		} else if (type === 'promise') {
			toast.promise(promise, {
				loading: 'Loading...',
				success: () => {
					return message;
				}
			});
		} else {
			toast(message, {
				position: 'top-right',
				dismissable: true
			});
		}
	}
};

export function getRandomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.round(Math.random() * 15)];
	}
	return color;
}

export type loggedInUser = {
	name?: string;
	email: string;
	avatar?: string;
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

export const isEqual = (obj1, obj2) => {
	if (obj1.value) {
		return obj1.value === obj2.value && obj1.label === obj2.label;
	} else if (obj1.code_name) {
		return obj1.id === obj2.id && obj1.code_name === obj2.code_name;
	} else {
		return obj1.id === obj2.id && obj1.name === obj2.name;
	}
};

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

export const getSexCategory = (code) => {
	let response;
	switch (code) {
		case 'A':
			response = 'Young Bull';
			break;
		case 'B':
			response = 'Bull';
			break;
		case 'C':
			response = 'Steer';
			break;
		case 'E':
			response = 'Heifer';
	}

	return response;
};

export const generatePassword = (length: number) => {
	const charset =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*!@#$%^&()_+{}|:<>?[];.,/';
	let password = '';
	for (let i = 0; i < length; i++) {
		password += charset.charAt(Math.floor(Math.random() * charset.length));
	}
	return password;
};

export function check(permission: string, user: User) {
	if (permission && !user?.is_superuser) {
		for (let i = 0; i < user.groups.length; i++) {
			let currRole = user.groups[i];
			for (let x = 0; x < currRole?.permissions.length; x++) {
				let currPermission = currRole?.permissions[x];
				if (currPermission?.codename === permission) {
					return false;
				}
			}
		}
		return true;
	} else {
		return false;
	}
}
export function getLoggedinUser(): { name?: string; email: string; avatar?: string }[] {
	let loggedUsers = JSON.parse(localStorage.getItem('loggedinUsers')) || [];
	return loggedUsers.filter((user) => user?.name || user?.email);
}

export const updateLoggedInUsers = (loggedInUser: User) => {
	if (browser) {
		let users = getLoggedinUser() as loggedInUser[];
		if (users.find((user) => loggedInUser?.email === user.email)) {
			LoggedinUsers.set(users);
		} else {
			if (loggedInUser?.staff_profile) {
				let currUser = {
					name: `${loggedInUser?.staff_profile.first_name} ${loggedInUser?.staff_profile.last_name}`,
					email: `${loggedInUser?.email}`,
					...(loggedInUser?.staff_profile.profile_picture && {
						avatar: loggedInUser.staff_profile.profile_picture?.image
					})
				};
				users.push(currUser);
				LoggedinUsers.set(users);
				localStorage.setItem('loggedinUsers', JSON.stringify(users));
			} else {
				let currUser = {
					email: loggedInUser?.email as string
				};
				users.push(currUser);
				LoggedinUsers.set(users);
				localStorage.setItem('loggedinUsers', JSON.stringify(users));
			}
		}
	}
};

export function shortenText(text: string, maxLength: number = 10): string {
	if (text.length > maxLength) {
		return text.substring(0, maxLength); // Extract the first 10 characters
	} else {
		return text;
	}
}
export function formatTime(timeStr) {
	const [hours, minutes] = timeStr.split(':').map(Number);

	let meridian = 'AM';
	let formattedHours = hours;

	if (hours >= 12) {
		meridian = 'PM';
		formattedHours = hours === 12 ? 12 : hours - 12;
	}

	const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes
		.toString()
		.padStart(2, '0')}${meridian}`;
	return formattedTime;
}

export function calculateTimeDifference(start_time: string, end_time: string) {
	// 1. Parse Time (Assuming format: HH:mm)
	const [startHours, startMinutes] = start_time.split(':').map(Number);
	const [endHours, endMinutes] = end_time.split(':').map(Number);

	// Calculate minutes
	const startTotalMinutes = startHours * 60 + startMinutes;
	const endTotalMinutes = endHours * 60 + endMinutes;

	// 2. Calculate Time Difference in Minutes
	let timeDifferenceMinutes = endTotalMinutes - startTotalMinutes;

	return timeDifferenceMinutes;
}

export function calculateTotalTimeDifference(scheduleData: Schedule[]) {
	let totalDifferenceMinutes = 0;

	for (const entry of scheduleData) {
		const difference = calculateTimeDifference(entry.start_time, entry.end_time);
		totalDifferenceMinutes += difference;
	}

	return totalDifferenceMinutes;
}
