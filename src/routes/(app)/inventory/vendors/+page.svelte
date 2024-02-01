<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import Vendor from '$lib/components/Vendor.svelte';
	import { Vendors, currentProvider } from '$lib/stores';
	import { showToast } from '$lib/utils';
	import { onDestroy, onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	export let data;

	const { vendors } = data;
	console.log(vendors);

	let showModal = false;
	let loading = false;
	let grid = false;
	let validationErrors: { name?: [string]; phone_number?: [string]; address?: [string] };

	let vendorToEditName: string;
	let vendorToEditAddress: string;
	let vendorToEditPhone: string;

	function toggleModal() {
		showModal = !showModal;
	}
	const toggleEditModal = (vendor?) => {
		if (vendor && !$currentProvider) {
			currentProvider.set(vendor);
			vendorToEditAddress = $currentProvider?.address;
			vendorToEditName = $currentProvider?.name;
			vendorToEditPhone = $currentProvider?.phone_number;
		} else if (!vendor && $currentProvider) {
			vendorToEditAddress = '';
			vendorToEditName = '';
			vendorToEditPhone = '';
			currentProvider.set(null);
		}
		toggleModal();
	};

	const unsubscribe = Vendors.subscribe((items) => items);

	onMount(() => {
		Vendors.set(vendors.results);
	});

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

	onDestroy(() => {
		unsubscribe;
	});
</script>

<svelte:head>
	<title>Vendors - Spek-n-Boonen</title>
</svelte:head>
<Modal {showModal} on:close={() => toggleEditModal()}>
	<!-- Your modal content goes here -->
	<form
		slot="modal-content"
		action="?/manage-vendor"
		method="post"
		use:enhance={async ({ formData }) => {
			if ($currentProvider?.id) formData.append('vendor-id', `${$currentProvider?.id}`);
			loading = true;
			return async ({ result, update }) => {
				try {
					if (result.status === 200) {
						if (result.data.edited) {
							const editedVendor = result.data.editedVendor;

							Vendors.update((vendors) => {
								const updatedVendors = vendors.map((vendor) => {
									if (vendor.id === editedVendor.id) {
										vendor = editedVendor;
									}
									return vendor;
								});
								return updatedVendors;
							});
							showToast('Vendor edited successfully', 'success');
						} else {
							// console.log(result.data);
							Vendors.set([result.data.newVendor, ...$Vendors]);
							showToast('New vendor added successfully', 'success');
						}
						validationErrors = {};
						toggleModal();
					} else if (result.status === 400) {
						// console.log(result.data);

						validationErrors = result.data.errors;
					} else {
						showToast('Ooops something went wrong', 'error');
					}
				} finally {
					await update();
					loading = false;
				}
			};
		}}
		class="md:max-w-2xl w-[350px] md:w-xl flex flex-col items-center p-4 md:p-6 gap-8 bg-white rounded-md"
	>
		<div class="modal-title flex items-center gap-3 w-full">
			<div class="title-text flex-[1 0 0] text-lg font-medium tracking-[-0.18px] w-11/12">
				{$currentProvider?.id ? 'Edit vendor' : 'Add vendor'}
			</div>
			<button
				class="close-button flex justify-center items-center w-1/12"
				on:click={() => toggleEditModal()}
			>
				<img src="/icons/close.svg" alt="close icon" />
			</button>
		</div>

		<section class="flex flex-col items-start gap-4 w-full">
			<div class="modal-input flex flex-col gap-1 items-start w-full">
				<label for="vendor-name">Vendor name</label>
				<input
					type="text"
					name="vendor-name"
					id="vendor-name"
					bind:value={vendorToEditName}
					placeholder="Vendor name"
					class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
				{#if validationErrors?.name}
					<sub
						transition:slide={{ delay: 250, duration: 300 }}
						class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.name}</sub
					>
				{/if}
			</div>
			<div class="modal-input flex flex-col gap-1 items-start w-full">
				<label for="vendor-address">Vendor's address</label>
				<input
					type="text"
					name="vendor-address"
					id="vendor-address"
					bind:value={vendorToEditAddress}
					placeholder="Enter vendor's address"
					class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
				{#if validationErrors?.address}
					<sub
						transition:slide={{ delay: 250, duration: 300 }}
						class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.address}</sub
					>
				{/if}
			</div>
			<div class="modal-input flex flex-col gap-1 items-start w-full">
				<label for="vendor-phone">Vendor's phone number</label>
				<input
					type="text"
					name="vendor-phone"
					id="vendor-phone"
					bind:value={vendorToEditPhone}
					placeholder="Enter vendor's phone number"
					class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
				{#if validationErrors?.['phone_number']}
					<sub
						transition:slide={{ delay: 250, duration: 300 }}
						class="text-rose-500 text-xs tracking-[-0.0075rem]"
						>{validationErrors['phone_number']}</sub
					>
				{/if}
			</div>
		</section>
		<div class="modal-submit">
			<button
				class="bg-primary-50 p-2.5 md:py-[0.88rem] md:px-[0.63rem] rounded-[8px] w-full md:w-[25rem]
					hover:bg-[#C7453C] hover:rounded-[0.625rem]
					focus:shadow-custom text-white font-bold text-sm max-h-12 flex items-center justify-center
					"
				type="submit"
			>
				{#if loading}
					<iconify-icon width="35" icon="eos-icons:three-dots-loading"></iconify-icon>
				{:else}
					<span class="button-text"> {$currentProvider?.id ? 'Edit vendor' : 'Add vendor'} </span>
				{/if}
			</button>
		</div>
	</form>
</Modal>
<div class="page h-full w-full">
	<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<div class="text-[2rem] tracking-[-0.04rem] font-bold">Vendors</div>
			<sub class="text-[#6B6B6B] text-sm"> Providers / Vendors</sub>
		</div>
		<div class="filters flex items-center w-full xs:gap-5 sm:gap-2 md:gap-0 justify-between">
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
				<input type="text" placeholder="Type here" class=" py-2 flex-auto outline-none" />
			</div>

			<div class="filter-buttons flex items-start gap-2 sm:gap-5">
				<button
					class="flex h-9 p-2 justify-center items-center gap-3 bg-[#F9F9F9]"
					on:click={toggleGrid}
				>
					<img src={grid ? '/icons/grid.svg' : '/icons/filter-table.svg'} alt="filter table" />
				</button>
				<button
					on:click={toggleModal}
					class="w-auto h-9 px-2.5 py-2 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
                    hover:bg-[#C7453C]
                    focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/plus.svg" alt="vendor-plus" />
					</div>
					<span class="text-white hidden sm:block text-sm font-bold font-['Satoshi']"
						>Add vendor</span
					>
				</button>
			</div>
		</div>
	</div>
	<!-- render if page is empty -->
	{#if $Vendors.length === 0}
		<div class="empty h-full w-full flex justify-center items-center">
			<div class="empty-indicator flex flex-col justify-center items-center gap-5 w-[277px]">
				<div class="icon">
					<img src="/icons/empty-Illustration.svg" alt="empty illustration " />
				</div>
				<div class="content">
					<div class="text flex flex-col gap-3 justify-center items-center text-grey-300">
						<h3 class="title text-3xl font-medium tracking-[-0.64px]">No vendor added</h3>
						<div class="info text-center text-sm font-medium leading-5 tracking-[-0.13px]">
							You currently don’t have any vendor saved, click the button below to create one
						</div>
					</div>
				</div>
				<div class="button">
					<button
						class=" px-2.5 py-2.5 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
			hover:bg-[#C7453C]
			focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
						on:click={toggleModal}
					>
						<div class="w-5 h-5 relative">
							<img src="/icons/plus.svg" alt="user-plus" />
						</div>
						<p class="text-white text-sm font-bold">Add vendor</p>
					</button>
				</div>
			</div>
		</div>
	{:else if grid}
		<!-- Check if grid is false -->
		<div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
			{#each $Vendors as vendor}
				<Vendor {vendor} {grid} />
			{/each}
		</div>
	{:else}
		<!-- If grid is true, render the table -->
		<div class="border rounded-xl">
			<table class="table">
				<thead>
					<tr class="">
						<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">Name</th>
						<th class="bg-[#F9F9F9]">Date added</th>
						<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></th>
					</tr>
				</thead>

				<tbody>
					{#each $Vendors as vendor}
						<Vendor {vendor} {grid} on:edit={(e) => toggleEditModal(e.detail)} />
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
