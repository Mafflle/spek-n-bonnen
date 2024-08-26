import { writable } from 'svelte/store';

export type Supplier = {
	id?: number;
	email: string;
	company_name: string;
	address: string;
	phone?: string;
	contact_person?: string;
	logo?: { id: number; title: string; image: string; updated_at: Date; created_at: Date };
	updated_at?: Date;
	created_at?: Date;
};

export let Suppliers = writable<Supplier[]>([]);
export let currentSupplier = writable<Supplier | null>(null);
