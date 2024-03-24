<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import Modal from '$lib/components/Modal.svelte';
	import BatchCard from '$lib/components/BatchCard.svelte';
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Batches, type Batch, currentProvider } from '$lib/stores.js';

	import { showToast } from '$lib/utils.js';
	import { browser } from '$app/environment';
	import Selector from '$lib/components/Selector.svelte';
	import { onDestroy } from 'svelte';
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from '../$types';
	import * as Tabs from '$lib/components/ui/tabs';

	export let data;
	let { carcass, primals, access } = data;

	currentProvider.set(null);
	let { batches } = data;

	console.log(batches);
	Batches.set(batches.results);
	const allTabs = [
		{ label: 'Physical information', value: 'physical-info' },
		{ label: 'Traceability', value: 'traceability' }
	];
	let disabled: boolean;

	$: {
		$Batches.length > 0 && $Batches[0].carcass.id === carcass.id
			? (disabled = true)
			: (disabled = false);
	}

	let edit: boolean = false;

	$: {
		console.log(edit);
	}

	let showModal = false;
	let loading = false;
	let grid = false;
	let validationErrors: {
		primal_id?: [string];
		carcass_id?: [string];
		ean_barcode?: [string];
		quantity?: [string];
		expiry_date?: [string];
	};
	let currBatch: Batch | null;
	let showBatchInfo: boolean = false;

	let carcass_id: number = carcass.id;
	let primal_id: number;
	let ean_barcode: string;
	let quantity: number;
	let expiry_date: Date;
	let batch_id: number;

	const primalOptions = primals.results.map((primal) => ({
		value: primal.id,
		label: primal.name
	}));

	function toggleModal(batch?: Batch) {
		showModal = !showModal;
		if (batch && !$currentProvider) {
		} else if (batch && $currentProvider) {
			console.log('editing');
			edit = true;
		}
	}
	let currentBatchData = {
		primal_id: 0,
		carcass_id: 0,
		ean_barcode: '',
		quantity: 0,
		expiry_date: '',
		batch_id: 0
	};

	const toggleEditModal = (batch?: Batch) => {
		console.log('curbdata', batch);
		batch_id = batch?.id;
		if (batch && !$currentProvider) {
			currentProvider.set(batch);
			currentBatchData = {
				primal_id: batch.primal.id,
				carcass_id: batch.carcass.id,
				ean_barcode: batch.ean_barcode,
				quantity: batch.quantity,
				batch_id: batch.id,
				expiry_date: dayjs(batch.expiry_date).format('YYYY-MM-DD')
			};
			edit = true; // Set edit to true when editing an existing batch
		} else {
			// console.log('adding');
			edit = false; // Set edit to false when adding a new batch
			currentBatchData = {
				primal_id: 0,
				carcass_id: 0,
				batch_id: 0,
				ean_barcode: '',
				quantity: 0,
				expiry_date: ''
			};
			currentProvider.set(null);
		}
		toggleModal();
	};

	const submit: SubmitFunction = async ({ formData }) => {
		loading = true;
		if ($currentProvider) {
			// formData.append('batch_id', `${$currentProvider?.id}`);
		}
		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					if (result.data.edited) {
						const updatedBatch = result.data.updatedBatch;

						Batches.update((batches) => {
							const updatedBatches = batches.map((batch) => {
								if (batch.id === updatedBatch.id) {
									batch = updatedBatch;
								}
								return batch;
							});
							return updatedBatches;
						});
						showToast('Batch updated successfully', 'success');
					} else {
						Batches.set([result.data.newBatch, ...$Batches]);
						showToast('Batch added successfully', 'success');
					}
					toggleEditModal();
				} else if (result.status === 400) {
					validationErrors = result.data.errors;
				} else if (result.status === 500) {
					showToast('Ooops something went wrong', 'error');
				}
			} finally {
				update();
				loading = false;
			}
		};
	};

	const showInfo = (batch: Batch) => {
		currBatch = batch;
		showBatchInfo = true;
	};

	const toggleGrid = () => {
		grid = !grid;
		localStorage.setItem('gridPreference', JSON.stringify(grid));
	};

	$: {
		if (browser) {
			grid = localStorage.getItem('gridPreference')
				? JSON.parse(localStorage.getItem('gridPreference') as string)
				: false;
		}
	}

	const unsubscribe = currentProvider.subscribe((curr) => curr);
	onDestroy(() => {
		currentProvider.set(null);
		unsubscribe;
	});
</script>

<svelte:head>
	<title>Batches - Spek-n-Boonen</title>
</svelte:head>

