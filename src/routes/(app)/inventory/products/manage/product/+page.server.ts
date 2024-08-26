import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { fail, type Actions } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const getProductTypes = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/product-type/`);
	const getAllSupplier = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/supplier/`);

	if (getProductTypes.ok && getAllSupplier) {
		const types = await getProductTypes.json();
		const allSupplier = await getAllSupplier.json();

		return {
			types,
			allSupplier
		};
	} else {
		console.log(getProductTypes.status);
		console.log(getAllSupplier.status);
	}
};

interface Errors {
	name?: [string];
	server?: [string];
}

const priceSchema = z.number().transform((value) => Math.round(value * 100)); // Convert to v
const productSchema = z.object({
	name: z.string(),
	name_en: z
		.string({ required_error: 'Product name is required' })
		.min(3, { message: 'Product name should be longer' })
		.trim(),
	name_nl: z
		.string({ required_error: 'Product name is required' })
		.min(3, { message: 'Product name should be longer' })
		.trim()
		.optional(),
	name_fr: z
		.string({ required_error: 'Product name is required' })
		.min(3, { message: 'Product name should be longer' })
		.trim()
		.optional(),

	sku: z.string(),

	short_customer_facing_description: z.string(),
	short_customer_facing_description_en: z
		.string({ required_error: 'Short customer facing description is required' })
		.min(3, { message: 'Short customer facing description should be longer' })
		.trim(),
	short_customer_facing_description_nl: z
		.string({ required_error: 'Short customer facing description is required' })
		.min(3, { message: 'Short customer facing description should be longer' })
		.trim()
		.optional(),
	short_customer_facing_description_fr: z
		.string({ required_error: 'Short customer facing description is required' })
		.min(3, { message: 'Short customer facing description should be longer' })
		.trim()
		.optional(),

	long_customer_facing_description: z.string(),
	long_customer_facing_description_en: z
		.string({ required_error: 'Long customer facing description is required' })
		.min(3, { message: 'Long customer facing description should be longer' })
		.trim(),
	long_customer_facing_description_nl: z
		.string({ required_error: 'Long customer facing description is required' })
		.min(3, { message: 'Long customer facing description should be longer' })
		.trim()
		.optional(),
	long_customer_facing_description_fr: z
		.string({ required_error: 'Long customer facing description is required' })
		.min(3, { message: 'Long customer facing description should be longer' })
		.trim()
		.optional(),

	short_internal_use_description: z.string(),
	short_internal_use_description_en: z
		.string({ required_error: 'Short internal use description is required' })
		.min(3, { message: 'Short internal use description should be longer' })
		.trim(),
	short_internal_use_description_nl: z
		.string({ required_error: 'Short internal use description is required' })
		.min(3, { message: 'Short internal use description should be longer' })
		.trim()
		.optional(),
	short_internal_use_description_fr: z
		.string({ required_error: 'Short internal use description is required' })
		.min(3, { message: 'Short internal use description should be longer' })
		.trim()
		.optional(),

	long_internal_use_description: z.string(),
	long_internal_use_description_en: z
		.string({ required_error: 'Long internal use description is required' })
		.min(3, { message: 'Long internal use description should be longer' })
		.trim(),
	long_internal_use_description_nl: z
		.string({ required_error: 'Long internal use description is required' })
		.min(3, { message: 'Long internal use description should be longer' })
		.trim()
		.optional(),
	long_internal_use_description_fr: z
		.string({ required_error: 'Long internal use description is required' })
		.min(3, { message: 'Long internal use description should be longer' })
		.trim()
		.optional(),

	ingredients: z.string(),
	ingredients_en: z
		.string({ required_error: 'Ingredients are required' })
		.min(3, { message: 'Ingrdients should be longer' })
		.trim(),
	ingredients_nl: z
		.string({ required_error: 'Ingredients are required' })
		.min(3, { message: 'Ingrdients should be longer' })
		.trim()
		.optional(),
	ingredients_fr: z
		.string({ required_error: 'Ingredients are required' })
		.min(3, { message: 'Ingrdients should be longer' })
		.trim()
		.optional(),

	allergens: z.string(),
	allergens_en: z
		.string({ required_error: 'Allergens are required' })
		.min(3, { message: 'Allergens should be longer' })
		.trim(),
	allergens_nl: z
		.string({ required_error: 'Allergens are required' })
		.min(3, { message: 'Allergens should be longer' })
		.trim()
		.optional(),
	allergens_fr: z
		.string({ required_error: 'Allergens are required' })
		.min(3, { message: 'Allergens should be longer' })
		.trim()
		.optional(),

	storage_requirement: z.string(),
	storage_requirement_en: z
		.string({ required_error: 'Storage requirements are required' })
		.min(3, { message: 'Storage requirements should be longer' })
		.trim(),
	storage_requirement_nl: z
		.string({ required_error: 'Storage requirements are required' })
		.min(3, { message: 'Storage requirements should be longer' })
		.trim()
		.optional(),
	storage_requirement_fr: z
		.string({ required_error: 'Storage requirements are required' })
		.min(3, { message: 'Storage requirements should be longer' })
		.trim()
		.optional(),

	nutritional_information: z.string(),
	nutritional_information_en: z
		.string({ required_error: 'Nutritional information is required' })
		.min(3, { message: 'Nutritional information should be longer' })
		.trim(),
	nutritional_information_nl: z
		.string({ required_error: 'Nutritional information is required' })
		.min(3, { message: 'Nutritional information should be longer' })
		.trim()
		.optional(),
	nutritional_information_fr: z
		.string({ required_error: 'Nutritional information is required' })
		.min(3, { message: 'Nutritional information should be longer' })
		.trim()
		.optional(),

	nutritional_claims: z.string(),
	nutritional_claims_en: z
		.string({ required_error: 'Nutritional claims are required' })
		.min(3, { message: 'Nutrtional claims should be longer' })
		.trim(),
	nutritional_claims_nl: z
		.string({ required_error: 'Nutritional claims are required' })
		.min(3, { message: 'Nutrtional claims should be longer' })
		.trim()
		.optional(),
	nutritional_claims_fr: z
		.string({ required_error: 'Nutritional claims are required' })
		.min(3, { message: 'Nutrtional claims should be longer' })
		.trim()
		.optional(),

	health_claims: z.string(),
	health_claims_en: z
		.string({ required_error: 'Health claims are required' })
		.min(3, { message: 'Health claims should be longer' })
		.trim(),
	health_claims_nl: z
		.string({ required_error: 'Health claims are required' })
		.min(3, { message: 'Health claims should be longer' })
		.trim()
		.optional(),
	health_claims_fr: z
		.string({ required_error: 'Health claims are required' })
		.min(3, { message: 'Health claims should be longer' })
		.trim()
		.optional(),

	selling_tax_percentage: z.number().int().min(-100).max(100),
	shop_selling_price_vat_incl_b2b: priceSchema,
	shop_selling_price_vat_incl_b2c: priceSchema,
	ecommerce_selling_price_vat_excl_b2b: priceSchema,
	ecommerce_selling_price_vat_excl_b2c: priceSchema,

	featured_img: z.number(),
	preferred_vendor: z.number(),
	product_type: z.number(),

	images: z.array(z.number())
});

