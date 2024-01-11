<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import PillSelector from '$lib/components/PillSelector.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import StaffMember from '$lib/components/StaffMember.svelte';
	import { container } from '$lib/stores.js';
	import { showToast, type Option } from '$lib/utils.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { onDestroy, onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	export let data;

	let { groups, access, users } = data;
	let loading: boolean = false;
	let showModal: boolean = false;
	let searching: boolean = false;
	let rolesSelected: boolean = false;
	let validationErrors: {
		email?: [string];
		last_name?: [string];
		first_name?: [string];
		password?: [string];
		password2?: [string];
		groups?: [string];
	} = {};

	const submit: SubmitFunction = async () => {
		loading = true;
		return async ({ result, update }) => {
			try {
				console.log(result);

				if (result.status === 200) {
					console.log('success', result.data);
					const inputsContainer = document.getElementById('rolesContainer');

					while (inputsContainer?.firstChild) {
						inputsContainer.removeChild(inputsContainer.firstChild);
					}
					container.update((options) => (options = []));
					showToast('Staff invited successfully', 'success');
				} else if (result.status === 400) {
					validationErrors = result.data.errors;
				} else if (result.status == 500) {
					showToast('Ooops something went wrong', 'error');
				}
			} finally {
				await update();
				loading = false;
			}
		};
	};
	const createRolesInput = (options: Option[]) => {
		const inputsContainer = document.getElementById('rolesContainer');

		while (inputsContainer?.firstChild) {
			inputsContainer.removeChild(inputsContainer.firstChild);
		}
		if (options.length > 0) {
			rolesSelected = true;
			options.forEach((option) => {
				const input = document.createElement('input');
				input.name = 'role';
				input.type = 'number';
				input.value = `${option.value}`;
				input.className = 'hidden';

				inputsContainer?.appendChild(input);
			});
		} else rolesSelected = false;
	};
	const toggleModal = () => {
		showModal = !showModal;
	};

	$: {
		if (validationErrors?.groups) {
			showToast('Please select roles to assign the staff', 'error');
		}
	}
	console.log(users);

	onMount(() => {
		// console.log(groups);

		groups = groups.map((perm) => {
			return {
				value: perm.id,
				label: perm.name
			};
		});
	});
	onDestroy(() => (groups = {}));
</script>

<svelte:head>
	<title>Staffs - Spek-n-Boonen</title>
</svelte:head>

<div class="staff-page flex-col items-start">
	<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<div class="text-[2rem] tracking-[-0.04rem]">Staff management</div>
			<sub class="text-[#6B6B6B] text-sm"> Manage employees, assign roles and tasks </sub>
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
					class="w-32 h-9 px-2.5 py-2 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
                    hover:bg-[#C7453C]
                    focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/user-plus.svg" alt="user-plus" />
					</div>
					<div class="text-white text-sm font-bold font-['Satoshi']">Invite staff</div>
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
			<tbody>
				{#each users.results as user}
					<StaffMember
						name={`${user.first_name} ${user.last_name}`}
						role="Customer service"
						email={user.email}
						permissions="dummyname@gmail.com"
					/>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<Modal on:close={() => (showModal = !showModal)} {showModal}>
	<form
		action="?/invite_staff"
		method="post"
		use:enhance={submit}
		class="max-w-2xl w-[500px] rounded-md bg-white px-5 py-10 flex flex-col gap-10 items-start justify-center"
		slot="modal-content"
	>
		<section class="flex items-center justify-between w-full">
			<h3 class="text-lg font-medium font-satoshi">Invite a user</h3>
			<button
				disabled={loading}
				class="bg-primary-red p-2.5 rounded-md text-white text-xs py-2 px-4 flex items-center font-bold font-satoshi"
			>
				{#if loading}
					<iconify-icon icon="line-md:loading-twotone-loop" width="20"></iconify-icon>
				{:else}
					Send invite
				{/if}
			</button>
		</section>

		<div class="form-group flex flex-col gap-10 items-start justify-center w-full">
			<div class="flex gap-4 justify-between items-center w-full">
				<div class="form-item w-full flex flex-col">
					<label for="first-name" class="text-sm hidden font-medium font-satoshi">First name</label>
					<input
						type="text"
						name="first-name"
						disabled={loading}
						id="first-name"
						placeholder="First name"
						class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
					/>
					{#if validationErrors?.first_name}
						<sub transition:slide={{ delay: 250, duration: 300 }} class="text-rose-500 text-xs"
							>{validationErrors.first_name[0]}</sub
						>
					{/if}
				</div>
				<div class="form-item w-full flex flex-col">
					<label for="last-name" class="text-sm hidden font-medium font-satoshi">Last name</label>
					<input
						type="text"
						name="last-name"
						id="last-name"
						disabled={loading}
						placeholder="Last name"
						class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
					/>
					{#if validationErrors?.last_name}
						<sub transition:slide={{ delay: 250, duration: 300 }} class="text-rose-500 text-xs"
							>{validationErrors.last_name[0]}</sub
						>
					{/if}
				</div>
			</div>
			<div class="flex w-full flex-col items-start gap-8">
				<div class="form-item w-full flex flex-col gap-1">
					<label for="email" class="text-sm hidden font-medium font-satoshi">Email</label>
					<input
						type="text"
						name="email"
						id="email"
						placeholder="Email"
						disabled={loading}
						class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
					/>
					{#if validationErrors?.email}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email[0]}</sub
						>
					{/if}
				</div>

				<div class="flex flex-col gap-3 w-full">
					<p class="text-sm font-medium font-satoshi mb-2">Select user role</p>
					<SearchInput
						placeholder="Search roles"
						token={access}
						{loading}
						endpoint="staffs"
						on:searched={(e) => (groups = e.detail.results)}
						on:searching={(e) => (searching = e.detail)}
					/>
					{#if searching}
						<div class="flex item-center justify-center min-w-full text-primary-100 py-5">
							<iconify-icon icon="line-md:loading-twotone-loop" width="30"></iconify-icon>
						</div>
					{:else}
						<PillSelector on:selected={(e) => createRolesInput(e.detail)} options={groups} />
						<div class="hidden" id="rolesContainer"></div>
					{/if}
				</div>
			</div>
			<div class="flex flex-col gap-4 justify-between items-center w-full">
				<div class="form-item w-full flex flex-col gap-1">
					<label for="password" class="text-sm hidden font-medium font-satoshi">Password</label>
					<input
						type="password"
						name="password"
						id="password"
						disabled={loading}
						placeholder="Password"
						class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
					/>
					{#if validationErrors?.password}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]"
							>{validationErrors.password[0]}</sub
						>
					{/if}
				</div>
				<div class="form-item w-full flex flex-col gap-1">
					<label for="confirm-password" class="text-sm hidden font-medium font-satoshi"
						>Confirm password</label
					>
					<input
						type="password"
						name="confirm-password"
						id="confirm-password"
						disabled={loading}
						placeholder="Confirm password"
						class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
					/>
					{#if validationErrors?.password2}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]"
							>{validationErrors.password2[0]}</sub
						>
					{/if}
				</div>
			</div>
		</div>
	</form>
</Modal>
