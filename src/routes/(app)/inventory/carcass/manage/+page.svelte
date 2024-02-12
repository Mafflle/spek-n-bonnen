<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import PageLoader from '$lib/components/PageLoader.svelte';
	import Selector from '$lib/components/Selector.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Carcasses } from '$lib/stores/carcass.stores';
	import { showToast, type CarcassErrors } from '$lib/utils.js';
	import type { SubmitFunction } from '@sveltejs/kit';

	import { slide } from 'svelte/transition';

	export let data;

	const { brands, slaughterHouses, vendors, butcherShops, farms, manufacturers, carcassToEdit } =
		data;

	console.log(carcassToEdit);

	let currCarcassId = $page.url.searchParams.get('editing');
	let validationErrors: CarcassErrors;
	const allTabs = ['physical-info', 'vendor', 'traceability', 'origin'];
	let currentTab: string = 'physical-info';
	let currentTabInfo;

	let loading: boolean = false;
	let today = new Date();
	let dd = today.getDate();
	let mm = today.getMonth() + 1;
	let year = today.getFullYear();

	if (dd < 10) {
		dd = '0' + dd;
	}

	if (mm < 10) {
		mm = '0' + mm;
	}
	let maxDate = year + '-' + mm + '-' + dd;

	const switchTabs = (direction: string) => {
		const currTab = allTabs.findIndex((item) => item === currentTab);
		if (direction === 'previous') {
			return (currentTab = allTabs[currTab - 1]);
		} else if (direction === 'next') {
			return (currentTab = allTabs[currTab + 1]);
		}
	};

	const manageCarcass: SubmitFunction = async () => {
		loading = true;
		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					const newCarcass = result.data.newCarcass;
					showToast('Carcass added successfully', 'success');
					Carcasses.update((items) => [newCarcass, ...items]);
					await goto('/inventory/carcass');
				} else if (result.status === 400) {
					validationErrors = result.data.errors;

					console.log(validationErrors);
				}
			} finally {
				await update({ reset: false });
				loading = false;
			}
		};
	};
	$: {
		if (browser) {
			let tabs = currentTabInfo?.children[1].children;
			console.log(tabs);

			if (tabs) {
				for (let i = 0; i < tabs.length; i++) {
					if (tabs[i].attributes[1]?.value === currentTab) {
						const requiredInputs = tabs[i].querySelectorAll('input[required]');
						console.log(requiredInputs);
					}
				}
			}
		}
	}
</script>

<svelte:head>
	<title>Manage carcass - Spek-N-Boonen</title>
</svelte:head>

