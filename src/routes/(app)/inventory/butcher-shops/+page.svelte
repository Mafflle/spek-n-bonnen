<script lang="ts">
	import { enhance } from '$app/forms';
	import Card from '$lib/components/Card.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { ButcherShops, currentProvider, type ButcherShop } from '$lib/stores';
	import { showToast } from '$lib/utils';
	import { slide } from 'svelte/transition';

	export let data;

	const { shops } = data;
	let showModal: boolean = false;
	let loading = false;
	let grid = false;
	let disabled = false;
	let validationErrors: { name?: [string]; address?: [string] };
	let currentShopName: string = '';
	let currentAddress: string = '';

	ButcherShops.set(shops.results);
	function toggleModal() {
		showModal = !showModal;
	}
	const toggleEditModal = (shop?: ButcherShop) => {
		if (shop && !$currentProvider) {
			currentProvider.set(shop);
			currentShopName = $currentProvider?.name;
			currentAddress = $currentProvider?.address;
		} else {
			currentShopName = '';
			currentAddress = '';
			currentProvider.set(null);
		}
		toggleModal();
	};
</script>

<svelte:head>
	<title>Butcher Shops - Spek-N-Boonen</title>
</svelte:head>

{#if $ButcherShops.length > 0}
	<div class="w-full">
		<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
			<div class="headers flex flex-col items-start gap-[0.25rem]">
				<h2 class="text-[2em] -tracking-[0.64px] font-satoshi font-bold">Butcher shop</h2>
				<sub class="text-[#6B6B6B] text-sm"> Providers / Butcher shops</sub>
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
					<input
						type="text"
						placeholder="Search for brands..."
						class=" py-2 flex-auto outline-none"
					/>
				</div>

				<div class="filter-buttons flex items-start gap-2 sm:gap-5">
					<button
						class="flex h-9 p-2 justify-center items-center gap-3 bg-[#F9F9F9]"
						on:click={() => (grid = !grid)}
					>
						<img src={grid ? '/icons/grid.svg' : '/icons/filter-table.svg'} alt="filter table" />
					</button>
					<button
						on:click={() => (showModal = !showModal)}
						class="w-auto h-9 px-2.5 py-2 bg-primary-50 rounded-sm sm:rounded-md justify-center items-center gap-2.5 inline-flex
                    hover:bg-[#C7453C]
                    focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
					>
						<div class="w-5 h-5 relative">
							<img src="/icons/plus.svg" alt="brand-plus" />
						</div>
						<div class="text-white hidden sm:block text-sm font-bold font-['Satoshi']">
							Add butcher shop
						</div>
					</button>
				</div>
			</div>
		</div>

		{#if grid}
			<div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
				{#each $ButcherShops as shop}
					<Card
						on:delete={(e) => {
							ButcherShops.update((shops) => shops.filter((shop) => shop.id !== e.detail.id));
							showToast('Shop deleted successfully', 'success');
						}}
						data={shop}
						{grid}
						on:edit={() => toggleEditModal()}
					/>
				{/each}
			</div>
		{:else}
			<div class="border rounded-xl">
				<table class="table">
					<thead>
						<tr class="">
							<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">Name</th>
							<th class="bg-[#F9F9F9]">Address</th>
							<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></th>
						</tr>
					</thead>

					<tbody>
						{#each $ButcherShops as shop}
							<Card
								on:delete={(e) => {
									ButcherShops.update((shops) => shops.filter((shop) => shop.id !== e.detail.id));
									showToast('Shop deleted successfully', 'success');
								}}
								on:edit={(e) => toggleEditModal(e.detail)}
								data={shop}
								{grid}
							/>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
{:else}
	<div class="w-full h-full">
		<section class="w-full max-h-screen h-full flex justify-center items-center">
			<div class="empty w-full h-full flex justify-center items-center">
				<div class="empty-indicator flex flex-col justify-center items-center gap-5 w-full">
					<div class="icon">
						<img src="/icons/empty-Illustration.svg" alt="empty illustration " />
					</div>
					<div class="content w-full">
						<div class="text flex flex-col gap-3 justify-center items-center text-grey-300 w-full">
							<h3 class="title text-3xl font-medium tracking-[-0.64px] text-center w-full">
								No butcher house added
							</h3>
							<sub
								class="info text-center text-sm font-medium leading-5 tracking-[-0.13px] max-w-[277px]"
							>
								You currently don’t have any butcher house in your provider, click the button below
								to add one
							</sub>
						</div>
					</div>
					<button
						on:click={toggleModal}
						class=" px-2.5 py-2.5 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
									hover:bg-[#C7453C]
									focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
					>
						<span class="w-5 h-5 relative">
							<img src="/icons/plus.svg" alt="user-plus" />
						</span>
						<p class="text-white text-sm font-bold">Add butcher</p>
					</button>
				</div>
			</div>
		</section>
	</div>
{/if}

<Modal {showModal} on:close={() => toggleEditModal()}>
	<form
		slot="modal-content"
		action="?/manage-butcher-shop"
		method="post"
		class="min-w-[250px] w-[340px] sm:w-[460px] flex flex-col items-center p-6 gap-8 bg-white rounded-md"
		use:enhance={async ({ formData }) => {
			loading = true;
			if ($currentProvider?.id) {
				formData.append('id', `${$currentProvider.id}`);
			}

			return async ({ result, update }) => {
				try {
					if (result.status === 200) {
						if (result.data.edited) {
							const editedShop = result.data.editedShop;

							ButcherShops.update((shops) => {
								const updatedButcherShops = shops.map((shop) => {
									if (shop.id === editedShop.id) {
										shop = editedShop;
									}
									return shop;
								});
								return updatedButcherShops;
							});
							showToast('Butcher shop edited successfully', 'success');
						} else {
							// console.log(result.data);
							ButcherShops.set([result.data.newButcherShop, ...$ButcherShops]);
							showToast('Butcher shop added successfully', 'success');
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
		}}
	>
		<div class="modal-title flex items-center gap-3 self-stretch">
			<div class="title-text flex-[1 0 0] text-lg font-medium tracking-[-0.18px] w-11/12">
				{$currentProvider?.id ? 'Edit' : 'Add'} butcher shop
			</div>
			<button
				on:click={() => toggleEditModal()}
				class="close-button flex justify-center items-center w-1/12"
			>
				<img src="/icons/close.svg" alt="close icon" />
			</button>
		</div>

		<div class="flex flex-col gap-4 w-full">
			<div class="modal-input">
				<input
					type="text"
					name="name"
					id="name"
					placeholder="Enter name"
					bind:value={currentShopName}
					class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
				{#if validationErrors?.name}
					<sub
						transition:slide={{ delay: 250, duration: 300 }}
						class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.name}</sub
					>
				{/if}
			</div>
			<div class="modal-input">
				<input
					name="address"
					id="address"
					placeholder="Enter address (optional)"
					bind:value={currentAddress}
					class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
				{#if validationErrors?.address}
					<sub
						transition:slide={{ delay: 250, duration: 300 }}
						class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.address}</sub
					>
				{/if}
			</div>
			<div class="modal-submit w-full flex justify-end items-center">
				<button
					class="bg-primary-50 py-2.5 px-3 rounded-[8px]
                        hover:bg-[#C7453C]
                        focus:shadow-custom text-white font-bold text-sm flex items-center justify-center
                        "
					type="submit"
					{disabled}
				>
					{#if loading}
						<iconify-icon width="35" icon="eos-icons:three-dots-loading"></iconify-icon>
					{:else}
						<span class="button-text">{$currentProvider ? 'Edit' : 'Add'} butcher shop </span>
					{/if}
				</button>
			</div>
		</div>
	</form>
</Modal>
