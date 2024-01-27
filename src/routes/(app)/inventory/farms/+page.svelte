<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import Modal from '$lib/components/Modal.svelte';
	import FarmCard from '$lib/components/FarmCard.svelte';
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Farms, type Farm } from '$lib/stores.js';

	import { showToast } from '$lib/utils.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	export let data;

	console.log(Farms);
	const { farms } = data;
	console.log(farms.results); // Add this line to debug
	Farms.set(farms.results);

	let showModal = false;
	let loading = false;
	let grid = false;
	let disabled = false;
	let validationErrors: { name?: [string]; address?: [string] };
	let address: string = '';
	let id: number = 0;

	function toggleModal() {
		showModal = !showModal;
	}

	let currentFarm: Farm;
	let currentFarmName: string;

	const toggleEditModal = (farm: Farm) => {
		console.log(farm);
		currentFarm = farm;
		currentFarmName = currentFarm.name;
		address = currentFarm.address;
		id = currentFarm.id;
		showModal = !showModal;
	};
	const submit: SubmitFunction = async ({ formData }) => {
		console.log(formData);
	};
</script>

<svelte:head>
	<title>Primals - Spek-n-Boonen</title>
</svelte:head>
<!-- add primal modal -->
<Modal {showModal} on:close={toggleModal}>
	<div slot="modal-content">
		<!-- Your modal content goes here -->
		<form
			action="?/manage-farm"
			method="post"
			class="w-[460px] flex flex-col items-center p-6 gap-8 bg-white rounded-md"
			use:enhance={({ formData }) => {
				loading = true;
				if (currentFarm?.id) {
					formData.set('farmToEdit', `${currentFarm.id}`);
				}
				return async ({ result, update }) => {
					try {
						if (result.status === 200) {
							if (result.data.edited) {
								const editedFarm = result.data.editedFarm;

								Farms.update((farms) => {
									const updatedFarms = farms.map((farm) => {
										if (farm.id === editedFarm.id) {
											farm = editedFarm;
										}
										return farm;
									});
									return updatedFarms;
								});
								Object.keys(currentFarm).forEach((key) => (currentFarm[key] = false));
								showToast('Farm edited successfully', 'success');

								toggleModal();
							} else {
								// console.log(result.data);
								Farms.set([result.data.newFarm, ...$Farms]);
								showToast('Farm added successfully', 'success');
								toggleModal();
							}
						} else if (result.status === 400) {
							validationErrors = result.data.errors;
						} else if (result.status === 500) {
							showToast('Ooops something went wrong', 'error');
						}
					} finally {
						if (showModal) {
							update({ reset: true });
						} else {
							update();
						}
						loading = false;
					}
				};
			}}
		>
			<div class="modal-title flex items-center gap-3 self-stretch">
				<div class="title-text flex-[1 0 0] text-lg font-medium tracking-[-0.18px] w-11/12">
					{currentFarm ? 'Edit' : 'Add'} farm
				</div>
				<button class="close-button flex justify-center items-center w-1/12" on:click={toggleModal}>
					<img src="/icons/close.svg" alt="close icon" />
				</button>
			</div>
			<div class="flex flex-col gap-4">
				<div class="modal-input">
					<input
						type="text"
						name="farm-name"
						id="farm-name"
						placeholder="Farm name"
						bind:value={currentFarmName}
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
					<Textarea
						name="farm-address"
						id="farm-address"
						placeholder="Farm address (optional)"
						bind:value={address}
						class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.address}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.address}</sub
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
							<span class="button-text">{currentFarm ? 'Edit' : 'Add'} farm </span>
						{/if}
					</button>
				</div>
			</div>
		</form>
	</div>
</Modal>
<div class="page h-full w-full">
	<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<div class="text-[2rem] tracking-[-0.04rem]">Farms</div>
			<sub class="text-[#6B6B6B] text-sm"> Inventory / Farms / Manage</sub>
		</div>
		<div class="filters flex items-center w-full justify-between">
			<div
				class="flex items-center w-[24em] border gap-2 rounded-md border-[#D9D9D9] text-[#232222] px-2"
			>
				<input type="text" placeholder="Type here" class=" py-2 flex-auto outline-none" />
			</div>

			<div class="filter-buttons flex items-start gap-5">
				<button
					class="flex h-9 p-2 justify-center items-center gap-3 bg-[#F9F9F9]"
					on:click={() => (grid = !grid)}
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
					<div class="text-white text-sm font-bold font-['Satoshi']">Add farm</div>
				</button>
			</div>
		</div>
	</div>
	<!-- render if page is empty -->
	{#if farms.length === 0}
		<div class="empty h-full w-full flex justify-center items-center">
			<div class="empty-indicator flex flex-col justify-center items-center gap-5 w-[277px]">
				<div class="icon">
					<img src="/icons/empty-Illustration.svg" alt="empty illustration " />
				</div>
				<div class="content">
					<div class="text flex flex-col gap-3 justify-center items-center text-grey-300">
						<h3 class="title text-3xl font-medium tracking-[-0.64px]">No farm added</h3>
						<div class="info text-center text-sm font-medium leading-5 tracking-[-0.13px]">
							You currently don’t have any farm saved, click the button below to create one
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
						<p class="text-white text-sm font-bold">Add farm</p>
					</button>
				</div>
			</div>
		</div>
	{:else if grid}
		<!-- Check if grid is false -->
		<div class="w-full grid grid-cols-3 gap-10">
			{#each $Farms as farm}
				<FarmCard
					on:edit={(e) => toggleEditModal(e.detail)}
					{farm}
					name={farm.name}
					address={farm.address}
					{grid}
					id={farm.id}
				/>
			{/each}
		</div>
	{:else}
		<!-- If grid is true, render the table -->
		<div class="border rounded-xl">
			<table class="table">
				<thead>
					<tr class="">
						<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">Farm</th>
						<th class="bg-[#F9F9F9]">address</th>
						<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></th>
					</tr>
				</thead>

				<tbody>
					{#each $Farms as farm}
						<FarmCard
							on:edit={(e) => toggleEditModal(e.detail)}
							{farm}
							name={farm.name}
							address={farm.address}
							{grid}
							id={farm.id}
						/>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
