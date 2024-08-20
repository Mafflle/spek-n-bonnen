import { writable } from 'svelte/store';

export interface Product {
	id: number;
	name: string;
	name_en?: string; // Optional for different languages
	name_nl?: string;
	name_fr?: string;
	slug: string;
	sku: string; // Stock Keeping Unit
	short_customer_facing_description: string;
	short_customer_facing_description_en?: string;
	short_customer_facing_description_nl?: string;
	short_customer_facing_description_fr?: string;
	long_customer_facing_description: string;
	long_customer_facing_description_en?: string;
	long_customer_facing_description_nl?: string;
	long_customer_facing_description_fr?: string;
	short_internal_use_description: string;
	short_internal_use_description_en?: string;
	short_internal_use_description_nl?: string;
	short_internal_use_description_fr?: string;
	long_internal_use_description: string;
	long_internal_use_description_en?: string;
	long_internal_use_description_nl?: string;
	long_internal_use_description_fr?: string;
	ingredients: string;
	ingredients_en?: string;
	ingredients_nl?: string;
	ingredients_fr?: string;
	allergens: string;
	allergens_en?: string;
	allergens_nl?: string;
	allergens_fr?: string;
	storage_requirement: string;
	storage_requirement_en?: string;
	storage_requirement_nl?: string;
	storage_requirement_fr?: string;
	nutritional_information: string;
	nutritional_information_en?: string;
	nutritional_information_nl?: string;
	nutritional_information_fr?: string;
	nutritional_claims: string;
	nutritional_claims_en?: string;
	nutritional_claims_nl?: string;
	nutritional_claims_fr?: string;
	health_claims: string;
	health_claims_en?: string;
	health_claims_nl?: string;
	health_claims_fr?: string;
	selling_tax_percentage: number;
	shop_selling_price_vat_incl_b2b: number;
	shop_selling_price_vat_incl_b2c: number;
	ecommerce_selling_price_vat_excl_b2b: number;
	ecommerce_selling_price_vat_excl_b2c: number;
	created_at: string; // Or Date if you're storing as a Date object
	updated_at: string; // Or Date
	featured_img?: string; // Optional image URL
	preferred_vendor?: string; // Optional vendor name
	product_type: string;
	images?: string[]; // Optional array of image URLs
}
export interface BatchAttr {
	id?: number;
	name: string;
	is_required: boolean;
	default_value?: any; // Could be string, number, boolean, etc.
	data_type: dataType;
	choice_list?: any[];
}

export interface ProductType {
	id: number;
	batch_attributes: BatchAttr[];
	name: string;
	is_enabled: boolean;
	created_at: string | Date;
	updated_at: string | Date;
}

// Product type

export type dataType = 'text' | 'select' | 'boolean' | 'multi-select' | 'date' | 'number';
export interface typeObject {
	value: dataType;
	label: string;
	icon: any;
}

export const productsStore = writable<Product[]>([]);
export const productTypes = writable<ProductType[]>([]);
