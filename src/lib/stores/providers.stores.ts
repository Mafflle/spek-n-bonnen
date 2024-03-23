import { writable } from 'svelte/store';

export type Provider = {
	name: string;
	address?: string;
	phone_number?: string;
	type: ProviderType;
	image?: number;
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
