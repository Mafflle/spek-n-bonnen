import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { data } from 'autoprefixer';

export const load: PageServerLoad = async ({ fetch }) => {
	const getPrimals = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/primals/`);
	const getTags = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/tags/`);
	// const getMainGroups = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/main_groups/`);
	const getVendors = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/vendors/`);

	// console.log(getPrimals.statusText);
	if (getPrimals.ok && getTags.ok && getVendors.ok) {
		let primals = await getPrimals.json();
		const tags = await getTags.json();
		let vendors = await getVendors.json();

		primals.results = primals.results.map((primal) => {
			return {
				value: primal.id,
				label: primal.name
			};
		});
		vendors.results = vendors.results.map((vendor) => {
			return {
				value: vendor.id,
				label: vendor.name
			};
		});
		return {
			primals: primals.results,
			tags: tags.results,
			vendors: vendors.results
		};
	}
};

export const actions: Actions = {
	'manage-product': async ({ fetch, request }) => {
		const formData = await request.formData();

		const seo = formData.get('seo') as string;
		const plu = formData.get('plu') as string;
		const sku = formData.get('sku') as string;
		const slug = formData.get('slug');
		const name_en = formData.get('name_en') as string;
		const name_nl = formData.get('name_nl') as string;
		const name_fr = formData.get('name_fr') as string;
		const ahdb_description_en = formData.get('ahdb_description_en') as string;
		const ahdb_description_nl = formData.get('ahdb_description_nl') as string;
		const ahdb_description_fr = formData.get('ahdb_description_fr') as string;
		const short_description_en = formData.get('short_description_en') as string;
		const short_description_nl = formData.get('short_description_nl') as string;
		const short_description_fr = formData.get('short_description_fr') as string;
		const long_description_en = formData.get('long_description_en') as string;
		const long_description_nl = formData.get('long_description_nl') as string;
		const long_description_fr = formData.get('long_description_fr') as string;
		const unit_status = formData.get('unit_status') as string;
		const q_factor = formData.get('q_factor');
		const selling_tax = formData.get('selling_tax');
		const shop_sell_price = formData.get('shop_sell_price') as string;
		const ecommerce_sell_price_b2c = formData.get('ecommerce_sell_price_b2c') as string;
		const ecommerce_sell_price_b2b = formData.get('ecommerce_sell_price_b2b') as string;
		const selling_unit = formData.get('selling_unit') as string;
		const discount_percentage_b2c = formData.get('discount_percentage_b2c') as string;
		const discount_percentage_b2b = formData.get('discount_percentage_b2b') as string;
		const status = formData.get('status') as string;
		const ingredients_en = formData.get('ingredients_en') as string;
		const ingredients_nl = formData.get('ingredients_nl') as string;
		const ingredients_fr = formData.get('ingredients_fr') as string;
		const allergens_en = formData.get('allergens_en') as string;
		const allergens_nl = formData.get('allergens_nl') as string;
		const allergens_fr = formData.get('allergens_fr') as string;
		const storage_requirements_en = formData.get('storage_requirements_en') as string;
		const storage_requirements_nl = formData.get('storage_requirements_nl') as string;
		const storage_requirements_fr = formData.get('storage_requirements_fr') as string;
		const nutritional_information = formData.get('nutritional_information') as string;
		const cooking_instructions = formData.get('cooking_instructions') as string;
		const pairing_suggestion = formData.get('pairing_suggestion') as string;
		const livestock_breed = formData.get('livestock_breed') as string;
		const cut_type = formData.get('cut_type') as string;
		const primal_quarter = formData.get('primal_quarter') as string;
		const cut_category = formData.get('cut_category') as string;
		const cooking_methods = formData.get('cooking_methods') as string;
		const dry_aging_duration = formData.get('dry_aging_duration') as string;
		const sex = formData.get('sex') as string;
		const age = formData.get('age') as string;
		const diet = formData.get('diet') as string;
		const marbling = formData.get('marbling') as string;
		const texture = formData.get('texture') as string;
		const flavour = formData.get('flavour') as string;
		const fat_content = formData.get('fat_content') as string;
		const moisture_content = formData.get('moisture_content') as string;
		const bone_content = formData.get('bone_content');
		const tenderness = formData.get('tenderness');
		const qualifies_for_return = formData.get('qualifies_for_return');
		const action_shot = formData.get('action_shot');
		const background_shot = formData.get('background_shot');
		const primal = formData.get('primal');
		const preffered_vendor = formData.get('preffered_vendor');
		const closeup_shots = formData.getAll('closeup_shots');
		const lifestyle_shots = formData.getAll('lifestyle_shots');
		const tags = formData.get('tags');

		const dataToValidate = {
			...(seo && { seo }),
			...(plu && { plu }),
			...(sku && { sku }),
			...(slug && { slug }),
			...(name_en && { name_en }),
			...(name_nl && { name_nl }),
			...(name_fr && { name_fr }),
			...(ahdb_description_en && { ahdb_description_en }),
			...(ahdb_description_nl && { ahdb_description_nl }),
			...(ahdb_description_fr && { ahdb_description_fr }),
			...(short_description_en && { short_description_en }),
			...(short_description_nl && { short_description_nl }),
			...(short_description_fr && { short_description_fr }),
			...(long_description_en && { long_description_en }),
			...(long_description_nl && { long_description_nl }),
			...(long_description_fr && { long_description_fr }),
			...(unit_status && { unit_status }),
			...(q_factor && { q_factor }),
			...(selling_tax && { selling_tax }),
			...(shop_sell_price && { shop_sell_price }),
			...(ecommerce_sell_price_b2c && { ecommerce_sell_price_b2c }),
			...(ecommerce_sell_price_b2b && { ecommerce_sell_price_b2b }),
			...(selling_unit && { selling_unit }),
			...(discount_percentage_b2c && { discount_percentage_b2c }),
			...(discount_percentage_b2b && { discount_percentage_b2b }),
			...(status && { status }),
			...(ingredients_en && { ingredients_en }),
			...(ingredients_nl && { ingredients_nl }),
			...(ingredients_fr && { ingredients_fr }),
			...(allergens_en && { allergens_en }),
			...(allergens_nl && { allergens_nl }),
			...(allergens_fr && { allergens_fr }),
			...(storage_requirements_en && { storage_requirements_en }),
			...(storage_requirements_nl && { storage_requirements_nl }),
			...(storage_requirements_fr && { storage_requirements_fr }),
			...(nutritional_information && { nutritional_information }),
			...(cooking_instructions && { cooking_instructions }),
			...(livestock_breed && { livestock_breed }),
			...(cut_type && { cut_type }),
			...(primal_quarter && { primal_quarter }),
			...(cut_category && { cut_category }),
			...(cooking_methods && { cooking_methods }),
			...(dry_aging_duration && { dry_aging_duration }),
			...(sex && { sex }),
			...(age && { age }),
			...(diet && { diet }),
			...(marbling && { marbling }),
			...(texture && { texture }),
			...(flavour && { flavour }),
			...(fat_content && { fat_content }),
			...(moisture_content && { moisture_content }),
			...(bone_content && { bone_content }),
			...(tenderness && { tenderness }),
			...(qualifies_for_return && { qualifies_for_return }),
			...(action_shot && { action_shot }),
			...(background_shot && { background_shot }),
			...(primal && { primal }),
			...(preffered_vendor && { preffered_vendor }),
			...(closeup_shots && { closeup_shots }),
			...(lifestyle_shots && { lifestyle_shots }),
			...(tags && { tags })
		};
		console.log(dataToValidate);

		return {
			inputs: dataToValidate
		};
	}
};
