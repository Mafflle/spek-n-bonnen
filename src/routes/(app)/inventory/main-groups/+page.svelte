<script lang="ts">
	import MainGroup from '$lib/components/MainGroup.svelte';
	import { MainGroups } from '$lib/stores';

	export let data;

	const { groups } = data;

	$MainGroups = groups.results;
</script>

<svelte:head>
	<title>Main groups - Spek-n-Boonen</title>
</svelte:head>

{#if $MainGroups.length > 0}
	<div class="">
		<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
			<div class="headers flex flex-col items-start gap-[0.25rem]">
				<h2 class="text-[2em] tracking-[2] font-satoshi font-bold">Main groups</h2>
				<sub class="text-[#6B6B6B] text-sm"> Inventory / Main groups</sub>
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
					<div class="w-full">
						<input type="submit" class="hidden" value="submit" />
						<input
							type="text"
							placeholder="Search for main group..."
							class="py-2 flex-auto outline-none w-full"
							name="search"
						/>
					</div>
				</div>

				<a
					href="carcass/manage"
					class="px-3 py-2 bg-primary-100 text-sm text-white rounded-md flex items-center gap-1"
				>
					<img src="/icons/plus.svg" alt="Plus icon to represent adding" />
					<span class="hidden sm:block">Create main group</span>
				</a>
			</div>
		</div>
		<div class="border rounded-xl">
			<table class="table">
				<thead>
					<tr class="">
						<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">Name</th>
						<th class="bg-[#F9F9F9]">Department</th>
						<th class="bg-[#F9F9F9]">Color</th>
						<th class="bg-[#F9F9F9]">VAT(%)</th>
						<th class="bg-[#F9F9F9]">Traceability</th>
						<th class="bg-[#F9F9F9]">Traceability scenario</th>
						<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></th>
					</tr>
				</thead>

				<tbody>
					{#each $MainGroups as group (group.id)}
						<MainGroup {group} />
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{:else}
	<div class="empty h-full w-full flex justify-center items-center">
		<div class="empty-indicator flex flex-col justify-center items-center gap-5 w-[300px]">
			<div class="icon">
				<img src="/icons/empty-Illustration.svg" alt="empty illustration " />
			</div>
			<div class="content">
				<div class="text flex flex-col gap-3 justify-center items-center text-grey-300">
					<h3 class="title text-3xl font-medium tracking-[-0.64px]">No main group added</h3>
					<div class="info text-center text-sm font-medium leading-5 tracking-[-0.13px]">
						You currently don’t have any main group stored in your inventory, click the button below
						to add one
					</div>
				</div>
			</div>
			<div class="button">
				<a
					href="main-groups/manage"
					class="px-3 py-2 bg-primary-100 text-sm text-white rounded-md flex items-center gap-1"
				>
					<img src="/icons/plus.svg" alt="Plus icon to represent adding" />
					<span class="hidden sm:block">Add main group</span>
				</a>
			</div>
		</div>
	</div>
{/if}
