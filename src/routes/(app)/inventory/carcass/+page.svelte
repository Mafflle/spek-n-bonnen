<script lang="ts">
	import { Carcasses } from '$lib/stores/carcass.stores';
	import Carcass from '$lib/components/Carcass.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { currentUser, getCurrentUser } from '$lib/user.js';
	import CarcassInfo from '$lib/components/CarcassInfo.svelte';

	export let data;
	console.log('paged', data.carcasses);
	let grid = false;
	Carcasses.set(data.carcasses.results);
	$: console.log($Carcasses);
	const handleDelete = ({ detail: carcass }) => {
		// Perform deletion here
		Carcasses.update((carcasses) => carcasses.filter((c) => c.id !== carcass.id));
	};

	let selectedCarcass: any;

	let showModal = false;
	const toggleModal = ({ detail: carcass }) => {
		console.log('selected', carcass);
		// Add parameter here
		selectedCarcass = carcass; // Add this line
		showModal = !showModal;
	};
</script>

<svelte:head>
	<title>Carcass - Spek-N-Boonen</title>
</svelte:head>

<Modal {showModal} on:close={() => (showModal = false)}>
	<div slot="modal-content" class="w-[90vw]">
		<CarcassInfo carcass={selectedCarcass} />
		<!-- Update this line -->
	</div>
</Modal>
<div class="w-full overflow-x-hidden">
	<div>
		<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
			<div class="headers flex flex-col items-start gap-[0.25rem]">
				<h2 class="text-[2em] tracking-[2] font-satoshi font-bold">Carcass</h2>
				<sub class="text-[#6B6B6B] text-sm"> Providers / Carcass</sub>
			</div>
			<div class="filter-buttons flex items-start gap-2 sm:gap-5 w-full justify-between">
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
						placeholder="Search for carcass..."
						class=" py-2 flex-auto outline-none"
					/>
				</div>

				<a
					href="carcass/manage"
					class="px-3 py-2 bg-primary-100 text-sm text-white rounded-md flex items-center gap-1"
				>
					<img src="/icons/plus.svg" alt="Plus icon to represent adding" />
					<span class="hidden sm:block">Add carcass</span>
				</a>
			</div>
		</div>
	</div>
	<!-- render if page is empty -->
	{#if $Carcasses.length === 0}
		<div class="empty h-screen w-full flex justify-center items-center">
			<div class="empty-indicator flex flex-col justify-center items-center gap-5 w-[277px]">
				<div class="icon">
					<img src="/icons/empty-Illustration.svg" alt="empty illustration " />
				</div>
				<div class="content">
					<div class="text flex flex-col gap-3 justify-center items-center text-grey-300">
						<h3 class="title text-3xl font-medium tracking-[-0.64px]">No carcass added</h3>
						<div class="info text-center text-sm font-medium leading-5 tracking-[-0.13px]">
							You currently don’t have any carcass stored in your inventory, click the button below
							to add one
						</div>
					</div>
				</div>
				<div class="button">
					<a
						href="carcass/manage"
						class="px-3 py-2 bg-primary-100 text-sm text-white rounded-md flex items-center gap-1"
					>
						<img src="/icons/plus.svg" alt="Plus icon to represent adding" />
						<span class="hidden sm:block">Add carcass</span>
					</a>
				</div>
			</div>
		</div>
	{:else if grid}
		<!-- Check if grid is false -->
		<div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
			{#each $Carcasses as carcass (carcass?.id)}
				{#if carcass}
					<Carcass {carcass} />
				{/if}
			{/each}
		</div>
	{:else}
		<!-- If grid is true, render the table -->
		<div class="border rounded-xl overflow-x-scroll md:overflow-auto">
			<table class="table">
				<thead>
					<tr class="">
						<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">Name</th>
						<th class="bg-[#F9F9F9]">Vendor</th>
						<th class="bg-[#F9F9F9]">Weight</th>
						<th class="bg-[#F9F9F9]">Purchase price</th>
						<th class="bg-[#F9F9F9]">ABHD code</th>
						<th class="bg-[#F9F9F9]">Date Recieved</th>
						<th class="bg-[#F9F9F9]">Fat Score</th>
						<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></th>
					</tr>
				</thead>

				<tbody>
					{#each $Carcasses as carcass (carcass?.id)}
						{#if carcass}
							<Carcass {carcass} on:delete={handleDelete} on:moreinfo={toggleModal} />
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