<!-- Add/Edit batch modal -->
<Modal {showModal} on:close={() => toggleEditModal()}>
	<div slot="modal-content" class="w-full min-w-[500px]">
		<form
			action="?/manage-batch"
			method="post"
			class="w-full min-w-[500px] flex flex-col items-center py-4 gap-4 bg-white rounded-md"
			use:enhance={submit}
		>
			<div class="modal-title px-6 flex items-center gap-3 self-stretch">
				<h3
					class="title-text flex-[1 0 0] text-lg font-satoshi font-medium tracking-[-0.18px] w-full"
				>
					{$currentProvider?.id ? 'Edit' : 'Fill the form below to add'} batch
				</h3>
				<button
					type="button"
					class="close-button flex justify-center items-center w-1/12"
					on:click={() => toggleEditModal()}
				>
					<img src="/icons/close.svg" alt="close icon" />
				</button>
			</div>
			<Separator orientation="horizontal" class="mb-5 text-grey-300" />
			<div class="flex flex-col gap-6 px-6 w-full">
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
				<div class="modal-input w-full hidden">
					<input type="number" name="carcass_id" id="carcass_id" bind:value={carcass_id} />
				</div>
				<div class="modal-input w-full hidden">
					<input type="number" name="batch_id" id="batch_id" bind:value={batch_id} />
				</div>
				<div class="modal-input w-full hidden">
					<input type="checkbox" name="edit" id="edit" bind:value={edit} checked={edit} />
				</div>
				<div class="modal-input flex flex-col gap-1 w-full">
					<label for="ean-barcode" class="font-satoshi font-medium text-sm">EAN Barcode</label>
					<input
						type="text"
						name="ean_barcode"
						id="ean_barcode"
						placeholder="Enter EAN barcode"
						bind:value={currentBatchData.ean_barcode}
						class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.ean_barcode}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]"
							>{validationErrors.ean_barcode}</sub
						>
					{/if}
				</div>
				<div class="modal-input flex flex-col gap-1 w-full">
					<label for="quantity" class="font-satoshi font-medium text-sm">Quantity</label>
					<input
						type="number"
						name="quantity"
						id="quantity"
						placeholder="Enter quantity"
						bind:value={currentBatchData.quantity}
						class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.quantity}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.quantity}</sub
						>
					{/if}
				</div>
				<div class="modal-input flex flex-col gap-1 w-full">
					<label for="expiry-date" class="font-satoshi font-medium text-sm">Expiry Date</label>
					<input
						type="date"
						name="expiry_date"
						id="expiry_date"
						placeholder="Select expiry date"
						bind:value={currentBatchData.expiry_date}
						class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.expiry_date}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]"
							>{validationErrors.expiry_date}</sub
						>
					{/if}
				</div>
				<div class="modal-submit w-full flex items-center justify-end">
					<button
						class="bg-primary-50 py-2 px-3 rounded-md
						hover:bg-[#C7453C] hover:rounded-[0.625rem]
						focus:shadow-custom text-white font-bold text-sm flex items-center justify-center
						"
						type="submit"
						disabled={loading}
					>
						{#if loading}
							<iconify-icon width="35" icon="eos-icons:three-dots-loading"></iconify-icon>
						{:else}
							<span class="button-text">{$currentProvider?.id ? 'Edit' : 'Add'} batch</span>
						{/if}
					</button>
				</div>
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
				</section>
			</Tabs.Root>
			<!-- Tabs -->
		</section>
		<!-- More Details -->
	</section>
	<section class="flex flex-col gap-4">
		<div class="filters flex items-center w-full xs:gap-5 sm:gap-2 md:gap-0 justify-between">
			<div
				class="flex items-center sm:w-[24em] gap-2 rounded-md text-[#232222] px-2 text-3xl font-semibold"
			>
				Batches
			</div>

			<div class="filter-buttons flex items-start gap-2 sm:gap-5">
				<button
					on:click={toggleModal}
					class="w-auto h-9 px-2.5 py-2 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
                hover:bg-[#C7453C]
                focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]
				disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#D9D9D9]
				"
					{disabled}
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
		<div class="border rounded-xl">
			<table class="table">
				<thead>
					<tr class="">
						<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">Primal</th>
						<th class="bg-[#F9F9F9]">Carcass</th>
						<th class="bg-[#F9F9F9]">EAN Barcode</th>
						<th class="bg-[#F9F9F9]">Quantity</th>
						<th class="bg-[#F9F9F9]">Remaining Quantity</th>
						<th class="bg-[#F9F9F9]">Expiry Date</th>
						<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></th>
					</tr>
				</thead>

				<tbody>
					{#each $Batches as batch (batch?.id)}
						{#if batch.carcass.id === carcass.id}
							<BatchCard {batch} on:edit={() => toggleEditModal(batch)}/>
						
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</div>