{#if loading}
	<PageLoader />
{/if}
<div class="">
	<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<h2 class="text-3xl font-semibold">
				{currCarcassId ? `Edit carcass #${currCarcassId}` : 'Add carcass'}
			</h2>
			<sub class="text-[#6B6B6B] text-sm"> Carcass / manage</sub>
		</div>
	</div>
	<Separator class="my-8 md:block hidden" />
	<form action="?/manage-carcass" method="post" use:enhance={manageCarcass} class="w-full">
		<section class="w-full my-5 flex items-center justify-end">
			<button
				disabled={loading}
				type="submit"
				class=" px-3 py-2 bg-primary-100 text-sm text-white rounded-md flex items-center gap-1 max-xsm:hidden"
			>
				{#if loading}
					<iconify-icon icon="line-md:loading-twotone-loop" width="20"></iconify-icon>
				{:else}
					<img src="/icons/plus.svg" alt="Plus icon to represent adding" />
					<span> Add carcass</span>
				{/if}
			</button>
		</section>
		<section
			class="  flex flex-col md:flex-row md:justify-between items-start md:h-[450px] justify-center text-sm w-full lg:gap-10"
		>
			<!-- Providers -->
			<section class="flex-auto px-2 h-full overflow-y-scroll no-scrollbar w-full">
				<div class="pb-3 sticky top-0 w-full bg-white px-2">
					<h3 class="text-sm font-satoshi text-grey-200 capitalize mb-5">PROVIDERS</h3>
				</div>
				<div class="mb-8 flex flex-col gap-[1.28rem]">
					<div class="manufacturer">
						<label for="manufacturer" class="block mb-2 text-sm">Manufacturer</label>
						<Selector
							name="manufacturer"
							placeholder="Select manufacturer "
							options={manufacturers.results}
							token={data.access}
							endpoint="manage"
							searchEndpoint="api/inventory/manufacturers"
						/>
						{#if validationErrors?.manufacturer_id}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]"
								>{validationErrors.manufacturer_id}</sub
							>
						{/if}
					</div>

					<div>
						<label for="brand" class="block mb-2 text-sm">Brand</label>
						<Selector
							token={data.access}
							endpoint="manage"
							searchEndpoint="api/inventory/brands"
							name="brand"
							placeholder="Select brand "
							options={brands.results}
						/>
						{#if validationErrors?.brand_id}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.brand_id}</sub
							>
						{/if}
					</div>

					<div class="butcher-shop">
						<label for="butcher_shop" class="block mb-2 text-sm">Butcher shop</label>
						<Selector
							token={data.access}
							endpoint="manage"
							searchEndpoint="api/inventory/butcher_shops"
							name="butcher_shop"
							placeholder="Select butcher shop "
							options={butcherShops.results}
						/>
						{#if validationErrors?.butcher_shop_id}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]"
								>{validationErrors.butcher_shop_id}</sub
							>
						{/if}
					</div>
				</div>
				<div class="mb-8">
					<h3 class="text-sm font-satoshi text-grey-200 capitalize mb-5">CERTIFICATIONS</h3>
					<div class=" flex flex-col gap-[1.28rem] w-full">
						<div class="purchase flex flex-col gap-2 items-start">
							<label for="certifications" class="block mb-2 text-sm">Certifications</label>
							<input
								type="number"
								name="certifications"
								id="certifications"
								placeholder="Enter certification (optional)"
								class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
							/>
							{#if validationErrors?.purchase_price}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]"
									>{validationErrors.purchase_price}</sub
								>
							{/if}
						</div>
					</div>
				</div>
				<div class="mb-8">
					<h3 class="text-sm font-satoshi text-grey-200 capitalize mb-5">FINANCE</h3>
					<div class=" flex flex-col gap-[1.28rem] w-full">
						<div class="purchase flex flex-col gap-2 items-start">
							<label for="purchase-price" class="block mb-2 text-sm">Purchase price</label>
							<input
								type="text"
								name="purchase-price"
								id="purchase-price"
								placeholder="Enter purchase price eg - ($100)"
								class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
							/>
							{#if validationErrors?.purchase_price}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]"
									>{validationErrors.purchase_price}</sub
								>
							{/if}
						</div>
					</div>
				</div>
			</section>
			<!-- Providers -->

			<!-- Separator -->
			<Separator orientation="vertical" class="" />
			<!-- Separator -->

			<!-- More Details -->
			<section class="md:px-2 flex-auto flex flex-col items-start h-full w-full">
				<h3 class="text-sm font-satoshi text-grey-200 capitalize mb-5">MORE DETAILS</h3>

				<!-- Tabs -->
				<Tabs.Root
					bind:value={currentTab}
					bind:el={currentTabInfo}
					class="relative w-full h-full overflow-y-scroll no-scrollbar"
				>
					<!-- Tabs trigger -->
					<section
						class="md:sticky top-0 md:px-1 py-4 w-full bg-white overflow-x-scroll no-scrollbar z-10"
					>
						<Tabs.List class=" bg-[#F7F7F7] py-2.5 px-1 ">
							<Tabs.Trigger class="md:w-full data-[state=active]:font-bold  " value="physical-info"
								>Physical information</Tabs.Trigger
							>
							<Tabs.Trigger class="w-full data-[state=active]:font-bold  " value="vendor"
								>Vendor</Tabs.Trigger
							>
							<Tabs.Trigger class="w-full data-[state=active]:font-bold  " value="traceability"
								>Traceability</Tabs.Trigger
							>
							<Tabs.Trigger class="w-full data-[state=active]:font-bold  " value="origin"
								>Origin</Tabs.Trigger
							>
						</Tabs.List>
					</section>
					<!-- Tabs trigger -->

					<section>
						<!-- Physical info -->
						<Tabs.Content class="px-4 h-full mb-8  w-full" value="physical-info">
							<div class="flex flex-col gap-[1.28rem]">
								<div class="weight flex flex-col gap-2 items-start">
									<label for="weight" class="block mb-2 text-sm">Weight</label>
									<input
										required
										type="number"
										name="weight"
										id="weight"
										placeholder="Enter weight eg - (99kg)"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									{#if validationErrors?.weight}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.weight}</sub
										>
									{/if}
								</div>

								<div class="w-full flex flex-col gap-2 items-start">
									<label for="cold-weight" class="block mb-2 text-sm">Cold weight</label>
									<input
										required
										type="number"
										name="cold-weight"
										id="cold-weight"
										placeholder="Enter cold weight eg - (99kg)"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									{#if validationErrors?.cold_weight}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.cold_weight}</sub
										>
									{/if}
								</div>

								<div class="flex flex-col gap-2 items-start">
									<label for="sex-category" class="block mb-2 text-sm">Sex category</label>
									<Selector
										required={true}
										name="sex-category"
										placeholder="Select sex category"
										options={[
											{ value: 'A', label: 'Young bull' },
											{ value: 'B', label: 'Bull' },
											{ value: 'C', label: 'Steer' },
											{ value: 'E', label: 'Heifer' }
										]}
									/>
									{#if validationErrors?.sex_category}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.sex_category}</sub
										>
									{/if}
								</div>
								<div class="flex flex-col gap-2 items-start w-full">
									<label for="fat-score" class="block mb-2 text-sm">Fat score</label>
									<Selector
										required={true}
										name="fat-score"
										placeholder="Select fat score"
										options={[
											{ value: '1', label: '10%' },
											{ value: '2', label: '20%' },
											{ value: '3', label: '30%' },
											{ value: '4', label: '40%' },
											{ value: '5', label: '50%' },
											{ value: '6', label: '60%' }
										]}
									/>
									{#if validationErrors?.fat_score}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.fat_score}</sub
										>
									{/if}
								</div>

								<div class="conformation flex flex-col gap-2 items-start">
									<label for="conformation" class="block mb-2 text-sm">Conformation</label>
									<Selector
										required={true}
										name="conformation"
										placeholder="Select conformation"
										options={[
											{ value: 'S', label: 'CONF-S' },
											{ value: 'E', label: 'CONF-E' },
											{ value: 'U', label: 'CONF-U' },
											{ value: 'R', label: 'CONF-R' },
											{ value: 'O', label: 'CONF-O' },
											{ value: 'P', label: 'CONF-P' }
										]}
									/>

									{#if validationErrors?.conformation}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.conformation}</sub
										>
									{/if}
								</div>
							</div>
						</Tabs.Content>
						<!-- Physical info -->

						<!-- Vendor info -->
						<Tabs.Content class="px-4 h-full mb-8 w-full " value="vendor">
							<div class="flex flex-col gap-[1.28rem]">
								<div class="flex flex-col gap-2 items-start">
									<label for="vendor" class="block mb-2 text-sm">Vendor</label>
									<Selector
										required={true}
										token={data.access}
										endpoint="manage"
										searchEndpoint="api/inventory/vendors"
										name="vendor"
										placeholder="Select vendor "
										options={vendors.results}
									/>
									{#if validationErrors?.vendor_id}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.vendor_id}</sub
										>
									{/if}
								</div>
								<div class="vendor-code flex flex-col gap-2 items-start">
									<label for="vendor-code" class="block mb-2 text-sm">Vendor code</label>
									<input
										required
										type="text"
										name="vendor-code"
										id="vendor-code"
										placeholder="Enter vendor code"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									{#if validationErrors?.vendor_code}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.vendor_code}</sub
										>
									{/if}
								</div>

								<div class="w-full flex flex-col gap-2 items-start">
									<label for="vendor-moq" class="block mb-2 text-sm">Vendor MOQ</label>
									<input
										required
										type="number"
										name="vendor-moq"
										id="vendor-moq"
										placeholder="Enter moq"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									{#if validationErrors?.vendor_moq}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.vendor_moq}</sub
										>
									{/if}
								</div>

								<div class="flex flex-col gap-2 items-start">
									<label for="vendor-moq-unit" class="block mb-2 text-sm">Vendor MOQ unit</label>
									<input
										required
										type="text"
										name="vendor-moq-unit"
										id="vendor-moq-unit "
										placeholder="Enter vendor's moq"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									{#if validationErrors?.vendor_moq_unit}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.vendor_moq_unit}</sub
										>
									{/if}
								</div>
								<div class="flex flex-col gap-2 items-start">
									<label for="vendor-item-name" class="block mb-2 text-sm">Vendor item name</label>
									<input
										required
										type="text"
										name="vendor-item-name"
										id="vendor-item-name"
										placeholder="Enter vendor item name"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									{#if validationErrors?.vendor_item_name}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.vendor_item_name}</sub
										>
									{/if}
								</div>
							</div>
						</Tabs.Content>
						<!-- Vendor info -->

						<!-- Traceability -->
						<Tabs.Content class="px-4 h-full mb-8  w-full " value="traceability">
							<div class="flex flex-col gap-[1.28rem]">
								<div class="lot-number flex flex-col gap-2 items-start">
									<label for="lot-number" class="block mb-2 text-sm">Lot number</label>
									<input
										required
										type="text"
										name="lot-number"
										id="lot-number"
										placeholder="Enter lot number"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									{#if validationErrors?.lot_number}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.lot_number}</sub
										>
									{/if}
								</div>

								<div class="w-full flex flex-col gap-2 items-start">
									<label for="carcass_number" class="block mb-2 text-sm">Carcass number</label>
									<input
										required
										type="number"
										name="carcass_number"
										id="carcass_number"
										placeholder="Enter carcass number"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									{#if validationErrors?.carcass_number}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.carcass_number}</sub
										>
									{/if}
								</div>
								<div class="w-full flex flex-col gap-2 items-start">
									<label for="abhd-number" class="block mb-2 text-sm">ABHD number</label>
									<input
										required
										type="text"
										name="abhd-number"
										id="abhd-number"
										placeholder="Enter abhd number"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									{#if validationErrors?.ahdb_code}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.ahdb_code}</sub
										>
									{/if}
								</div>

								<div class="flex flex-col gap-2 items-start">
									<label for="ear-tag" class="block mb-2 text-sm">Ear tag</label>
									<input
										required
										type="text"
										name="ear-tag"
										id="ear-tag"
										placeholder="Enter ear tag"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									{#if validationErrors?.ear_tag}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.ear_tag}</sub
										>
									{/if}
								</div>
								<div class="flex flex-col gap-2 items-start">
									<label for="slaughter_house" class="block mb-2 text-sm">Slaughter house</label>
									<Selector
										required={true}
										token={data.access}
										endpoint="manage"
										searchEndpoint="api/inventory/slaughter_houses"
										name="slaughter_house"
										placeholder="Select slaughter house "
										options={slaughterHouses.results}
									/>
									{#if validationErrors?.slaughter_house_id}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.slaughter_house_id}</sub
										>
									{/if}
								</div>
								<div class="flex flex-col gap-2 items-start">
									<label for="date_of_slaughter" class="block mb-2 text-sm"
										>Date of slaughter
									</label>
									<input
										required
										type="date"
										max={maxDate}
										name="date_of_slaughter"
										id="date_of_slaughter"
										placeholder="Enter slaughter date"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									{#if validationErrors?.date_of_slaughter}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.date_of_slaughter}</sub
										>
									{/if}
								</div>

								<div class="flex flex-col gap-2 items-start">
									<label for="date_received" class="block mb-2 text-sm">Date received </label>
									<input
										required
										type="date"
										name="date_received"
										id="date_received"
										max={maxDate}
										placeholder="Enter date received"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									{#if validationErrors?.date_received}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.date_received}</sub
										>
									{/if}
								</div>

								<div class="flex flex-col gap-2 items-start">
									<label for="lairage-number" class="block mb-2 text-sm">Lairage number</label>
									<input
										required
										type="number"
										name="lairage-number"
										id="lairage-number"
										placeholder="Enter lairage number (optional)"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									{#if validationErrors?.lairage_number}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.lairage_number}</sub
										>
									{/if}
								</div>
							</div>
						</Tabs.Content>
						<!-- Traceability -->

						<!-- Origin -->
						<Tabs.Content class="px-4 h-full mb-8  w-full " value="origin">
							<div class=" flex flex-col gap-[1.28rem] w-full">
								<div class="flex flex-col gap-2 items-start">
									<label for="origin-and-terrior" class="block mb-2 text-sm"
										>Origin and terrior</label
									>
									<input
										required
										type="text"
										name="origin-and-terrior"
										id="origin-and-terrior"
										placeholder="Enter origin and terrior"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									{#if validationErrors?.origin_and_terroir}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.origin_and_terroir}</sub
										>
									{/if}
								</div>

								<div class="w-full flex flex-col gap-2 items-start">
									<label for="country" class="block mb-2 text-sm">Country of origin</label>
									<input
										required
										type="text"
										name="country"
										id="country"
										placeholder="Enter country of origin"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									{#if validationErrors?.country_of_origin}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.country_of_origin}</sub
										>
									{/if}
								</div>

								<div class="w-full flex flex-col gap-2 items-start">
									<label for="farm" class="block mb-2 text-sm">Farm</label>
									<Selector
										required
										token={data.access}
										endpoint="manage"
										searchEndpoint="api/inventory/farms"
										name="farm"
										placeholder="Select farm "
										options={farms.results}
									/>
									<!-- <input
										type="text"
										name="farm "
										id="farm "
										placeholder="Enter farm name"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/> -->
									{#if validationErrors?.farm_id}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.farm_id}</sub
										>
									{/if}
								</div>
								<!-- <div>
									<label for="slaughter_house" class="block mb-2 text-sm">Slaughter house</label>
									<Selector
										token={data.access}
										endpoint="manage"
										searchEndpoint="api/inventory/slaughter_houses"
										name="slaughter_house"
										placeholder="Select slaughter house "
										options={slaughterHouses.results}
									/>
									{#if validationErrors?.slaughter_house_id}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.slaughter_house_id}</sub
								>
							{/if}
								</div> -->
							</div>
						</Tabs.Content>
						<!-- Origin -->

						<div class="w-full self flex items-center justify-between mt-4 px-4">
							{#if allTabs.indexOf(currentTab) > 0}
								<Button
									on:click={() => switchTabs('previous')}
									variant="secondary"
									class=" flex gap-1 items-center hover:bg-primary-50 hover:text-white "
									><iconify-icon rotate="180deg" icon="grommet-icons:form-next"></iconify-icon>
									<span class="hidden md:block">Previous </span>
								</Button>
							{/if}
							{#if allTabs.indexOf(currentTab) + 1 < allTabs.length}
								<Button
									on:click={() => switchTabs('next')}
									variant="secondary"
									class=" flex gap-1  items-center hover:bg-primary-50 hover:text-white "
								>
									<span class="hidden md:block">Next </span>
									<iconify-icon icon="grommet-icons:form-next"></iconify-icon></Button
								>
							{/if}
						</div>
					</section>
				</Tabs.Root>
				<!-- Tabs -->
			</section>
			<!-- More Details -->
		</section>
	</form>
</div>
