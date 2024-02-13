<script lang="ts">
	import { Carcasses, type CarcassType } from '$lib/stores/carcass.stores';
	import Carcass from '$lib/components/Carcass.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import Modal from '$lib/components/Modal.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { goto } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	export let data;
	let carcasses = [];
	const allTabs = [
		{ label: 'Physical information', value: 'physical-info' },
		{ label: 'Traceability', value: 'traceability' }
	];
	let showCarcassInfo: boolean = false;
	let currCarcass: CarcassType | null;

	Carcasses.set(data.carcasses.results);

	const showInfo = (carcass: CarcassType) => {
		currCarcass = carcass;
		showCarcassInfo = true;
	};
	let searching = false;

	const searchCarcass: SubmitFunction = ({ formData }) => {
		console.log('searching', formData);
		searching = true;
		return async ({ result, update, error }) => {
			if (error) {
				console.error('Error occurred during search:', error);

				return;
			}

			console.log('search', result);
			console.log('search result', result.data.carcasses.results);
			carcasses = result.data.carcasses.results; // Update carcasses array
			Carcasses.set(carcasses);
		};
	};

	let form: HTMLFormElement;

	const submitSearch = () => {
		form.requestSubmit();
	};
</script>

<svelte:head>
	<title>Carcass - Spek-N-Boonen</title>
</svelte:head>
<div class="">
	<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<h2 class="text-[2em] tracking-[2] font-satoshi font-bold">Carcass</h2>
			<sub class="text-[#6B6B6B] text-sm"> Providers / Carcass</sub>
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
				<form
					method="post"
					action="?/search"
					use:enhance={searchCarcass}
					bind:this={form}
					name="search"
					id="search-carcass"
					class="w-full"
				>
					<input type="submit" class="hidden" value="submit" />
					<input
						type="text"
						placeholder="Search for carcass..."
						class="py-2 flex-auto outline-none w-full"
						name="search"
						on:input={() => {
							submitSearch();
						}}
					/>
				</form>
			</div>

			<a
				href="carcass/manage"
				class="px-3 py-2 bg-primary-100 text-sm text-white rounded-md flex items-center gap-1"
			>
				<img src="/icons/plus.svg" alt="Plus icon to represent adding" />
				<span class="hidden sm:block">Add carcass</span>
			</a>
		</div>
	</div>
</div>

