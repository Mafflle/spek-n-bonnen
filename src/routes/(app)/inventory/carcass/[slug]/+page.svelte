<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { PageData } from '../$types';
	import * as Tabs from '$lib/components/ui/tabs';
	import type { CarcassType, Primal } from '$lib/stores';
	import Modal from '$lib/components/Modal.svelte';
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import Selector from '$lib/components/Selector.svelte';
	import { showToast } from '$lib/utils';
	import type { SubmitFunction } from '@sveltejs/kit';
	export let data: PageData;

	console.log(data);

	const { carcass, primals, access } = data;

	const allTabs = [
		{ label: 'Physical information', value: 'physical-info' },
		{ label: 'Traceability', value: 'traceability' }
	];

	let carcass_id: number = carcass.id;
	let primal_id: number;
	let ean_barcode: string;
	let quantity: number;
	let expiry_date: Date;
	let loading: boolean = false;
	let validationErrors: {
		carcass_id?: [number];
		primal_id?: [number];
		ean_barcode?: [string];
		quantity?: [number];
		expiry_date?: [Date];
	};

	let disabled = false;

	const primalOptions = primals.results.map((primal) => ({
		value: primal.id,
		label: primal.name
	}));

	let showModal = false;

	function toggleModal() {
		showModal = !showModal;
	}

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

	let form;

	const submit: SubmitFunction = ({ formData }) => {
		loading = true;

		return async ({ result, update }) => {
			loading = false;
			if (result.status === 200) {
				showToast('Batch created successfully', 'success');
				toggleModal();
			} else {
				showToast('Ooops something went wrong', 'error');
			}
			loading = false;
		};
	};
</script>

<Modal {showModal} on:close={toggleModal}>
	<div slot="modal-content" class="w-full">
		<!-- Your modal content goes here -->

		<!-- uncomment when you want to test -->
		<!-- <form
			action="?/manage-batch"
			method="post"
			class="md:max-w-2xl w-[350px] md:w-[450px] flex flex-col items-center p-6 gap-8 bg-white rounded-md"
			use:enhance={submit}
		> -->
		<form
			action="?/create"
			method="post"
			class="md:max-w-2xl w-[350px] md:w-[450px] flex flex-col items-center p-6 gap-8 bg-white rounded-md"
			use:enhance={submit}
			bind:this={form}
		>
			<div class="modal-title flex items-center gap-3 self-stretch">
				<div class="title-text flex-[1 0 0] text-lg font-medium tracking-[-0.18px] w-11/12">
					Fill the form below to create batch
				</div>
				<button
					type="button"
					class="close-button flex justify-center items-center w-1/12"
					on:click={toggleModal}
				>
					<img src="/icons/close.svg" alt="close icon" />
				</button>
			</div>
			<div class="modal-input w-full hidden">
				<input type="number" name="carcass_id" id="carcass_id" bind:value={carcass_id} />
			</div>
			<div class="modal-input w-full">
				<label for="primal" class="block mb-2 text-sm">Primal</label>
				<input
					type="number"
					class="hidden"
					name="primal_id"
					id="primal_id"
					bind:value={primal_id}
				/>

				{#if primals && primals.results}
					<Selector
						on:selected={(e) => (primal_id = e.detail.value)}
						prop={primal_id}
						inputName="primal"
						placeholder="Select primal"
						options={primalOptions}
						token={access}
						endpoint="manage"
						searchEndpoint="api/inventory/primals"
					/>
				{/if}
				{#if validationErrors?.primal_id}
					<sub
						transition:slide={{ delay: 250, duration: 300 }}
						class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.primal_id}</sub
					>
				{/if}
			</div>
			<div class="modal-input w-full">
				<input
					type="text"
					name="ean_barcode"
					id="ean_barcode"
					placeholder="Ean barcode"
					bind:value={ean_barcode}
					class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
				{#if validationErrors?.ean_barcode}
					<sub
						transition:slide={{ delay: 250, duration: 300 }}
						class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.ean_barcode}</sub
					>
				{/if}
			</div>
			<div class="modal-input w-full">
				<input
					type="number"
					name="quantity"
					id="quantity"
					placeholder="Quantity"
					bind:value={quantity}
					class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
				{#if validationErrors?.quantity}
					<sub
						transition:slide={{ delay: 250, duration: 300 }}
						class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.quantity}</sub
					>
				{/if}
			</div>
			<div class="modal-input w-full">
				<!-- calender -->
				<input
					type="date"
					name="expiry_date"
					id="expiry_date"
					placeholder="Expiry date"
					max={maxDate}
					bind:value={expiry_date}
					class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
			</div>
			<div class="modal-submit">
				<button
					class="bg-primary-50 py-[0.88rem] px-[0.63rem] rounded-[8px] w-full md:w-[25rem]
					hover:bg-[#C7453C] hover:rounded-[0.625rem]
					focus:shadow-custom text-white font-bold text-sm max-h-12 flex items-center justify-center
					"
					type="submit"
					{disabled}
				>
					{#if loading}
						<iconify-icon width="35" icon="eos-icons:three-dots-loading"></iconify-icon>
					{:else}
						<span class="button-text">Add batch </span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</Modal>

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
	<section>
		<div class="filters flex items-center w-full xs:gap-5 sm:gap-2 md:gap-0 justify-between">
			<div
				class="flex items-center sm:w-[24em] border gap-2 rounded-md border-[#D9D9D9] text-[#232222] px-2"
			>
				Batches
			</div>

			<div class="filter-buttons flex items-start gap-2 sm:gap-5">
				<button
					on:click={toggleModal}
					class="w-auto h-9 px-2.5 py-2 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
                hover:bg-[#C7453C]
                focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/plus.svg" alt="batches-plus" />
					</div>
					<span class="text-white hidden sm:block text-sm font-bold font-['Satoshi']"
						>Add batch</span
					>
				</button>
			</div>
		</div>
	</section>
</div>
