<script lang="ts">
	import { enhance } from '$app/forms';
	import Product from '$lib/components/Product.svelte';
</script>

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
				href="products/manage"
				class="px-3 py-2 bg-primary-100 text-sm text-white rounded-md flex items-center gap-1"
			>
				<img src="/icons/plus.svg" alt="Plus icon to represent adding" />
				<span class="hidden sm:block">Add product</span>
			</a>
		</div>
	</div>
</div>
<div class="border rounded-xl">
	<table class="table">
		<thead>
			<tr class="">
				<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">Action shot</th>
				<th class="bg-[#f9f9f9]">Item name</th>
				<th class="bg-[#F9F9F9]">Weight(kg)</th>
				<th class="bg-[#F9F9F9]"> Quantity</th>
				<th class="bg-[#F9F9F9]">Status</th>
				<th class="bg-[#F9F9F9]">E-commerce selling price</th>
				<th class="bg-[#F9F9F9]">SKU</th>
				<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></th>
			</tr>
		</thead>

		<!-- <tbody>
				{#each $Carcasses as carcass (carcass?.id)}
					{#if carcass}
						<Product
							{carcass}
							on:view={(e) => showInfo(e.detail.carcass)}
							on:edit={(e) => goto(`carcass/manage?editing=${e.detail.id}`)}
						/>
					{/if}
				{/each}
			</tbody> -->
	</table>
</div>
