<script lang="ts">
    import type { Product } from "$lib/stores/product.stores";

    export let data;
    let product: Product = data.product;
    let globalImages = data.images.results;
    let productImages = product.images;
    console.log(data);
</script>

<main class="relative">
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
        <div class="w-1/2  h-auto">
            <div class="product-images w-full bg-white rounded-lg shadow-lg p-6">
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
        </div>
        <div class="w-1/2 bg-white rounded-lg shadow-lg p-6 h-auto">
            <!-- Content for the right box -->
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