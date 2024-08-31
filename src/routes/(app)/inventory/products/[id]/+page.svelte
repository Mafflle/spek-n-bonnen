<script lang="ts">
    import ProductViewInput from "$lib/components/product/ProductViewInput.svelte";
	import ProductViewLocale from "$lib/components/product/ProductViewLocale.svelte";
import type { Product } from "$lib/stores/product.stores";
import * as Tabs from "$lib/components/ui/tabs";

    export let data;
    let product: Product = data.product;
    let globalImages = data.images.results;
    let productImages = product.images;
    console.log(data);
</script>

<main class="relative bg-sGray">
    <div class="background-shot relative flex flex-col items-start justify-center gap-3 isolate min-w-full h-56 rounded-t-3xl bg-cover bg-center"
    style={`
    background-image: url(${globalImages.find(img => img.id === product.featured_img)?.image});
    `}
    >
        <div class="absolute inset-0 bg-gray-800 opacity-30 rounded-t-3xl"></div>
        <div class="relative z-10 flex flex-col items-start pl-16 gap-2">
            <h1 class="font-bold text-4xl leading-10 tracking-tight text-white">
                {product.name}
            </h1>
            <p class="font-medium leading-5 text-gray-300 text-sm">
                Inventory / Product / Product
            </p>
        </div>
    </div>
    <div class="product-info flex min-w-full gap-10 px-6 absolute -mt-10">
        <div class="w-1/2  h-auto flex flex-col gap-16">
            <div class="product-images w-full bg-white rounded-lg p-6 shadow-productCard">
                <div class="card-header pb-4 mb-4 border-b border-gray-200">
                    <h3 class="font-semibold text-lg text-gray-800">Images</h3>
                </div>
                <div class="card-content">
                    <div class="product-images grid grid-cols-5 gap-4">
                        <div class="col-span-3">
                            <img src={globalImages.find(img => img.id === productImages[0])?.image}
                                 alt={product.name}
                                 class="w-full h-64 rounded-lg object-cover object-center">
                        </div>
                        <div class="col-span-2 grid grid-rows-2 gap-4 h-64">
                            <img src={globalImages.find(img => img.id === productImages[0])?.image}
                                 alt={product.name}
                                 class="w-full h-full rounded-lg object-cover object-center">
                            <img src={globalImages.find(img => img.id === productImages[0])?.image}
                                 alt={product.name}
                                 class="w-full h-full rounded-lg object-cover object-center">
                        </div>
                    </div>
                </div>
            </div>

            <div class="product-images w-full bg-white rounded-lg p-6 shadow-productCard">
                <div class="card-header pb-4 mb-4 border-b border-gray-200">
                    <h3 class="font-semibold text-lg text-gray-800">Product information</h3>
                </div>
                <div class="card-content flex flex-col gap-8">
                    <ProductViewInput title="Product type id" value={product.product_type} />
                    <ProductViewLocale title="Name" frInput={product.name_fr} enInput={product.name_en} duInput={product.name_nl} />
                    <ProductViewInput title="Preferred vendor id" value={product.preferred_vendor} />
                    <ProductViewLocale title="Short customer facing description" frInput={product.short_customer_facing_description_fr} enInput={product.short_customer_facing_description_en} duInput={product.short_customer_facing_description_nl} />
                    <ProductViewLocale title="Long customer facing description" frInput={product.long_customer_facing_description_fr} enInput={product.long_customer_facing_description_en} duInput={product.long_customer_facing_description_nl} textarea />
                    <ProductViewLocale title="Short internal use description" frInput={product.short_internal_use_description_fr} enInput={product.short_internal_use_description_en} duInput={product.short_internal_use_description_nl} />
                    <ProductViewLocale title="Long internal use description" frInput={product.long_internal_use_description_fr} enInput={product.long_internal_use_description_en} duInput={product.long_internal_use_description_nl} textarea />
                </div>
            </div>
        </div>
        <div class="w-1/2 bg-white rounded-lg shadow-productCard p-6 h-full">
            <Tabs.Root value="nutrition" class="relative w-full px-3  h-full no-scrollbar">
                <Tabs.List class=" bg-[#F7F7F7] py-2.5 px-1 w-full ">
                  <Tabs.Trigger
                  class="md:w-full data-[state=active]:font-bold  data-[state=active]:bg-background data-[state=active]:text-grey-100 data-[state=active]:shadow "
                  value="nutrition">Nutrition</Tabs.Trigger>
                  <Tabs.Trigger
                  class="md:w-full data-[state=active]:font-bold  data-[state=active]:bg-background data-[state=active]:text-grey-100 data-[state=active]:shadow "
                  value="traceability">Tracability</Tabs.Trigger>
                  <Tabs.Trigger
                  class="md:w-full data-[state=active]:font-bold  data-[state=active]:bg-background data-[state=active]:text-grey-100 data-[state=active]:shadow "
                  value="Productvalue">Value</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content
                class="h-full mb-8  w-full gap-8"
                value="nutrition">
                <div class="flex flex-col w-full">
                    <ProductViewLocale title="Ingredients" frInput={product.ingredients_fr} enInput={product.ingredients_en} duInput={product.ingredients_nl} textarea />
                    <ProductViewLocale title="Allergens" frInput={product.allergens_fr} enInput={product.allergens_en} duInput={product.allergens_nl} textarea />
                    <ProductViewLocale title="Storage requirements" frInput={product.storage_requirement_fr} enInput={product.storage_requirement_en} duInput={product.storage_requirement_nl} textarea />
                    <ProductViewLocale title="Nutritional Information" frInput={product.nutritional_information_fr} enInput={product.nutritional_information_en} duInput={product.nutritional_information_nl} textarea />
                    <ProductViewLocale title="Nutritional claims" frInput={product.nutritional_claims_fr} enInput={product.nutritional_claims_en} duInput={product.nutritional_claims_nl} textarea />
                    <ProductViewLocale title="Health claims" frInput={product.health_claims_fr} enInput={product.health_claims_en} duInput={product.health_claims_nl} textarea />
                </div>
              
                </Tabs.Content>
                <Tabs.Content
                class="h-full mb-8  w-full  gap-8"
                value="traceability">
                <div class="flex flex-col w-full">
                    <ProductViewInput title="SKU" value={product.sku} />
                    </div>
                </Tabs.Content>
                <Tabs.Content
                class="h-full mb-8  w-full  gap-8"
                value="Productvalue">
                <div class="flex flex-col w-full">
                    <ProductViewInput title="Selling tax percentage" value={`${product.selling_tax_percentage}%`} />
                    <ProductViewInput title="Shop selling price vat incl (B2C)" value={`€${product.shop_selling_price_vat_incl_b2c}`} />
                    <ProductViewInput title="Ecommerce selling price vat excl (B2C)" value={`€${product.ecommerce_selling_price_vat_excl_b2c}`} />
                    <ProductViewInput title="Ecommerce selling price vat excl (B2B)" value={`€${product.ecommerce_selling_price_vat_excl_b2b}`} />

            </div>
            </Tabs.Content>
              </Tabs.Root>
        </div>
    </div>
</main>


<!-- card -->
<!-- <div class="product-images w-full bg-white rounded-lg shadow-lg p-6">
    <div class="card-header pb-4 mb-4 border-b border-gray-200">
        <h3 class="font-semibold text-lg text-gray-800">Images</h3>
    </div>
    <div class="card-content">
        <div class="product-images grid grid-cols-5 gap-4">
            <div class="col-span-3">
                <img src={globalImages.find(img => img.id === productImages[0])?.image}
                     alt={product.name}
                     class="w-full h-64 rounded-lg object-cover object-center">
            </div>
            <div class="col-span-2 grid grid-rows-2 gap-4 h-64">
                <img src={globalImages.find(img => img.id === productImages[0])?.image}
                     alt={product.name}
                     class="w-full h-full rounded-lg object-cover object-center">
                <img src={globalImages.find(img => img.id === productImages[0])?.image}
                     alt={product.name}
                     class="w-full h-full rounded-lg object-cover object-center">
            </div>
        </div>
    </div>
</div> -->