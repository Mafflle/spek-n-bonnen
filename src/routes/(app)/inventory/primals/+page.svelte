<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import Modal from '$lib/components/Modal.svelte';
	import PrimalCard from '$lib/components/PrimalCard.svelte';
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Primals, type Primal, currentProvider } from '$lib/stores.js';

	import { showToast } from '$lib/utils.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	import { Separator } from '$lib/components/ui/separator';

	export let data;

	currentProvider.set(null);
	// console.log(Primals);
	let { primals } = data;
	// console.log(primals.results); // Add this line to debug
	Primals.set(primals.results);

	console.log($Primals);

	let showModal = false;
	let loading = false;
	let grid = false;
	let disabled = false;
	let validationErrors: { name?: [string]; description?: [string]; reorder_point?: [string] };
	let description: string = '';
	let descriptionContainer: HTMLElement;
	let currPrimalReorderPoint: number;
	let currPrimal: Primal | null;
	let showPrimalInfo: boolean = false;

	function toggleModal() {
		showModal = !showModal;
	}

	let currentPrimalName: string;

	const toggleEditModal = (primal?: Primal) => {
		if (primal && !$currentProvider) {
			currentProvider.set(primal);
			currentPrimalName = $currentProvider?.name;
			description = $currentProvider?.description;
			currPrimalReorderPoint = $currentProvider?.reorder_point;
		} else {
			currentPrimalName = '';
			description = '';
			currentProvider.set(null);
		}
		toggleModal();
	};
	const submit: SubmitFunction = async ({ formData }) => {
		loading = true;
		if ($currentProvider) {
			formData.append('primalToEdit', `${$currentProvider?.slug}`);
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
						showToast('Primal edited successfully', 'success');
					} else {
						// console.log(result.data);
						Primals.set([result.data.newPrimal, ...$Primals]);
						showToast('Primal added successfully', 'success');
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
	const showInfo = (primal: Primal) => {
		currPrimal = primal;
		showPrimalInfo = true;
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

	const toggleMore = (e) => {
		if (descriptionContainer.style.height === 'auto') {
			descriptionContainer.style.height = '72px';
			e.target.textContent = 'More';
		} else {
			descriptionContainer.style.height = 'auto';
			e.target.textContent = 'Less';
		}
	};

	const unsubscribe = currentProvider.subscribe((curr) => curr);
	onDestroy(() => {
		currentProvider.set(null);
		unsubscribe;
	});
	let searching = false;

	const searchPrimals: SubmitFunction = ({ formData }) => {
		console.log('searching', formData);
		searching = true;
		return async ({ result, update, error }) => {
			if (error) {
				console.error('Error occurred during search:', error);
				searching = false;
				return;
			}

			console.log('search', result);
			console.log('search result', result.data.primals.results);
			primals = result.data.primals.results; // Update primals array
			Primals.set(primals);
			searching = false;
		};
	};

	let form: HTMLFormElement;

	const submitSearch = () => {
		form.requestSubmit();
	};
</script>

<svelte:head>
	<title>Primals - Spek-n-Boonen</title>
</svelte:head>
<!-- add primal modal -->
<Modal {showModal} on:close={() => toggleEditModal()}>
	<div slot="modal-content" class="w-full min-w-[500px]">
		<!-- Your modal content goes here -->
		<form
			action="?/manage-primal"
			method="post"
			class="w-full min-w-[500px] flex flex-col items-center py-4 gap-4 bg-white rounded-md"
			use:enhance={submit}
		>
			<div class="modal-title px-6 flex items-center gap-3 self-stretch">
				<h3
					class="title-text flex-[1 0 0] text-lg font-satoshi font-medium tracking-[-0.18px] w-full"
				>
					{$currentProvider?.slug ? 'Edit' : 'Fill the form below to add'} primal
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
				<div class="modal-input flex flex-col gap-1 w-full">
					<label for="primal-name" class="font-satoshi font-medium text-sm">Name</label>
					<input
						type="text"
						name="primal-name"
						id="primal-name"
						placeholder="Enter primal name"
						bind:value={currentPrimalName}
						class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.name}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.name}</sub
						>
					{/if}
				</div>
				<div class="modal-input flex flex-col gap-1 w-full">
					<label for="reorder-point" class="font-satoshi font-medium text-sm">Reorder point</label>
					<input
						type="number"
						name="reorder-point"
						id="reorder-point"
						placeholder="Enter reorder point (kg)"
						bind:value={currPrimalReorderPoint}
						class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.reorder_point}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]"
							>{validationErrors.reorder_point}</sub
						>
					{/if}
				</div>
				<div class="modal-input flex flex-col gap-1 w-full">
					<label for="primal-description" class="font-satoshi font-medium text-sm"
						>Description</label
					>
					<Textarea
						name="primal-description"
						id="primal-description"
						placeholder="Enter description (optional)"
						bind:value={description}
						class="input w-full  focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.description}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]"
							>{validationErrors.description}</sub
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
						{disabled}
					>
						{#if loading}
							<iconify-icon width="35" icon="eos-icons:three-dots-loading"></iconify-icon>
						{:else}
							<span class="button-text">{$currentProvider?.slug ? 'Edit' : 'Add'} primal </span>
						{/if}
					</button>
				</div>
			</div>
		</form>
	</div>
</Modal>

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
{:else}
	<div class="page h-full w-full">
		<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
			<div class="headers flex flex-col items-start gap-[0.25rem]">
				<div class="text-[2rem] tracking-[-0.04rem] font-bold">Primals</div>
				<sub class="text-[#6B6B6B] text-sm"> Inventory / Primals / Manage</sub>
			</div>
			<div class="filters flex items-center w-full justify-between">
				<div
					class="flex items-center md:w-[24em] border gap-2 rounded-md border-[#D9D9D9] text-[#232222] px-2"
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

				<div class="filter-buttons flex items-start gap-1.5 md:gap-5">
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
							>Add primal</span
						>
					</button>
				</div>
			</div>
		</div>
		<!-- render if page is empty -->

		{#if grid}
			<!-- Check if grid is false -->
			<div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
				{#each $Primals as primal}
					<PrimalCard
						on:edit={(e) => toggleEditModal(e.detail)}
						on:view={(e) => showInfo(e.detail.primal)}
						{primal}
						{grid}
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
							<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">Name</th>
							<th class="bg-[#F9F9F9]">Re-order point</th>

							<th class="bg-[#F9F9F9]">Description</th>
							<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></th>
						</tr>
					</thead>

					<tbody>
						{#each $Primals as primal}
							<PrimalCard
								on:edit={(e) => toggleEditModal(e.detail)}
								on:view={(e) => showInfo(e.detail.primal)}
								{primal}
								{grid}
								slug={primal.slug}
							/>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
{/if}
<Modal
	on:close={() => {
		showPrimalInfo = false;
		currPrimal = null;
	}}
	showModal={showPrimalInfo}
>
	<div slot="modal-content" class="flex flex-col w-full max-w-xl">
		<section class="w-full border-b px-4 py-3">
			<h3 class="font-satoshi font-medium text-lg">More information</h3>
		</section>
		<section
			class="  flex flex-col md:flex-row md:justify-between items-start justify-center text-sm w-full"
		>
			<!-- More Details -->
			<section class=" flex-auto flex flex-col items-start h-full w-full py-5">
				<div class="mb-8 md:px-5 flex flex-col gap-4 font-satoshi text-sm w-full">
					<div class="w-full grid grid-cols-2">
						<p class="block text-grey-200 text-sm">Name :</p>

						<p>{currPrimal?.name}</p>
					</div>

					<div class="w-full grid grid-cols-2">
						<p class="text-grey-200">Reorder point :</p>

						<p>{currPrimal?.reorder_point}kg</p>
					</div>
					<div class="w-full grid grid-cols-2">
						<p class="block text-grey-200 text-sm">Description :</p>
						<div class="flex flex-col items-start">
							<p
								bind:this={descriptionContainer}
								class="text-base transition-all h-[72px] overflow-hidden"
							>
								{currPrimal?.description}
							</p>
							<button
								on:click={(e) => toggleMore(e)}
								class="text-sm text-green-300 self-end mr-5 underline">More</button
							>
						</div>
					</div>
					<!-- <div class="labels w-full">
						<p class="block text-grey-200">Name :</p>

						<p class="block text-grey-200 text-sm">Description :</p>

						<p class="text-grey-200">Slug :</p>
					</div>
					<div class="labels w-full">
						<p>{currPrimal?.name}</p>
						<p>{currPrimal?.description}</p>
						<p>{currPrimal?.slug}</p>
					</div> -->
				</div>
			</section>
			<!-- More Details -->
		</section>
	</div>
</Modal>
