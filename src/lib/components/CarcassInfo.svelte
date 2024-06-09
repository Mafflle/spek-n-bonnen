<script lang="ts">
	import type { Carcass } from '$lib/stores/carcass.stores';
	import Separator from './ui/separator/separator.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import PhysicalInfo from './carcass-info/PhysicalInfo.svelte';
	import VendorInfo from './carcass-info/VendorInfo.svelte';
	import TraceabilityInfo from './carcass-info/TraceabilityInfo.svelte';
	import DestinationInfo from './carcass-info/DestinationInfo.svelte';
	import OriginInfo from './carcass-info/OriginInfo.svelte';

	export let carcass: Carcass;

	$: carcassInfo = carcass ? JSON.stringify(carcass) : 'Carcass is undefined';
</script>

<div class="w-full py-4">
	<h1 class="title text-2xl px-4 py-4">More information</h1>
	<div class="h-full info flex flex-col md:flex-row border-t border-t-grey-300">
		<div class="providers w-full md:w-1/2 px-6">
			<h2 class="providers-title uppercase text-1xl text-grey-200 py-4">Providers</h2>
			<div class="py-4 flex flex-col gap-4">
				<div class="flex justify-between">
					<div class="info text-grey-100">Manufacturer:</div>
					<div class="value text-left">{carcass.manufacturer.name}</div>
				</div>
				<div class="flex justify-between">
					<div class="info text-grey-100">Vendor:</div>
					<div class="value text-left flex justify-start">
						<p>{carcass.vendor.name}</p>
					</div>
				</div>
				<div class="flex justify-between">
					<div class="info text-grey-100">Brand:</div>
					<div class="value text-left flex justify-start">
						<p>{carcass.brand.name}</p>
					</div>
				</div>
			</div>
			<Separator data-separator-root />
			{#if carcass.certifications}
				<h2 class="certifications-title uppercase text-1xl text-grey-200 py-4 uppercase">
					certifications
				</h2>
				<div class="py-4 flex flex-col gap-4">
					<div class="flex justify-between">
						<div class="info text-grey-100">Certificate:</div>
						<div class="value text-left">Certificate of {carcass.certifications}</div>
					</div>
				</div>
				<Separator data-separator-root />
			{/if}

			<h2 class="finance-title uppercase text-1xl text-grey-200 py-4 uppercase">Finance</h2>
			<div class="py-4 flex flex-col gap-4">
				<div class="flex justify-between">
					<div class="info text-grey-100">Purchase Price:</div>
					<div class="value text-left">&#8364; {carcass.purchase_price}</div>
				</div>
			</div>
		</div>
		<div class="carcass-info w-full md:w-1/2 px-6">
			<div class="tabs w-full">
				<Tabs.Root value="physical" class="w-full">
					<Tabs.List
						class="bg-white oveflow-x-scroll flex flex-wrap md:flex-wrap-none pb-16 md:pb-1"
					>
						<Tabs.Trigger
							class="data-[state=active]:bg-background data-[state=active]:text-grey-100 data-[state=active]:shadow"
							value="physical">Physical information</Tabs.Trigger
						>
						<Tabs.Trigger
							class="data-[state=active]:bg-background data-[state=active]:text-grey-100 data-[state=active]:shadow"
							value="vendor">Vendor</Tabs.Trigger
						>
						<Tabs.Trigger
							class="data-[state=active]:bg-background data-[state=active]:text-grey-100 data-[state=active]:shadow"
							value="traceability">Traceability</Tabs.Trigger
						>
						<Tabs.Trigger
							class="data-[state=active]:bg-background data-[state=active]:text-grey-100 data-[state=active]:shadow"
							value="origin">Origin</Tabs.Trigger
						>
						<Tabs.Trigger
							class="data-[state=active]:bg-background data-[state=active]:text-grey-100 data-[state=active]:shadow"
							value="destination">Destination</Tabs.Trigger
						>
					</Tabs.List>
					<Separator data-separator-root class="hidden md:block" />
					<Tabs.Content value="physical" class="w-full">
						<PhysicalInfo
							weight={carcass.weight}
							coldWeight={carcass.cold_weight}
							fatScore={carcass.fat_score}
							sexCategory={carcass.sex_category}
							conformation={carcass.conformation}
						/>
					</Tabs.Content>
					<Tabs.Content value="vendor">
						<VendorInfo
							vendorCode={carcass.vendor_code}
							vendorItemName={carcass.vendor_item_name}
							vendorMoq={carcass.vendor_moq}
							vendorMoqUnit={carcass.vendor_moq_unit}
						/>
					</Tabs.Content>
					<Tabs.Content value="traceability">
						<TraceabilityInfo
							lotNumber={carcass.lot_number}
							abhdCode={carcass.lot_number}
							earTag={carcass.ear_tag}
							lairageNumber={carcass.lairage_number}
						/>
					</Tabs.Content>
					<Tabs.Content value="origin">
						<OriginInfo
							originAndTerrior={carcass.origin_and_terroir}
							countryOfOrigin={carcass.country_of_origin}
							farm={carcass.farm}
						/>
					</Tabs.Content>
					<Tabs.Content value="destination">
						<DestinationInfo
							slaughterHouse={carcass.slaughter_house}
							butcherShop={carcass.butcher_shop}
						/>
					</Tabs.Content>
				</Tabs.Root>
			</div>
		</div>
	</div>
</div>
