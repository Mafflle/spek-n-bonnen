<script lang="ts">
	import { Carcasses, type CarcassType } from '$lib/stores/carcass.stores';
	import Carcass from '$lib/components/Carcass.svelte';

	import { goto } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	export let data;
	let carcasses = [];

	Carcasses.set(data.carcasses.results);

	let searching = false;

	const searchCarcass: SubmitFunction = ({ formData }) => {
		console.log('searching', formData);
		searching = true;
		return async ({ result, update, error }) => {
			if (error) {
				console.error('Error occurred during search:', error);

				return;
			}

			console.log('search', result);
			console.log('search result', result.data.carcasses.results);
			carcasses = result.data.carcasses.results; // Update carcasses array
			Carcasses.set(carcasses);
		};
	};

	let form: HTMLFormElement;

	const submitSearch = () => {
		form.requestSubmit();
	};
</script>

<svelte:head>
	<title>Carcass - Spek-N-Boonen</title>
</svelte:head>

{#if $Carcasses.length != 0}
	<div class="">
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
					<form
						method="post"
						action="?/search"
						use:enhance={searchCarcass}
						bind:this={form}
						name="search"
						id="search-carcass"
						class="w-full"
					>
						<input type="submit" class="hidden" value="submit" />
						<input
							type="text"
							placeholder="Search for carcass..."
							class="py-2 flex-auto outline-none w-full"
							name="search"
							on:input={() => {
								submitSearch();
							}}
						/>
					</form>
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
	<div class="border rounded-xl">
		<table class="table">
			<thead>
				<tr class="">
					<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">ID</th>
					<th class="bg-[#F9F9F9]">Vendor</th>
					<th class="bg-[#F9F9F9]">Weight(kg)</th>
					<th class="bg-[#F9F9F9]">Purchase price($)</th>
					<th class="bg-[#F9F9F9]">Fat Score</th>
					<th class="bg-[#F9F9F9]">Date Recieved</th>
					<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></th>
				</tr>
			</thead>

			<tbody>
				{#each $Carcasses as carcass (carcass?.id)}
					{#if carcass}
						<Carcass
							{carcass}
							on:view={(e) => showInfo(e.detail.carcass)}
							on:edit={(e) => goto(`carcass/manage?editing=${e.detail.id}`)}
						/>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
{/if}

{#if $Carcasses.length === 0 && !searching}
	<!-- Your existing empty state display -->
	<div class="empty h-full w-full flex justify-center items-center">
		<div class="empty-indicator flex flex-col justify-center items-center gap-5 w-[277px]">
			<div class="icon">
				<img src="/icons/empty-Illustration.svg" alt="empty illustration " />
			</div>
			<div class="content">
				<div class="text flex flex-col gap-3 justify-center items-center text-grey-300">
					<h3 class="title text-3xl font-medium tracking-[-0.64px]">No carcass added</h3>
					<div class="info text-center text-sm font-medium leading-5 tracking-[-0.13px]">
						You currently don’t have any carcass stored in your inventory, click the button below to
						add one
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
{:else if $Carcasses.length === 0 && searching}
	<div class="empty flex justify-center items-center py-5">
		<div class="empty-indicator flex flex-col justify-center items-center gap-5 w-[277px]">
			<!-- Customize this message to indicate no results were found -->
			<div class="content">
				<div class="text flex flex-col gap-3 justify-center items-center text-grey-300">
					<h3 class="title text-3xl font-medium tracking-[-0.64px]">No carcasses found</h3>
					<div class="info text-center text-sm font-medium leading-5 tracking-[-0.13px]">
						Your search did not match any carcasses. Please try again with different keywords.
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
