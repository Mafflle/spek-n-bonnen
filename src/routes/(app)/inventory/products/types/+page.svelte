<script lang="ts">
	import CustomTable from '$lib/components/customs/CustomTable.svelte';
	import { productTypes } from '$lib/stores/product.stores.js';
	import Modal from '$lib/components/Modal.svelte';
	import { writable } from 'svelte/store';
	import ProductTypeRow from '$lib/components/customs/ProductTypeRow.svelte';
	import { ProductTypes } from '$lib/stores.js';

	export let data;
	console.log('data', data);
	const currentType = writable(null);
	ProductTypes.set(data.types.results);

	let showCreate: boolean = false;
	function toggleCreate() {
		currentType.set(null);
		showCreate = !showCreate;
	}

	function handleModalClose(event) {
		showCreate = false;
	}

	const types = data.types.results;
	let tableProps = {
		columns: [{ name: 'Product name' }, { name: 'Product type id' }, { name: 'Status' }],
		RowComponent: ProductTypeRow
	};
</script>

<div class="roles-page flex-col items-start w-full max-w-full lg:p-0 md:p-4">
	<div class="manage w-full flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers w-full flex flex-col items-start gap-[0.25rem]">
			<div class="text-[2rem] tracking-[-0.04rem] font-bold">Product types</div>
			<sub class="text-[#6B6B6B] text-sm"> Create, edit, and manage product types. </sub>
		</div>
		<div class="filters flex items-center w-full justify-between">
			<div class="filter-buttons flex items-start gap-5">
				<a
					href="/inventory/products/manage/type"
					class=" px-2.5 py-2 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
                        hover:bg-[#C7453C]
                        focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/plus.svg" alt="plus icon" />
					</div>
					<span class="text-white text-sm font-bold hidden sm:block"> Create type </span>
				</a>
			</div>
		</div>
	</div>

	<div class="w-full">
		<CustomTable rowsData={$ProductTypes} props={tableProps} />
	</div>
</div>

<!-- <Modal showModal={showCreate} on:close={handleModalClose} mode="sheet"> -->
<!-- <ManageRoles
		currRoleId={$currentType?.id}
		editRole={$currentType}
		{data}
		on:toggleEdit={handleModalClose}
		on:close={handleModalClose}
		slot="modal-content"
	/> -->
<!-- </Modal> -->
