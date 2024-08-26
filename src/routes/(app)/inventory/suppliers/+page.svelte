<script lang="ts">
	import CustomTable from '$lib/components/customs/CustomTable.svelte';
	import ManageSupplier from '$lib/components/customs/ManageSupplier.form.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import SupplierRow from '$lib/components/SupplierRow.svelte';
	import { Suppliers, currentSupplier, type Supplier } from '$lib/stores/suppliers.stores.js';

	export let data;

	let { allProviders } = data;
	Suppliers.set(allProviders.results);

	let showProviderModal = false;

	function toggleEditModal(param?: Supplier) {
		if (param) {
			currentSupplier.set(param);
		} else {
			currentSupplier.set(null);
		}

		toggleModal();
	}
	function toggleModal() {
		showProviderModal = !showProviderModal;
	}

	let tableColumns = [
		{ name: 'Logo' },
		{ name: 'Company' },
		{ name: 'Contact' },
		{ name: 'Email' },
		{ name: 'Phone' },
		{ name: 'Address' },
		{ name: '' }
	];
	let tableProps = {
		columns: tableColumns,
		RowComponent: SupplierRow
	};
</script>

<svelte:head>
	<title>{$currentSupplier ? `Edit ${$currentSupplier.id}` : 'Provider'} - Spek-n-Boonen</title>
</svelte:head>

{#if $Suppliers.length < 1}
	<div class="empty h-full w-full flex justify-center items-center">
		<div class="empty-indicator flex flex-col justify-center items-center gap-5 w-[277px]">
			<div class="icon">
				<img src="/icons/empty-Illustration.svg" alt="empty illustration " />
			</div>
			<div class="content">
				<div class="text flex flex-col gap-3 justify-center items-center text-grey-300">
					<h3 class="title text-3xl font-medium tracking-[-0.64px]">No Supplier added</h3>
					<div class="info text-center text-sm font-medium leading-5 tracking-[-0.13px]">
						You currently don’t have any supplier saved, click the button below to create one
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
					<p class="text-white text-sm font-bold">Add supplier</p>
				</button>
			</div>
		</div>
	</div>
{:else}
	<div class="page h-full w-full">
		<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
			<div class="headers flex flex-col items-start gap-[0.25rem]">
				<div class="text-[2rem] tracking-[-0.04rem] font-bold">Suppliers</div>
				<sub class="text-[#6B6B6B] text-sm"> Inventory / Suppliers / Manage</sub>
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
					<input type="text" placeholder="Search...." class=" py-2 flex-auto outline-none" />
				</div>
				<button
					on:click={toggleModal}
					class=" px-2.5 py-2.5 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
			hover:bg-[#C7453C]
			focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/plus.svg" alt="user-plus" />
					</div>
					<p class="text-white text-sm font-bold hidden sm:block">Add supplier</p>
				</button>
			</div>
		</div>
		<CustomTable
			props={tableProps}
			rowsData={$Suppliers}
			on:toggleEdit={(e) => toggleEditModal(e.detail)}
		/>
	</div>
{/if}

<Modal showModal={showProviderModal} on:close={() => toggleEditModal()} mode="sheet">
	<ManageSupplier slot="modal-content" on:close={() => toggleEditModal()} />
</Modal>

<style>
</style>
