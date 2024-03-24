import { writable } from 'svelte/store';

export type Provider = {
	id?: number;
	slug?: string;
	name: string;
	address?: string;
	phone_number?: string;
	type: ProviderType;
	image?: { id: number; title: string; image: string; updated_at: Date; created_at: Date };
	updated_at?: Date;
	created_at?: Date;
};

export enum ProviderType {
	Vendor = 'vendor',
	Manufacturer = 'manufacturer',
	Farm = 'farm',
	Brand = 'brand',
	SlaughterHouse = 'slaughter_house',
	ButcherShop = 'butcher_shop'
}

export let Providers = writable<Provider[]>([]);
export let currentProvider = writable<Provider | null>(null);
