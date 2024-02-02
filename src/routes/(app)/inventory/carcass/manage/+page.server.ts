import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { Brand, ButcherShop, Farm, Manufacturer, SlaughterHouse, Vendor } from '$lib/stores';
import { z } from 'zod';
import type { CarcassErrors } from '$lib/utils';
import dayjs from 'dayjs';

const manageSchema = z.object({
	purchase_price: z
		.string({ required_error: 'Purchase price is required' })
		.transform((val) => parseFloat(val))
		.refine((val) => !isNaN(val), 'Purchase price must be a valid decimal number'),
	cold_weight: z
		.string({ required_error: 'Cold weight is required' })
		.transform((val) => parseFloat(val))
		.refine((val) => !isNaN(val), 'Cold weight must be a valid decimal number'),
	weight: z
		.string({ required_error: 'Weight is required' })
		.transform((val) => parseFloat(val))
		.refine((val) => !isNaN(val), 'Weight must be a valid decimal number'),
	lot_number: z
		.string({ required_error: 'Lot number is required' })
		.min(1, 'Lot number must be at least 1 character long')
		.max(150, 'Lot number must be at most 150 characters long'),
	ahdb_code: z
		.string({ required_error: 'AHDB code is required' })
		.min(1, 'AHDB code must be at least 1 character long')
		.max(150, 'AHDB code must be at most 150 characters long'),
	vendor_code: z
		.string({ required_error: 'Vendor code is required' })
		.min(1, 'Vendor code must be at least 1 character long')
		.max(150, 'Vendor code must be at most 150 characters long'),
	vendor_item_name: z
		.string({ required_error: 'Vendor item name is required' })
		.min(1, 'Vendor item name must be at least 1 character long')
		.max(150, 'Vendor item name must be at most 150 characters long'),
	vendor_moq: z
		.number({ required_error: 'Vendor moq required' })
		.max(2147483647, 'Vendor MOQ must be less than or equal to 2147483647')
		.min(-2147483648, 'Vendor MOQ must be greater than or equal to -2147483648'),
	vendor_moq_unit: z
		.string({ required_error: 'Vendor moq unit is required' })
		.min(1, 'Vendor MOQ unit must be at least 1 character long')
		.max(150, 'Vendor MOQ unit must be at most 150 characters long'),
	origin_and_terroir: z.string().max(150, 'Origin and terroir must be at most 150 characters long'),
	certifications: z.string().optional(),
	country_of_origin: z
		.string({ required_error: 'Country of origin is required' })
		.max(150, 'Country of origin must be at most 150 characters long'),
	ear_tag: z
		.string({ required_error: 'Ear tag is required' })
		.max(150, 'Ear tag must be at most 150 characters long'),
	lairage_number: z
		.string()
		.max(150, 'Lairage number must be at most 150 characters long')
		.optional(),
	carcass_number: z
		.string({ required_error: 'Carcass number is required' })
		.max(150, 'Carcass number must be at most 150 characters long'),
	sex_category: z.enum(['A', 'B', 'C', 'E'], {
		required_error: 'Sex category is required'
	}),
	conformation: z.string({ required_error: 'Conformation is required' }),
	fat_score: z.number({ required_error: 'Fat score is required' }),
	date_of_slaughter: z.coerce
		.date({
			required_error: 'The date this carcass was slaughtered is required',
			invalid_type_error: 'Date slaughtered must be a valid date'
		})
		.transform((val) => dayjs(val).format('YYYY-MM-DD')),
	date_received: z.coerce
		.date({
			required_error: 'The date this carcass was received is required',
			invalid_type_error: 'Date received must be a valid date'
		})
		.transform((val) => dayjs(val).format('YYYY-MM-DD')),
	farm_id: z.number({ required_error: 'Please select the farm where this carcass was reared' }),
	slaughter_house_id: z.number({
		required_error: 'Please select the slaughter house this carcass is from'
	}),
	butcher_shop_id: z.number({
		required_error: 'Please select the butcher shop this carcass is from'
	}),
	manufacturer_id: z.number({
		required_error: 'Please select the manufacturer this carcass is from'
	}),
	brand_id: z.number({ required_error: 'Please select the brand this carcass is from' }),
	vendor_id: z.number({ required_error: 'Please select the vendor this carcass is from' })
});

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const getFarms = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/farms/`);
	const getSlaughterHouses = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/slaughter_houses/`);
	const getShops = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/butcher_shops/`);
	const getBrands = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/brands/`);
	const getVendors = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/vendors/`);
	const getManufacturers = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/manufacturers/`);
	if (
		getFarms.ok &&
		getSlaughterHouses.ok &&
		getShops.ok &&
		getBrands.ok &&
		getVendors.ok &&
		getManufacturers
	) {
		const farms = await getFarms.json();
		const slaughterHouses = await getSlaughterHouses.json();
		const butcherShops = await getShops.json();
		const brands = await getBrands.json();
		const vendors = await getVendors.json();
		const manufacturers = await getManufacturers.json();

		farms.results = farms.results.map((farm: Farm) => {
			return {
				value: farm.id,
				label: farm.name
			};
		});
		slaughterHouses.results = slaughterHouses.results.map((slaughterHouse: SlaughterHouse) => {
			return {
				value: slaughterHouse.id,
				label: slaughterHouse.name
			};
		});
		butcherShops.results = butcherShops.results.map((shop: ButcherShop) => {
			return {
				value: shop.id,
				label: shop.name
			};
		});
		brands.results = brands.results.map((brand: Brand) => {
			return {
				value: brand.id,
				label: brand.name
			};
		});
		vendors.results = vendors.results.map((vendor: Vendor) => {
			return {
				value: vendor.id,
				label: vendor.name
			};
		});
		manufacturers.results = manufacturers.results.map((manufacturer: Manufacturer) => {
			return {
				value: manufacturer.id,
				label: manufacturer.name
			};
		});
		const access = cookies.get('access');
		return {
			farms,
			slaughterHouses,
			butcherShops,
			brands,
			vendors,
			manufacturers,
			access
		};
	} else {
		console.log('farms', getFarms.status, getFarms.statusText);
		console.log('slaughterHouse', getSlaughterHouses.status, getSlaughterHouses.statusText);
		console.log('butchers', getShops.status, getShops.statusText);
		console.log('brands', getBrands.status, getBrands.statusText);
		console.log('vendors', getVendors.status, getVendors.statusText);
		console.log('manufacturers', getManufacturers.status, getManufacturers.statusText);
	}
};

