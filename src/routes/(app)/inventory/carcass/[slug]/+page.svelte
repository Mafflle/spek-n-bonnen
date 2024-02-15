<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { PageData } from '../$types';
	import * as Tabs from '$lib/components/ui/tabs';
	import type { CarcassType } from '$lib/stores';
	const allTabs = [
		{ label: 'Physical information', value: 'physical-info' },
		{ label: 'Traceability', value: 'traceability' }
	];

	export let data: PageData;
	let carcass: CarcassType = [];

	$: carcass = data.carcass;

	console.log(data);
</script>

<div class="flex flex-col w-full max-w-full">
	<section class="w-full border-b px-4 py-3">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<h2 class="text-[2em] tracking-[2] font-satoshi font-bold">Carcass details</h2>
			<sub class="text-[#6B6B6B] text-sm"> inventory / Carcass / Carcass details</sub>
		</div>
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
					<p>{carcass.manufacturer.name}</p>
					<p>{carcass.vendor.name}</p>
					<p>{carcass.brand.name}</p>
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
						<p>{carcass.certifications ?? 'Certificate of ABCD'}</p>
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
						<p>${carcass.purchase_price ?? '999.99'}</p>
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
									<p>{carcass.weight} kg</p>
									<p>{carcass.cold_weight} kg</p>
									<p>{carcass.sex_category}</p>
									<p>{carcass.fat_score}</p>
									<p>{carcass.conformation ?? '_________'}</p>
								</div>
							</div>
						</div>
					</Tabs.Content>
					<!-- Physical info -->

					<!-- Vendor info -->

					<!-- Vendor info -->

					<!-- Traceability -->
					<Tabs.Content class="px-4 h-full mb-8 md:pl-5 pr-16 py-5 w-full " value="traceability">
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
									<p>{carcass.lot_number}</p>
									<p>{carcass.ahdb_code}</p>
									<p>{carcass.ear_tag}</p>
									<p>{carcass.lairage_number ?? '_______'}</p>
									<p>{carcass.vendor.name ?? '_______'}</p>
									<p>{carcass.vendor_code ?? '_________'}</p>
									<p>{carcass.vendor_moq ?? '_________'}</p>
									<p>{carcass.vendor_moq_unit ?? '_________'}</p>
									<p>{carcass.vendor_item_name ?? '_________'}</p>
									<p>{carcass.slaughter_house.name ?? '_________'}</p>
									<p>{carcass.origin_and_terroir ?? '_________'}</p>
									<p>{carcass.country_of_origin ?? '_________'}</p>
									<p>{carcass.farm.name ?? '_________'}</p>
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
