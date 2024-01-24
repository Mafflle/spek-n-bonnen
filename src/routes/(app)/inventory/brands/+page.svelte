<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { enhance } from '$app/forms';
	import BrandCard from '$lib/components/BrandCard.svelte';
	import MediaManager from '$lib/components/MediaManager.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { showToast } from '$lib/utils.js';
	import { slide } from 'svelte/transition';
	import { Brands, type Brand } from '$lib/stores.js';

	dayjs.extend(relativeTime);

	export let data;

	let showModal = false;
	let loading = false;
	let grid = false;
	let previewImage;
	let showMediaManager = false;
	let disabled = true;
	let validationErrors: { name?: [string]; logo?: [string] };
	let imageId: number;

	$: {
		if (previewImage) {
			imageId = previewImage.id;
		}
	}

	function toggleModal() {
		showModal = !showModal;
	}
	function toggleMediaManager() {
		showMediaManager = !showMediaManager;
	}

	const { brands } = data;

	Brands.set(brands.results);

	$: {
		if (previewImage) {
			disabled = false;
		}
	}
	let currentBrand: Brand;

	const toggleEditModal = (brand: Brand) => {
		currentBrand = brand;
		previewImage = brand.logo;
		imageId = brand.logo.id;
		showModal = !showModal;
	};
</script>

<svelte:head>
	<title>Brands - Spek-n-Boonen</title>
</svelte:head>

<!-- add brand modal -->
<Modal {showModal} on:close={toggleModal}>
	<div slot="modal-content">
		<!-- Your modal content goes here -->
		<form
			action="?/manage-brand"
			method="post"
			class="w-[460px] flex flex-col items-center p-6 gap-8 bg-white rounded-md"
			use:enhance={({ formData }) => {
				loading = true;
				if (currentBrand.id) {
					formData.set('brandToEdit', `${currentBrand.id}`);
				}
				return async ({ result, update }) => {
					try {
						if (result.status === 200) {
							if (result.data.edited) {
								const editedBrand = result.data.editedBrand;

								Brands.update((brands) => {
									const updatedBrands = brands.map((brand) => {
										if (brand.id === editedBrand.id) {
											brand = editedBrand;
										}
										return brand;
									});
									return updatedBrands;
								});
								showToast('Brand edited successfully', 'success');
								toggleModal();
							} else {
								console.log(result.data);
								Brands.set([result.data.newBrand, ...$Brands]);
								showToast('Brand added successfully', 'success');
								toggleModal();
							}
						} else if (result.status === 400) {
							validationErrors = result.data.errors;

							if (validationErrors.logo) {
								showToast('Select an image before adding brand', 'error');
							}
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
					{currentBrand.name ? 'Edit' : 'Add'} brand
				</div>
				<button class="close-button flex justify-center items-center w-1/12" on:click={toggleModal}>
					<img src="/icons/close.svg" alt="close icon" />
				</button>
			</div>
			<div class="w-full">
				<div
					class="w-full relative rounded-xl flex py-8 px-24 flex-col items-start gap-3 self-stretch hover:bg-primary-softPink-100 border-2 border-grey-300 hover:border-primary-red border-dashed"
				>
					<div
						class="upload-box-info relative w-full flex flex-col justify-center items-center gap-8"
					>
						{#if previewImage}
							<img
								src={previewImage.image}
								alt=""
								style="aspect-ratio: 4/3"
								class=" h-full w-full object-cover pointer-events-none"
							/>
						{:else}
							<div
								class="image w-14 h-14 rounded-full flex justify-center items-center border border-primary-softPink"
							>
								<img src="/icons/regular-image.svg" alt="reguar icon" />
							</div>
						{/if}

						<button
							on:click={toggleMediaManager}
							type="button"
							class="bg-primary-red py-2.5 px-4 text-sm font-medium text-white rounded-[30px]"
							>Import from Media Manager</button
						>
					</div>
				</div>
			</div>
			<div class="modal-input">
				<input type="text" class="hidden" bind:value={imageId} name="brand-logo" />
				<input
					type="text"
					name="brand-name"
					id="brand-name"
					placeholder="Brand name"
					bind:value={currentBrand.name}
					class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
				{#if validationErrors?.name}
					<sub
						transition:slide={{ delay: 250, duration: 300 }}
						class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.name}</sub
					>
				{/if}
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
						<span class="button-text">{currentBrand.name ? 'Edit' : 'Add'} brand </span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</Modal>

<!-- media manager -->
<Modal showModal={showMediaManager} on:close={() => (showMediaManager = false)}>
	<MediaManager
		slot="modal-content"
		images={data.images.results}
		on:selected={(e) => {
			previewImage = e.detail;
			showMediaManager = false;
		}}
	/>
</Modal>

<div class="page h-full w-full">
	<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<h2 class="text-[2em] -tracking-[2px] font-satoshi font-bold">Brand</h2>
			<sub class="text-[#6B6B6B] text-sm"> Providers / Brands</sub>
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
					on:click={toggleModal}
					class="w-auto h-9 px-2.5 py-2 bg-primary-50 rounded-sm sm:rounded-md justify-center items-center gap-2.5 inline-flex
                    hover:bg-[#C7453C]
                    focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/plus.svg" alt="brand-plus" />
					</div>
					<div class="text-white hidden sm:block text-sm font-bold font-['Satoshi']">Add brand</div>
				</button>
			</div>
		</div>
	</div>
	<!-- render if page is empty -->
	{#if brands.results.length === 0}
		<div class="empty h-full w-full flex justify-center items-center">
			<div class="empty-indicator flex flex-col justify-center items-center gap-5 w-[277px]">
				<div class="icon">
					<img src="/icons/empty-Illustration.svg" alt="empty illustration " />
				</div>
				<div class="content">
					<div class="text flex flex-col gap-3 justify-center items-center text-grey-300">
						<h3 class="title text-3xl font-medium tracking-[-0.64px]">No brand added</h3>
						<div class="info text-center text-sm font-medium leading-5 tracking-[-0.13px]">
							You currently don’t have any brand saved, click the button below to create one
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
						<p class="text-white text-sm font-bold">Add brand</p>
					</button>
				</div>
			</div>
		</div>
	{:else if grid}
		<!-- Check if grid is false -->
		<div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
			{#each $Brands as brand}
				<BrandCard
					on:edit={(e) => toggleEditModal(e.detail)}
					{brand}
					name={brand.name}
					date={dayjs(brand.updated_at).fromNow()}
					{grid}
					id={0}
				/>
			{/each}
		</div>
	{:else}
		<!-- If grid is true, render the table -->
		<div class="border rounded-xl">
			<table class="table">
				<thead>
					<tr class="">
						<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">Brand name</th>
						<th class="bg-[#F9F9F9]">Date added</th>
						<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></th>
					</tr>
				</thead>

				<tbody>
					{#each $Brands as brand}
						<BrandCard
							on:edit={(e) => toggleEditModal(e.detail)}
							{brand}
							name={brand.name}
							date={dayjs(brand.updated_at).fromNow()}
							{grid}
							id={brand.id}
						/>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
