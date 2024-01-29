import type { Actions } from '@sveltejs/kit';

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
		const vendor_moq = formData.get('vendor-moq');
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
		const fat_score = formData.get('fat-score');
		const date_of_slaughter = formData.get('date-of-slaughter');
		const date_received = formData.get('date_received');

		// Providers
		const farm_id = parseInt(formData.get('farm') as string);
		const slaughter_house_id = parseInt(formData.get('slaughter_house') as string);
		const butcher_shop_id = parseInt(formData.get('butcher_shop') as string);
		const brand_id = parseInt(formData.get('brand') as string);
		const vendor_id = parseInt(formData.get('vendor') as string);
	}
};
