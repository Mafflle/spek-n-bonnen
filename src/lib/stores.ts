import { writable } from 'svelte/store';
import { isEqual, type Option } from './utils';
type Permission = {
	id: number;
	name: string;
	codename: string;
	content_type: number;
};
export type Role = {
	id: number;
	name: string;
	permissions: Permission[];
};
export let passwordModal = writable(false);
export let passwordConfirmation = writable(false);
export let inviteUserModal = writable(false);
export const container = writable<Option[]>([]);
export let Roles = writable<Role[]>([]);

export const updateSelectedOptions = (option: Option) => {
	container.update((items: Option[]) => {
		if (items.length > 0) {
			for (const perms of items) {
				if (isEqual(perms, option)) {
					items = items.filter((item) => {
						return item.value !== option.value;
					});
				} else {
					items = [...items, option];
				}
			}
		} else {
			items = [option];
		}

		return items;
	});
};
