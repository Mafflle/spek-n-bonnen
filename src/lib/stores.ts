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
	reorder_point: number;
	created_at: Date;
	updated_at: Date;
};

export type Farm = {
	id: number;
	name: string;
	address: string;
	created_at: Date;
	updated_at: Date;
};

export type Vendor = {
	id: number;
	name: string;
	address: string;
	phone_number: string;
	created_at: Date;
	updated_at: Date;
};

export type ButcherShop = {
	id: number;
	name: string;
	address: string;
	created_at: Date;
	updated_at: Date;
};
export type SlaughterHouse = {
	id: number;
	name: string;
	address: string;
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
	farm: Farm;
	slaughter_house: SlaughterHouse;
	butcher_shop: ButcherShop;
	manufacturer: Manufacturer;
	brand: Brand;
	vendor: Vendor;
	farm_id: string;
	slaughter_house_id: string;
	butcher_shop_id: string;
	manufacturer_id: string;
	brand_id: string;
	vendor_id: string;
	created_at: string;
	updated_at: string;
};

export let passwordModal = writable(false);
export let passwordConfirmation = writable(false);
export let inviteUserModal = writable(false);
export const container = writable<Option[]>([]);
export let Roles = writable<Role[]>([]);
export let Brands = writable<Brand[]>([]);
export let Manufacturers = writable<Manufacturer[]>([]);
export let Primals = writable<Primal[]>([]);
export let Users = writable<{ name: string; email: string }[]>([]);
export let Farms = writable<Farm[]>([]);
export let Vendors = writable<Vendor[]>([]);
export let ButcherShops = writable<ButcherShop[]>([]);
export let SlaughterHouses = writable<SlaughterHouse[]>([]);
export let Batches = writable<Batch[]>([]);
export let currentProvider = writable<
	Primal | Brand | Vendor | Manufacturer | Farm | ButcherShop | SlaughterHouse | null
>(null);

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
