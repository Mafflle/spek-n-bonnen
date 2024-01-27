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

export type Brand = {
	[key: string]: any;
	id: number;
	name: string;
	logo: { id: number; title: string; image: string; updated_at: Date; created_at: Date };
	created_at: Date;
	updated_at: Date;
};

export type Manufacturer = {
	id: number;
	name: string;
	created_at: Date;
	updated_at: Date;
};

export type Primal = {
	id: number;
	name: string;
	slug: string;
	description: string;
	created_at: Date;
	updated_at: Date;
};

export type Farm = {
	id: number;
	name: string;
	address: string;
	created_at: Date;
	updated_at: Date;
}

export type User = {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	is_staff: boolean;
	is_admin: boolean;
	is_superuser: boolean;
};

export let passwordModal = writable(false);
export let passwordConfirmation = writable(false);
export let inviteUserModal = writable(false);
export const container = writable<Option[]>([]);
export let Roles = writable<Role[]>([]);
export let Brands = writable<Brand[]>([]);
export let Manufacturers = writable<Manufacturer[]>([]);
export let Primals = writable<Primal[]>([]);
export let Users = writable<User[]>([]);
export let Farms = writable<Farm[]>([]);

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