export const actions: Actions = {
	'manage-product': async ({ fetch, request }) => {
		const formData = await request.formData();

		const sku = formData.get('sku') as string;

		const name_en = formData.get('name_en') as string;

		let name = name_en && name_en;

		const name_nl = formData.get('name_nl') as string;

		const name_fr = formData.get('name_fr') as string;

		const short_customer_facing_description_en = formData.get(
			'short_customer_facing_description_en'
		) as string;

		const short_customer_facing_description =
			short_customer_facing_description_en && short_customer_facing_description_en;

		const short_customer_facing_description_nl = formData.get(
			'short_customer_facing_description_nl'
		) as string;

		const short_customer_facing_description_fr = formData.get(
			'short_customer_facing_description_fr'
		) as string;

		const long_customer_facing_description_en = formData.get(
			'long_customer_facing_description_en'
		) as string;

		const long_customer_facing_description =
			long_customer_facing_description_en && long_customer_facing_description_en;

		const long_customer_facing_description_nl = formData.get(
			'long_customer_facing_description_nl'
		) as string;

		const long_customer_facing_description_fr = formData.get(
			'long_customer_facing_description_fr'
		) as string;

		const short_internal_use_description_en = formData.get(
			'short_internal_use_description_en'
		) as string;

		const short_internal_use_description =
			short_internal_use_description_en && short_internal_use_description_en;

		const short_internal_use_description_nl = formData.get(
			'short_internal_use_description_nl'
		) as string;

		const short_internal_use_description_fr = formData.get(
			'short_internal_use_description_fr'
		) as string;

		const long_internal_use_description_en = formData.get(
			'long_internal_use_description_en'
		) as string;
		const long_internal_use_description =
			long_internal_use_description_en && long_internal_use_description_en;

		const long_internal_use_description_nl = formData.get(
			'long_internal_use_description_nl'
		) as string;

		const long_internal_use_description_fr = formData.get(
			'long_internal_use_description_fr'
		) as string;

		const selling_tax_percentage = parseInt(formData.get('selling_tax_percentage') as string);
		const shop_selling_price_vat_incl_b2b = parseInt(
			formData.get('shop_selling_price_vat_incl_b2b') as string
		);
		const shop_selling_price_vat_incl_b2c = parseInt(
			formData.get('shop_selling_price_vat_incl_b2c') as string
		);
		const ecommerce_selling_price_vat_excl_b2c = parseInt(
			formData.get('ecommerce_selling_price_vat_excl_b2c') as string
		);
		const ecommerce_selling_price_vat_excl_b2b = parseInt(
			formData.get('ecommerce_selling_price_vat_excl_b2b') as string
		);

		const ingredients_en = formData.get('ingredients_en') as string;
		const ingredients = ingredients_en && ingredients_en;
		const ingredients_nl = formData.get('ingredients_nl') as string;
		const ingredients_fr = formData.get('ingredients_fr') as string;
		const allergens_en = formData.get('allergens_en') as string;
		const allergens = allergens_en && allergens_en;
		const allergens_nl = formData.get('allergens_nl') as string;
		const allergens_fr = formData.get('allergens_fr') as string;
		const storage_requirement_en = formData.get('storage_requirement_en') as string;
		const storage_requirement = storage_requirement_en && storage_requirement_en;
		const storage_requirement_nl = formData.get('storage_requirement_nl') as string;
		const storage_requirement_fr = formData.get('storage_requirement_fr') as string;
		const nutritional_information_en = formData.get('nutritional_information_en') as string;
		const nutritional_information = nutritional_information_en && nutritional_information_en;
		const nutritional_information_fr = formData.get('nutritional_information_fr') as string;
		const nutritional_information_nl = formData.get('nutritional_information_nl') as string;
		const nutritional_claims_en = formData.get('nutritional_claims_en') as string;
		const nutritional_claims = nutritional_claims_en && nutritional_claims_en;
		const nutritional_claims_fr = formData.get('nutritional_claims_fr') as string;
		const nutritional_claims_nl = formData.get('nutritional_claims_nl') as string;

		const health_claims_en = formData.get('health_claims_en') as string;
		const health_claims = health_claims_en && health_claims_en;
		const health_claims_fr = formData.get('health_claims_fr') as string;
		const health_claims_nl = formData.get('health_claims_nl') as string;

		const featured_img = parseInt(formData.get('featured_img') as string);
		const imagesArray = formData.getAll('image');
		const images = imagesArray.map((image) => parseInt(image as string));

		const preferred_vendor = parseInt(formData.get('preferred_vendor') as string);
		const product_type = parseInt(formData.get('product_type') as string);

		// const dataToValidate = {
		// 	...(sku && { sku }),
		// 	...(name_en && { name_en }),
		// 	...(name && { name }),
		// 	...(name_nl && { name_nl }),
		// 	...(name_fr && { name_fr }),
		// 	...(short_customer_facing_description_en && { short_customer_facing_description_en }),
		// 	...(short_customer_facing_description && { short_customer_facing_description }),
		// 	...(short_customer_facing_description_nl && { short_customer_facing_description_nl }),
		// 	...(short_customer_facing_description_fr && { short_customer_facing_description_fr }),
		// 	...(long_customer_facing_description_en && { long_customer_facing_description_en }),
		// 	...(long_customer_facing_description && { long_customer_facing_description }),
		// 	...(long_customer_facing_description_nl && { long_customer_facing_description_nl }),
		// 	...(long_customer_facing_description_fr && { long_customer_facing_description_fr }),
		// 	...(short_internal_use_description_en && { short_internal_use_description_en }),
		// 	...(short_internal_use_description && { short_internal_use_description }),
		// 	...(short_internal_use_description_nl && { short_internal_use_description_nl }),
		// 	...(short_internal_use_description_fr && { short_internal_use_description_fr }),
		// 	...(long_internal_use_description_en && { long_internal_use_description_en }),
		// 	...(long_internal_use_description && { long_internal_use_description }),
		// 	...(long_internal_use_description_nl && { long_internal_use_description_nl }),
		// 	...(long_internal_use_description_fr && { long_internal_use_description_fr }),

		// 	...(selling_tax_percentage && { selling_tax_percentage }),
		// 	...(shop_selling_price_vat_incl_b2b && { shop_selling_price_vat_incl_b2b }),
		// 	...(shop_selling_price_vat_incl_b2c && { shop_selling_price_vat_incl_b2c }),
		// 	...(ecommerce_selling_price_vat_excl_b2c && { ecommerce_selling_price_vat_excl_b2c }),
		// 	...(ecommerce_selling_price_vat_excl_b2b && { ecommerce_selling_price_vat_excl_b2b }),

		// 	...(ingredients_en && { ingredients_en }),
		// 	...(ingredients && { ingredients }),
		// 	...(ingredients_nl && { ingredients_nl }),
		// 	...(ingredients_fr && { ingredients_fr }),
		// 	...(allergens_en && { allergens_en }),
		// 	...(allergens && { allergens }),
		// 	...(allergens_nl && { allergens_nl }),
		// 	...(allergens_fr && { allergens_fr }),
		// 	...(storage_requirement_en && { storage_requirement_en }),
		// 	...(storage_requirement && { storage_requirement }),
		// 	...(storage_requirement_nl && { storage_requirement_nl }),
		// 	...(storage_requirement_fr && { storage_requirement_fr }),
		// 	...(nutritional_information_en && { nutritional_information_en }),
		// 	...(nutritional_information && { nutritional_information }),
		// 	...(nutritional_information_fr && { nutritional_information_fr }),
		// 	...(nutritional_information_nl && { nutritional_information_nl }),
		// 	...(nutritional_claims_en && { nutritional_claims_en }),
		// 	...(nutritional_claims && { nutritional_claims }),
		// 	...(nutritional_claims_fr && { nutritional_claims_fr }),
		// 	...(nutritional_claims_nl && { nutritional_claims_nl }),
		// 	...(health_claims_en && { health_claims_en }),
		// 	...(health_claims && { health_claims }),
		// 	...(health_claims_fr && { health_claims_fr }),
		// 	...(health_claims_nl && { health_claims_nl }),

		// 	...(featured_img && { featured_img }),
		// 	...(images && { images }),

		// 	...(preferred_vendor && { preferred_vendor }),
		// 	...(product_type && { product_type })
		// };
		const validProduct = {
			name: 'Freshly Baked Baguette',
			name_en: 'Freshly Baked Baguette',
			name_nl: 'Vers Gebakken Baguette',
			name_fr: 'Baguette Fraîchement Cuite',

			sku: 'BAGT-003',

			short_customer_facing_description: 'Crusty on the outside, soft on the inside.',
			short_customer_facing_description_en: 'Crusty on the outside, soft on the inside.',
			short_customer_facing_description_nl: 'Knapperig van buiten, zacht van binnen.',
			short_customer_facing_description_fr: "Croustillant à l'extérieur, moelleux à l'intérieur.",

			long_customer_facing_description:
				'Our traditional baguette, made with simple ingredients and baked fresh daily.',
			long_customer_facing_description_en:
				'Our traditional baguette, made with simple ingredients and baked fresh daily.',
			long_customer_facing_description_nl:
				'Onze traditionele baguette, gemaakt met eenvoudige ingrediënten en dagelijks vers gebakken.',
			long_customer_facing_description_fr:
				'Notre baguette traditionnelle, faite avec des ingrédients simples et cuite frais tous les jours.',

			short_internal_use_description: 'Baguette - SKU BAGT-003',
			short_internal_use_description_en: 'Baguette - SKU BAGT-003',
			short_internal_use_description_nl: 'Baguette - SKU BAGT-003',
			short_internal_use_description_fr: 'Baguette - SKU BAGT-003',

			long_internal_use_description:
				'Best sold on the day of baking. Store in a paper bag at room temperature.',
			long_internal_use_description_en:
				'Best sold on the day of baking. Store in a paper bag at room temperature.',
			long_internal_use_description_nl:
				'Het beste verkocht op de dag van het bakken. Bewaar in een papieren zak op kamertemperatuur.',
			long_internal_use_description_fr:
				'Meilleur vendu le jour de la cuisson. Conserver dans un sac en papier à température ambiante.',

			ingredients: 'Flour, water, yeast, salt.',
			ingredients_en: 'Flour, water, yeast, salt.',
			ingredients_nl: 'Bloem, water, gist, zout.',
			ingredients_fr: 'Farine, eau, levure, sel.',

			allergens: 'Contains gluten.',
			allergens_en: 'Contains gluten.',
			allergens_nl: 'Bevat gluten.',
			allergens_fr: 'Contient du gluten.',

			storage_requirement: 'Store in a paper bag at room temperature.',
			storage_requirement_en: 'Store in a paper bag at room temperature.',
			storage_requirement_nl: 'Bewaar in een papieren zak op kamertemperatuur.',
			storage_requirement_fr: 'Conserver dans un sac en papier à température ambiante.',

			nutritional_information: 'See label for details.',
			nutritional_information_en: 'See label for details.',
			nutritional_information_nl: 'Zie etiket voor details.',
			nutritional_information_fr: "Voir l'étiquette pour plus de détails.",

			nutritional_claims: 'Source of carbohydrates.',
			nutritional_claims_en: 'Source of carbohydrates.',
			nutritional_claims_nl: 'Bron van koolhydraten.',
			nutritional_claims_fr: 'Source de glucides.',

			health_claims: 'None.',
			health_claims_en: 'None.',
			health_claims_nl: 'Geen.',
			health_claims_fr: 'Aucun.',

			selling_tax_percentage: 6,
			shop_selling_price_vat_incl_b2b: 95, // €0.95
			shop_selling_price_vat_incl_b2c: 110, // €1.10
			ecommerce_selling_price_vat_excl_b2b: 80, // €0.80
			ecommerce_selling_price_vat_excl_b2c: 92, // €0.92

			featured_img: 1,
			preferred_vendor: 1,
			product_type: 1,

			images: [1, 1, 1]
		};
		try {
			const validatedData = productSchema.parse(validProduct);

			const createProduct = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/product`, {
				method: 'post',
				body: JSON.stringify(validatedData)
			});
			if (createProduct.ok) {
				const newProduct = await createProduct.json();
				return {
					newProduct
				};
			} else {
				console.log(createProduct.status);
				const productError = await createProduct.json();
				console.log(productError);

				return fail(500);
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				const errors = error.flatten().fieldErrors;
				return fail(400, { message: 'Validation error', errors });
			}
		}
	},
	'manage-tag': async ({ fetch, request }) => {
		const formData = await request.formData();

		const name = formData.get('name');
		const slug = formData.get('slug');

		const tagSchema = z.object({
			name: z
				.string({ required_error: 'Tag name is required' })
				.min(3, { message: 'Tag name can not be less than 3 letters' })
				.trim()
		});
		const dataToValidate = {
			...(name && { name })
		};
		try {
			const validatedData = tagSchema.parse(dataToValidate);

			if (slug) {
				// console.log(validatedData);

				const editTag = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/tags/${slug}/`, {
					method: 'put',
					body: JSON.stringify(validatedData)
				});
				if (editTag.ok) {
					const tag = await editTag.json();

					return {
						edited: true,
						editedTag: tag
					};
				} else {
					const body = await editTag.json();
					console.log(editTag.status);
					console.log(body);
				}
			} else {
				const createTag = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/tags/`, {
					method: 'post',
					body: JSON.stringify(validatedData)
				});

				if (createTag.ok) {
					let tag = await createTag.json();
					tag = {
						value: tag.id,
						label: tag.name,
						slug: tag.slug
					};
					return {
						newTag: tag
					};
				}
			}
		} catch (error) {
			const toSend = {
				message: '',
				errors: {} as Errors
			};

			if (error instanceof z.ZodError) {
				toSend.message = 'Validation error';
				toSend.errors = error.flatten().fieldErrors;
				return fail(400, toSend);
			}
			toSend.errors = { server: ['Ooops something went wrong'] };
			return fail(500, toSend);
		}
	},
	'delete-tag': async ({ fetch, request }) => {
		const formData = await request.formData();

		const id = formData.get('id');
		if (id) {
			const deleteTag = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/tags/${id}/`, {
				method: 'delete'
			});

			if (deleteTag.ok && deleteTag.status == 204) {
				return { success: true };
			}
		}
	}
};
