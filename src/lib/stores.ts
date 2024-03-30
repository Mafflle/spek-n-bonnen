import { writable } from 'svelte/store';
import { isEqual, type Option } from './utils';

export type Permission = {
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

export type Primal = {
	id: number;
	name: string;
	slug: string;
	description: string;
	reorder_point: number;
	created_at: Date;
	updated_at: Date;
};

export enum GroupEnum {
	AUTO = 'AUTO',
	MANUAL = 'MANUAL'
}
export enum VAT {
	one = 1,
	two,
	three,
	four
}

export type MainGroup = {
	id?: number;
	name: string;
	department: string;
	vat: VAT;
	color: string;
	traceability: GroupEnum;
	traceability_scenario: string;
	created_at?: Date;
	updated_at?: Date;
};

export type Tag = {
	id: number;
	slug: string;
	name: string;
	created_at: Date;
	updated_at: Date;
};

export type Batch = {
	id: number;
	primal: number;
	carcass: number;
	ean_barcode: string;
	quantity: number;
	remaining_quantity: number;
	expiry_date: Date;
	created_at: Date;
	updated_at: Date;
};

export type CarcassType = {
	id: string;
	purchase_price: string;
	cold_weight: string;
	weight: string;
	lot_number: string;
	ahdb_code: string;
	vendor_code: string;
	vendor_item_name: string;
	vendor_moq: string;
	vendor_moq_unit: string;
	origin_and_terroir?: string;
	certifications?: string;
	country_of_origin?: string;
	ear_tag?: string;
	lairage_number?: string;
	carcass_number?: string;
	sex_category: string;
	conformation: string;
	fat_score: string;
	date_of_slaughter: string;
	date_received: string;

	created_at: string;
	updated_at: string;
};

export let passwordModal = writable(false);
export let passwordConfirmation = writable(false);
export let inviteUserModal = writable(false);
export const container = writable<(Permission | Role)[]>([]);
export let Roles = writable<Role[]>([]);
export let Primals = writable<Primal[]>([]);
export let LoggedinUser = writable<{ name: string; email: string; color: string }[]>([]);
export let Batches = writable<Batch[]>([]);
export let MainGroups = writable<MainGroup[]>([]);
export let Tags = writable<any[]>([]);
export let currentCarcass = writable<CarcassType | null>(null);

export const updateSelectedOptions = (option: Permission | Role) => {
	container.update((items) => {
		if (items.length > 0) {
			for (const perms of items) {
				if (isEqual(perms, option)) {
					items = items.filter((item) => {
						return item.id !== option.id;
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