{#if $Carcasses.length != 0}
	<div class="border rounded-xl">
		<table class="table">
			<thead>
				<tr class="">
					<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">ID</th>
					<th class="bg-[#F9F9F9]">Vendor</th>
					<th class="bg-[#F9F9F9]">Weight(kg)</th>
					<th class="bg-[#F9F9F9]">Purchase price($)</th>
					<th class="bg-[#F9F9F9]">Fat Score</th>
					<th class="bg-[#F9F9F9]">Date Recieved</th>
					<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></th>
				</tr>
			</thead>

			<tbody>
				{#each $Carcasses as carcass (carcass?.id)}
					{#if carcass}
						<Carcass
							{carcass}
							on:view={(e) => showInfo(e.detail.carcass)}
							on:edit={(e) => goto(`carcass/manage?editing=${e.detail.id}`)}
						/>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
{/if}

{#if $Carcasses.length === 0 && !searching}
	<!-- Your existing empty state display -->
	<div class="empty h-full w-full flex justify-center items-center">
		<div class="empty-indicator flex flex-col justify-center items-center gap-5 w-[277px]">
			<div class="icon">
				<img src="/icons/empty-Illustration.svg" alt="empty illustration " />
			</div>
			<div class="content">
				<div class="text flex flex-col gap-3 justify-center items-center text-grey-300">
					<h3 class="title text-3xl font-medium tracking-[-0.64px]">No carcass added</h3>
					<div class="info text-center text-sm font-medium leading-5 tracking-[-0.13px]">
						You currently don’t have any carcass stored in your inventory, click the button below to
						add one
					</div>
				</div>
			</div>
			<div class="button">
				<a
					href="carcass/manage"
					class="px-3 py-2 bg-primary-100 text-sm text-white rounded-md flex items-center gap-1"
				>
					<img src="/icons/plus.svg" alt="Plus icon to represent adding" />
					<span class="hidden sm:block">Add carcass</span>
				</a>
			</div>
		</div>
	</div>
{:else if $Carcasses.length === 0 && searching}
	<div class="empty flex justify-center items-center py-5">
		<div class="empty-indicator flex flex-col justify-center items-center gap-5 w-[277px]">
			<!-- Customize this message to indicate no results were found -->
			<div class="content">
				<div class="text flex flex-col gap-3 justify-center items-center text-grey-300">
					<h3 class="title text-3xl font-medium tracking-[-0.64px]">No carcasses found</h3>
					<div class="info text-center text-sm font-medium leading-5 tracking-[-0.13px]">
						Your search did not match any carcasses. Please try again with different keywords.
					</div>
				</div>
			</div>
		</div>
	</div>
{:else if currCarcass}
	<Modal
		on:close={() => {
			showCarcassInfo = false;
			currCarcass = null;
		}}
		showModal={showCarcassInfo}
	>
		<div slot="modal-content" class="flex flex-col w-full max-w-4xl">
			<section class="w-full border-b px-4 py-3">
				<h3 class="font-satoshi font-medium text-lg">More information</h3>
			</section>
			<section
				class="  flex flex-col md:flex-row md:justify-between items-start md:h-[450px] justify-center text-sm w-full"
			>
				<!-- Providers -->
				<section class="flex-auto py-5 h-full overflow-y-scroll no-scrollbar w-full min-w-[360px]">
					<div class=" sticky px-5 top-0 w-full bg-white">
						<h3 class="text-sm font-satoshi text-grey-200 capitalize mb-5">PROVIDERS</h3>
					</div>
					<div class="mb-8 md:pl-5 pr-20 flex justify-between font-satoshi text-sm">
						<div class="labels">
							<p class="block text-grey-200">Manufacturer:</p>

							<p class="block text-grey-200 text-sm">Vendor:</p>

							<p class="text-grey-200">Butcher shop:</p>
						</div>
						<div class="labels">
							<p>{currCarcass.manufacturer.name}</p>
							<p>{currCarcass.vendor.name}</p>
							<p>{currCarcass.brand.name}</p>
						</div>
					</div>
					<Separator orientation="horizontal" class="" />
					<div class="md:pl-5 pr-20 py-4">
						<h3 class="text-sm font-satoshi text-grey-200 capitalize mb-5">CERTIFICATION</h3>
						<div class=" flex justify-between font-satoshi text-sm">
							<div class="labels">
								<p class="block text-grey-200">Certificate:</p>
							</div>
							<div class="labels">
								<p>{currCarcass.certifications ?? 'Certificate of ABCD'}</p>
							</div>
						</div>
					</div>
					<Separator orientation="horizontal" class="" />
					<div class="py-4 pl-5 pr-20">
						<h3 class="text-sm font-satoshi text-grey-200 capitalize mb-5">FINANCE</h3>

						<div class=" flex justify-between font-satoshi text-sm">
							<div class="labels">
								<p class="block text-grey-200">Purchase price:</p>
							</div>
							<div class="labels">
								<p>${currCarcass.purchase_price ?? '999.99'}</p>
							</div>
						</div>
					</div>
				</section>
				<!-- Providers -->

				<!-- Separator -->
				<Separator orientation="vertical" class="" />
				<!-- Separator -->

				<!-- More Details -->
				<section class=" flex-auto flex flex-col items-start h-full w-full min-w-[450px] py-5">
					<!-- Tabs -->
					<Tabs.Root
						value="physical-info"
						class="relative w-full h-full px-4 overflow-y-scroll no-scrollbar"
					>
						<!-- Tabs trigger -->
						<section class="md:sticky top-0 w-full bg-white overflow-x-scroll no-scrollbar z-10">
							<Tabs.List class=" bg-white border-b rounded-none px-1  w-full ">
								{#each allTabs as tab}
									<Tabs.Trigger
										class="w-full px-1 data-[state=active]:font-bold data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary-red data-[state=active]:rounded-none "
										value={tab.value}>{tab.label}</Tabs.Trigger
									>
								{/each}
							</Tabs.List>
						</section>
						<!-- Tabs trigger -->

						<section>
							<!-- Physical info -->
							<Tabs.Content class=" h-full mb-8  md:pl-5 pr-16 py-5 w-full" value="physical-info">
								<div class="flex flex-col gap-[1.28rem]">
									<div class="mb-8 flex justify-between font-satoshi text-sm">
										<div class="labels">
											<p class="block text-grey-200">Weight:</p>

											<p class="block text-grey-200 text-sm">Cold weight:</p>

											<p class="text-grey-200">Sex category:</p>
											<p class="text-grey-200">Fat score:</p>
											<p class="text-grey-200">Conformation:</p>
										</div>
										<div class="labels">
											<p>{currCarcass.weight} kg</p>
											<p>{currCarcass.cold_weight} kg</p>
											<p>{currCarcass.sex_category}</p>
											<p>{currCarcass.fat_score}</p>
											<p>{currCarcass.conformation ?? '_________'}</p>
										</div>
									</div>
								</div>
							</Tabs.Content>
							<!-- Physical info -->

							<!-- Vendor info -->

							<!-- Vendor info -->

							<!-- Traceability -->
							<Tabs.Content
								class="px-4 h-full mb-8 md:pl-5 pr-16 py-5 w-full "
								value="traceability"
							>
								<div class="flex flex-col gap-[1.28rem]">
									<div class="mb-8 flex justify-between font-satoshi text-sm">
										<div class="labels">
											<p class="block text-grey-200">Lot number :</p>

											<p class="block text-grey-200 text-sm">ABHD number :</p>

											<p class="text-grey-200">Ear tag :</p>
											<p class="text-grey-200">Lairage number :</p>
											<p class="text-grey-200">Vendor :</p>
											<p class="text-grey-200">Vendor code :</p>
											<p class="text-grey-200">Vendor MOQ :</p>
											<p class="text-grey-200">Vendor MOQ unit :</p>
											<p class="text-grey-200">Vendor item name :</p>
											<p class="text-grey-200">Slaughter house :</p>
											<p class="text-grey-200">Origin and terrior :</p>
											<p class="text-grey-200">Country of origin :</p>
											<p class="text-grey-200">Farm :</p>
										</div>
										<div class="labels">
											<p>{currCarcass.lot_number}</p>
											<p>{currCarcass.ahdb_code}</p>
											<p>{currCarcass.ear_tag}</p>
											<p>{currCarcass.lairage_number ?? '_______'}</p>
											<p>{currCarcass.vendor.name ?? '_______'}</p>
											<p>{currCarcass.vendor_code ?? '_________'}</p>
											<p>{currCarcass.vendor_moq ?? '_________'}</p>
											<p>{currCarcass.vendor_moq_unit ?? '_________'}</p>
											<p>{currCarcass.vendor_item_name ?? '_________'}</p>
											<p>{currCarcass.slaughter_house.name ?? '_________'}</p>
											<p>{currCarcass.origin_and_terroir ?? '_________'}</p>
											<p>{currCarcass.country_of_origin ?? '_________'}</p>
											<p>{currCarcass.farm.name ?? '_________'}</p>
										</div>
									</div>
								</div>
							</Tabs.Content>
							<!-- Traceability -->

							<!-- <div class="w-full self flex items-center justify-between mt-4 px-4">
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
						</div> -->
						</section>
					</Tabs.Root>
					<!-- Tabs -->
				</section>
				<!-- More Details -->
			</section>
		</div>
	</Modal>
{/if}
