<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import Selector from '$lib/components/Selector.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { ProviderType, Providers } from '$lib/stores/providers.stores';

	const providerTypes = [
		{ value: ProviderType.Brand, label: 'Brand' },
		{ value: ProviderType.Vendor, label: 'Vendor' },
		{ value: ProviderType.ButcherShop, label: 'ButcherShop' },
		{ value: ProviderType.Farm, label: 'Farm' },
		{ value: ProviderType.Manufacturer, label: 'Manufacturer' },
		{ value: ProviderType.SlaughterHouse, label: 'SlaughterHouse' }
	];

	let toggleTypeModal = true;
	let showProviderModal = false;
	let currentProviderType: ProviderType | null = null;

	function toggleModal() {
		toggleTypeModal = !toggleTypeModal;
	}
	function toggleProviderModal() {
		if (currentProviderType) {
			showProviderModal = !showProviderModal;
		} else {
			showProviderModal = false;
		}
	}
</script>

<svelte:head>
	<title>Providers - Spek-n-Boonen</title>
</svelte:head>

{#if $Providers.length < 1}
	<div class="empty h-full w-full flex justify-center items-center">
		<div class="empty-indicator flex flex-col justify-center items-center gap-5 w-[277px]">
			<div class="icon">
				<img src="/icons/empty-Illustration.svg" alt="empty illustration " />
			</div>
			<div class="content">
				<div class="text flex flex-col gap-3 justify-center items-center text-grey-300">
					<h3 class="title text-3xl font-medium tracking-[-0.64px]">No Provider added</h3>
					<div class="info text-center text-sm font-medium leading-5 tracking-[-0.13px]">
						You currently don’t have any provider saved, click the button below to create one
					</div>
				</div>
			</div>
			<div class="button">
				<button
					on:click={toggleModal}
					class=" px-2.5 py-2.5 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
			hover:bg-[#C7453C]
			focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/plus.svg" alt="user-plus" />
					</div>
					<p class="text-white text-sm font-bold">Add provider</p>
				</button>
			</div>
		</div>
	</div>
{:else}
	<div class="page h-full w-full">
		<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
			<div class="headers flex flex-col items-start gap-[0.25rem]">
				<div class="text-[2rem] tracking-[-0.04rem] font-bold">Providers</div>
				<sub class="text-[#6B6B6B] text-sm"> Inventory / Providers / Manage</sub>
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
			</div>
		</div>
		<!-- render if page is empty -->

		<!-- If grid is true, render the table -->
		<div class="border rounded-xl">
			<table class="table">
				<thead>
					<tr class="">
						<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">Name</th>
						<th class="bg-[#F9F9F9]">Type</th>

						<th class="bg-[#F9F9F9]">Address</th>
						<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></th>
					</tr>
				</thead>

				<tbody>
					<!-- {#each  as primal}{/each} -->
				</tbody>
			</table>
		</div>
	</div>
{/if}

<Modal showModal={toggleTypeModal}>
	<div
		slot="modal-content"
		class="flex flex-col gap-6 md:p-5 w-full px-3 overflow-hidden py-5 md:min-w-[450px] rounded-2xl items-center"
	>
		<section class="w-full items-center flex justify-between mb-10">
			<h4 class="font-satoshi font-medium text-primary-red">Select Provider type</h4>
			<button
				on:click={() => {
					toggleModal();
				}}
				class="bg-[#F2F2F2] border border-[#E0E0E0] flex items-center rounded-full p-0.5"
			>
				<img src="/icons/close.svg" alt="close icon" />
			</button>
		</section>

		<div class="w-full flex mb-3">
			<div class="form-group w-full">
				<label for="provider-type">Provider type</label>
				<Selector
					on:selected={(e) => (currentProviderType = e.detail.value)}
					options={providerTypes}
					placeholder="Select provider type"
					inputName="provider-type"
				/>
			</div>
		</div>
		<div class="w-full flex items-center justify-end mb-3">
			<button
				disabled={!currentProviderType}
				class="flex gap-1 bg-primary-50 items-center text-white px-3 py-1.5 rounded"
			>
				<span>Next</span>
				<iconify-icon width="20" icon="mingcute:right-line"></iconify-icon>
			</button>
		</div>
	</div>
</Modal>
