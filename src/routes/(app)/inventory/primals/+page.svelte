<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import Modal from '$lib/components/Modal.svelte';
	import PrimalCard from '$lib/components/PrimalCard.svelte';
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Primals, type Primal } from '$lib/stores.js';

	import { showToast } from '$lib/utils.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { browser } from '$app/environment';

	export let data;

	console.log(Primals);
	const { primals } = data;
	console.log(primals.results); // Add this line to debug
	Primals.set(primals.results);

	let showModal = false;
	let loading = false;
	let grid = false;
	let disabled = false;
	let validationErrors: { name?: [string]; description?: [string] };
	let description: string = '';
	let slug: string = '';

	function toggleModal() {
		showModal = !showModal;
	}

	let currentPrimal: Primal;
	let currentPrimalName: string;

	const toggleEditModal = (primal: Primal) => {
		console.log(primal);
		currentPrimal = primal;
		currentPrimalName = currentPrimal.name;
		description = currentPrimal.description;
		slug = currentPrimal.slug;
		showModal = !showModal;
	};
	const submit: SubmitFunction = async ({ formData }) => {
		console.log(formData);
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
</script>

<svelte:head>
	<title>Primals - Spek-n-Boonen</title>
</svelte:head>
<!-- add primal modal -->
<Modal {showModal} on:close={toggleModal}>
	<div slot="modal-content">
		<!-- Your modal content goes here -->
		<form
			action="?/manage-primal"
			method="post"
			class="w-[460px] flex flex-col items-center p-6 gap-8 bg-white rounded-md"
			use:enhance={({ formData }) => {
				loading = true;
				if (currentPrimal?.slug) {
					formData.set('primalToEdit', `${currentPrimal.slug}`);
				}
				return async ({ result, update }) => {
					try {
						if (result.status === 200) {
							if (result.data.edited) {
								const editedPrimal = result.data.editedPrimal;

								Primals.update((primals) => {
									const updatedPrimals = primals.map((primal) => {
										if (primal.slug === editedPrimal.slug) {
											primal = editedPrimal;
										}
										return primal;
									});
									return updatedPrimals;
								});
								Object.keys(currentPrimal).forEach((key) => (currentPrimal[key] = false));
								showToast('Primal edited successfully', 'success');
								toggleModal();
							} else {
								// console.log(result.data);
								Primals.set([result.data.newPrimal, ...$Primals]);
								showToast('Primal added successfully', 'success');
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
					{currentPrimal ? 'Edit' : 'Add'} primal
				</div>
				<button class="close-button flex justify-center items-center w-1/12" on:click={toggleModal}>
					<img src="/icons/close.svg" alt="close icon" />
				</button>
			</div>
			<div class="flex flex-col gap-4">
				<div class="modal-input">
					<input
						type="text"
						name="primal-name"
						id="primal-name"
						placeholder="Primal name"
						bind:value={currentPrimalName}
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
						name="primal-description"
						id="primal-description"
						placeholder="Primal description (optional)"
						bind:value={description}
						class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.description}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]"
							>{validationErrors.description}</sub
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
							<span class="button-text">{currentPrimal ? 'Edit' : 'Add'} primal </span>
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
			<div class="text-[2rem] tracking-[-0.04rem]">Primals</div>
			<sub class="text-[#6B6B6B] text-sm"> Inventory / Primals / Manage</sub>
		</div>
		<div class="filters flex items-center w-full justify-between">
			<div
				class="flex items-center w-[24em] border gap-2 rounded-md border-[#D9D9D9] text-[#232222] px-2"
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

			<div class="filter-buttons flex items-start gap-5">
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
					<div class="text-white text-sm font-bold font-['Satoshi']">Add primal</div>
				</button>
			</div>
		</div>
	</div>
	<!-- render if page is empty -->
	{#if $Primals.length === 0}
		<div class="empty h-full w-full flex justify-center items-center">
			<div class="empty-indicator flex flex-col justify-center items-center gap-5 w-[277px]">
				<div class="icon">
					<img src="/icons/empty-Illustration.svg" alt="empty illustration " />
				</div>
				<div class="content">
					<div class="text flex flex-col gap-3 justify-center items-center text-grey-300">
						<h3 class="title text-3xl font-medium tracking-[-0.64px]">No primal added</h3>
						<div class="info text-center text-sm font-medium leading-5 tracking-[-0.13px]">
							You currently don’t have any primal saved, click the button below to create one
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
						<p class="text-white text-sm font-bold">Add primal</p>
					</button>
				</div>
			</div>
		</div>
	{:else if grid}
		<!-- Check if grid is false -->
		<div class="w-full grid grid-cols-3 gap-10">
			{#each $Primals as primal}
				<PrimalCard
					on:edit={(e) => toggleEditModal(e.detail)}
					{primal}
					name={primal.name}
					description={primal.description}
					{grid}
					id={primal.id}
					slug={primal.slug}
				/>
			{/each}
		</div>
	{:else}
		<!-- If grid is true, render the table -->
		<div class="border rounded-xl">
			<table class="table">
				<thead>
					<tr class="">
						<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">Primal</th>
						<th class="bg-[#F9F9F9]">Description</th>
						<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></th>
					</tr>
				</thead>

				<tbody>
					{#each $Primals as primal}
						<PrimalCard
							on:edit={(e) => toggleEditModal(e.detail)}
							{primal}
							name={primal.name}
							description={primal.description}
							{grid}
							id={primal.id}
							slug={primal.slug}
						/>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
