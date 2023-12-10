<script lang="ts">
	import { browser } from '$app/environment';
	import Modal from '$lib/components/Modal.svelte';
	import PillSelector from '$lib/components/PillSelector.svelte';
	import Selector from '$lib/components/Selector.svelte';
	import StaffMember from '$lib/components/StaffMember.svelte';
	import { client, debounce } from '$lib/utils.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	export let data;
	let { roles, permissions } = data;

	let showModal: boolean = true;

	let searching: boolean = false;
	const toggleModal = () => {
		showModal = !showModal;
	};

	const defaulPermissions = permissions;

	const searchPermissions = debounce(async (search: string) => {
		searching = true;
		try {
			const res = await fetch(`roles?search=${search}`, {
				headers: { access: `${data.access}` }
			});

			if (res.ok) {
				const filteredPermissions = await res.json();

				permissions = filteredPermissions;
			} else {
			}
		} finally {
			searching = false;
		}
	}, 700);

	// onMount(async () => {
	// 	submit();
	// });
</script>

<svelte:head>
	<title>Roles - Spek-n-Boonen</title>
</svelte:head>

<div class="staff-page flex-col items-start">
	<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<h1 class="text-[2rem] tracking-[-0.04rem]">Role management</h1>
			<sub class="text-[#6B6B6B] text-sm"> Create roles, delete and update roles</sub>
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
					on:click={toggleModal}
					class=" px-2.5 py-2.5 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
                    hover:bg-[#C7453C]
                    focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/user-plus.svg" alt="user-plus" />
					</div>
					<p class="text-white text-sm font-bold font-['Satoshi']">Create roles</p>
				</button>
			</div>
		</div>
	</div>

	<div class="border rounded-xl">
		<table class="table">
			<thead>
				<tr class="">
					<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">Name</th>
					<th class="bg-[#F9F9F9]">Role</th>
					<th class="bg-[#F9F9F9]">Email</th>
					<th class="bg-[#F9F9F9]">Permissions</th>
					<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></th>
				</tr>
			</thead>
			{#if roles.count > 0}
				<tbody>
					{#each { length: 8 } as user}
						<StaffMember
							name="Oluwasheyifunmi oyefeso"
							role="Customer service"
							email="dummyname@gmail.com"
							permissions="dummyname@gmail.com"
						/>
					{/each}
				</tbody>{/if}
		</table>
		{#if roles.count < 1}
			<div class="w-full py-3 flex justify-center">
				<h3 class="text-lg font-semibold text-center">No roles created yet</h3>
			</div>
		{/if}
	</div>
</div>
.

<Modal {showModal} on:close={() => (showModal = false)}>
	<div
		slot="modal-content"
		class="max-w-2xl w-full px-8 py-6 grid grid-cols-1 gap-4 bg-white rounded-lg"
	>
		<section class="flex items-center justify-between mb-5">
			<h2 class="text-xl font-medium font-satoshi text-center">Create Role</h2>
			<button type="button" class="bg-sGray text-sm py-2 px-4 rounded">Submit</button>
		</section>
		<div class="w-full flex flex-col gap-4 items-start justify-center">
			<div class="name w-full mb-5">
				<label for="name" class="block mb-2 text-[0.875rem]">Name:</label>
				<input
					type="text"
					name="name"
					id="name"
					placeholder="Enter role name"
					class="input w-full md:w-[25rem] focus:border-1 focus:border-primary-100 focus:outline-primary-100 border-[#D9D9D9] rounded-[0.5rem]"
				/>
				<!-- {#if validationErrors?.email}
              <sub
                transition:slide={{ delay: 250, duration: 300 }}
                class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
              >
            {/if} -->
			</div>
			<div class="max-w-full w-full">
				<div class="name w-full mb-5">
					<input
						type="text"
						name="search"
						id="search"
						placeholder="Search permissions"
						on:input={(e) => searchPermissions(e?.target?.value)}
						class="w-full px-2 focus:border-primary-100 focus:outline-none border-[#D9D9D9] border-b"
					/>
					<!-- {#if validationErrors?.email}
              <sub
                transition:slide={{ delay: 250, duration: 300 }}
                class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
              >
            {/if} -->
				</div>
				{#if searching}
					<div class="flex item-center justify-center w-full text-primary-100 py-5">
						<iconify-icon icon="line-md:loading-twotone-loop" width="30"></iconify-icon>
					</div>
				{:else if permissions.count > 0}
					<label for="name" class="block mb-2 text-[0.875rem]">Select permissions:</label>

					<PillSelector options={permissions.results} />
				{:else}
					<div class="flex item-center justify-center w-full gap-2 text-primary-100 py-5">
						<iconify-icon icon="nonicons:not-found-16" width="20"></iconify-icon>
						<p>No results found</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</Modal>
