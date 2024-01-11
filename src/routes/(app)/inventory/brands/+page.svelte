<script lang="ts">
	import Brand from '$lib/components/Brand.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import UploadBox from '$lib/components/UploadBox.svelte';
	let showModal = false;
	let loading = false;
	let grid = false;
	function toggleModal() {
		showModal = !showModal;
	}
	function monthsAgo(date: Date) {
		const now = new Date();
		const givenDate = new Date(date);
		const months =
			now.getMonth() - givenDate.getMonth() + 12 * (now.getFullYear() - givenDate.getFullYear());
		return months;
	}
	let brands: { name: string; date: Date }[] = [
		{ name: 'Brand 1', date: new Date('2023-12-01T00:00:00.000Z') },
		{ name: 'Brand 2', date: new Date('2021-08-01T00:00:00.000Z') },
		{ name: 'Brand 3', date: new Date('2021-08-01T00:00:00.000Z') },
		{ name: 'Brand 4', date: new Date('2020-08-01T00:00:00.000Z') },
		{ name: 'Brand 5', date: new Date('2021-08-01T00:00:00.000Z') },
		{ name: 'Brand 6', date: new Date('2018-08-01T00:00:00.000Z') },
		{ name: 'Brand 7', date: new Date('2021-08-01T00:00:00.000Z') }
	];
</script>

<Modal {showModal} on:close={toggleModal}>
	<div slot="modal-content">
		<!-- Your modal content goes here -->
		<form
			action="?/create"
			method="post"
			class="w-[460px] flex flex-col items-center p-6 gap-8 bg-white rounded-md"
			enctype="multipart/form-data"
		>
			<div class="modal-title flex items-center gap-3 self-stretch">
				<div class="title-text flex-[1 0 0] text-lg font-medium tracking-[-0.18px] w-11/12">
					Add brand
				</div>
				<button class="close-button flex justify-center items-center w-1/12" on:click={toggleModal}>
					<img src="/icons/close.svg" alt="close icon" />
				</button>
			</div>
			<UploadBox inputName="brand-image" maximumImages={1} />
			<div class="modal-input">
				<input
					type="text"
					name="brand-name"
					id="brand-name"
					placeholder="Brand name"
					class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
			</div>
			<div class="modal-submit">
				<button
					class="bg-primary-50 py-[0.88rem] px-[0.63rem] rounded-[8px] w-full md:w-[25rem]
					hover:bg-[#C7453C] hover:rounded-[0.625rem]
					focus:shadow-custom text-white font-bold text-sm max-h-12 flex items-center justify-center
					"
					type="submit"
				>
					{#if loading}
						<iconify-icon width="35" icon="eos-icons:three-dots-loading"></iconify-icon>
					{:else}
						<span class="button-text">Add brand </span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</Modal>
<div class="page h-full w-full">
	<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<h2 class="text-[2rem] tracking-[-0.04rem]">Brand</h2>
			<sub class="text-[#6B6B6B] text-sm"> Providers / Brands</sub>
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
				<input
					type="text"
					placeholder="Search for staffs..."
					class=" py-2 flex-auto outline-none"
				/>
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
						<img src="/icons/plus.svg" alt="brand-plus" />
					</div>
					<div class="text-white text-sm font-bold font-['Satoshi']">Add brand</div>
				</button>
			</div>
		</div>
	</div>
	<!-- render if page is empty -->
	{#if brands.length === 0}
		<!-- ... -->
	{:else if grid}
		<!-- Check if grid is false -->
		<div class="w-full grid grid-cols-3 gap-10">
			{#each brands as brand}
				<Brand name={brand.name} date={monthsAgo(brand.date).toString()} {grid} />
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
					{#each brands as brand}
						<Brand
							name={brand.name}
							date={new Date(brand.date).toLocaleDateString('en-US', {
								month: '2-digit',
								day: '2-digit',
								year: '2-digit'
							})}
							{grid}
						/>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