export const actions: Actions = {
	'manage-carcass': async ({ request, fetch }) => {
		const formData = await request.formData();

		const purchase_price = formData.get('purchase-price');
		const cold_weight = formData.get('cold-weight');
		const weight = formData.get('weight');
		const lot_number = formData.get('lot-number');
		const ahdb_code = formData.get('abhd-number');
		const vendor_code = formData.get('vendor-code');
		const vendor_item_name = formData.get('vendor-item-name');
		const vendor_moq = parseInt(formData.get('vendor-moq') as string);
		const vendor_moq_unit = formData.get('vendor-moq-unit');

		// traceability
		const origin_and_terroir = formData.get('origin-and-terrior');
		const certifications = formData.get('certifications');
		const country_of_origin = formData.get('country');
		const ear_tag = formData.get('ear-tag');
		const lairage_number = formData.get('lairage-number');
		const carcass_number = formData.get('carcass_number');
		const sex_category = formData.get('sex-category');
		const conformation = formData.get('conformation');
		const fat_score = parseInt(formData.get('fat-score') as string);
		const date_of_slaughter = dayjs(formData.get('date_of_slaughter') as string).format(
			'YYYY-MM-DD'
		);
		const date_received = dayjs(formData.get('date_received') as string).format('YYYY-MM-DD');

		// Providers
		const farm_id = parseInt(formData.get('farm') as string);
		const slaughter_house_id = parseInt(formData.get('slaughter_house') as string);
		const butcher_shop_id = parseInt(formData.get('butcher_shop') as string);
		const manufacturer_id = parseInt(formData.get('manufacturer') as string);
		const brand_id = parseInt(formData.get('brand') as string);
		const vendor_id = parseInt(formData.get('vendor') as string);

		const dataToValidate = {
			...(purchase_price && { purchase_price }),
			...(cold_weight && { cold_weight }),
			...(weight && { weight }),
			...(lot_number && { lot_number }),
			...(ahdb_code && { ahdb_code }),
			...(vendor_code && { vendor_code }),
			...(vendor_item_name && { vendor_item_name }),
			...(vendor_moq && { vendor_moq }),
			...(vendor_moq_unit && { vendor_moq_unit }),
			...(origin_and_terroir && { origin_and_terroir }),
			...(certifications && { certifications }),
			...(country_of_origin && { country_of_origin }),
			...(ear_tag && { ear_tag }),
			...(lairage_number && { lairage_number }),
			...(carcass_number && { carcass_number }),
			...(sex_category && { sex_category }),
			...(conformation && { conformation }),
			...(fat_score && { fat_score }),
			...(date_of_slaughter && { date_of_slaughter }),
			...(date_received && { date_received }),
			...(farm_id && { farm_id }),
			...(slaughter_house_id && { slaughter_house_id }),
			...(butcher_shop_id && { butcher_shop_id }),
			...(manufacturer_id && { manufacturer_id }),
			...(brand_id && { brand_id }),
			...(vendor_id && { vendor_id })
		};
		// console.log(dataToValidate);

		try {
			const validatedData = manageSchema.parse(dataToValidate);
			console.log('validation successfull', validatedData);

			const addNewCarcass = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/carcasses/`, {
				method: 'post',
				body: JSON.stringify(validatedData)
			});

			if (addNewCarcass.ok) {
				const newCarcass = await addNewCarcass.json();
				return {
					newCarcass,
					edited: false
				};
			} else if (!addNewCarcass.ok && addNewCarcass.status === 400) {
				const badBody = await addNewCarcass.json();
				console.log(dataToValidate);

				console.log('bad request body', badBody);
			} else {
				console.log(addNewCarcass.status, addNewCarcass.statusText);
			}
		} catch (error) {
			const toSend = {
				message: '',
				errors: {} as CarcassErrors
			};
			if (error instanceof z.ZodError) {
				toSend.message = 'Validation Error';
				toSend.errors = error.flatten().fieldErrors;

				return fail(400, toSend);
			}
			console.log('error', error);
		}
	}
};
