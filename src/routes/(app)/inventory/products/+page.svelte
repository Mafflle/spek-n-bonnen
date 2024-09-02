<script lang="ts">
	import { enhance } from '$app/forms';
	import InfoModal from '$lib/components/InfoModal.svelte';
	import { productsStore } from '$lib/stores/product.stores.js';
	import CustomTable from '$lib/components/customs/CustomTable.svelte';
	import ProductRow from '$lib/components/customs/ProductRow.svelte';

	export let data;

	productsStore.set(data.products.results);

	$: console.log($productsStore);

	let tableProps = {
		columns: [
			{ name: 'Featured image' },
			{ name: 'Product name' },
			{ name: 'Product type' },
			{ name: 'Sku' }
		],
		RowComponent: ProductRow
	};
</script>
<svelte:head>
    <title>	Products|| Spek-n-Bonnen ERP</title>
</svelte:head>
{#if $productsStore.length > 0}
	<div class="">
		<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
			<div class="headers flex flex-col items-start gap-[0.25rem]">
				<h2 class="text-[2em] tracking-[2] font-satoshi font-bold">Products</h2>
				<sub class="text-[#6B6B6B] text-sm"> Inventory / Products</sub>
			</div>
			<div class="filter-buttons flex items-start gap-2 sm:gap-5 w-full justify-between">
				<div
					class="flex items-center sm:w-[24em] border gap-2 rounded-md border-[#D9D9D9] text-[#232222] px-2"
				>
					<span>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
								stroke="#A9A9A9"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M21 20.9999L16.65 16.6499"
								stroke="#A9A9A9"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
					<form method="post" action="?/search" name="search" id="search-carcass" class="w-full">
						<input type="submit" class="hidden" value="submit" />
						<input
							type="text"
							placeholder="Search for products..."
							class="py-2 flex-auto outline-none w-full"
							name="search"
						/>
					</form>
				</div>

				<a
					href="products/manage/product"
					class="px-3 py-2 bg-primary-100 text-sm text-white rounded-md flex items-center gap-1"
				>
					<img src="/icons/plus.svg" alt="Plus icon to represent adding" />
					<span class="hidden sm:block">Add product</span>
				</a>
			</div>
		</div>
		<div class="w-full">
			<CustomTable createUtilityColumn={true} props={tableProps} rowsData={$productsStore} />
		</div>
	</div>
{:else}
	<div class="empty h-full w-full flex justify-center items-center">
		<div class="empty-indicator flex flex-col justify-center items-center gap-5 w-[277px]">
			<div class="icon">
				<img src="/icons/empty-Illustration.svg" alt="empty illustration " />
			</div>
			<div class="content">
				<div class="text flex flex-col gap-3 justify-center items-center text-grey-300">
					<h3 class="title text-3xl font-medium tracking-[-0.64px]">No Product added</h3>
					<div class="info text-center text-sm font-medium leading-5 tracking-[-0.13px]">
						You currently don’t have any product saved, click the button below to create one
					</div>
				</div>
			</div>
			<div class="button">
				<a
					href="products/manage/product"
					class=" px-2.5 py-2.5 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
			hover:bg-[#C7453C]
			focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/plus.svg" alt="user-plus" />
					</div>
					<p class="text-white text-sm font-bold">Add product</p>
				</a>
			</div>
		</div>
	</div>
{/if}
<InfoModal />
