<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import PillSelector from '$lib/components/PillSelector.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import User from '$lib/components/User.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import { container } from '$lib/stores.js';
	import { Users } from '$lib/user.js';
	import { generatePassword, showToast } from '$lib/utils.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { KeyIcon } from 'lucide-svelte';
	import { onDestroy, onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	export let data;

	let { groups, access, users } = data;
	let loading: boolean = false;
	let showModal: boolean = true;
	let searching: boolean = false;
	let validationErrors: {
		email?: [string];
		last_name?: [string];
		first_name?: [string];
		password?: [string];
		password2?: [string];
		groups?: [string];
	} = {};

	let generating: boolean = false;

	// console.log(users);
	$Users = users.results;

	const submit: SubmitFunction = async ({ formData }) => {
		loading = true;
		$container.forEach((item) => formData.append('role', `${item.value}`));
		console.log(formData.getAll('role'));

		return async ({ result, update }) => {
			try {
				console.log(result);

				if (result.status === 200) {
					container.set([]);
					$Users = [result.data.invitedStaff, ...$Users];
					showToast('Staff invited successfully', 'success');
					toggleModal();
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

	const toggleModal = () => {
		showModal = !showModal;
	};

	$: {
		if (validationErrors?.groups) {
			showToast('Please select roles to assign the staff', 'error');
		}
	}

	let currInputType = 'password';

	const toggleInputType = () => {
		if (currInputType === 'password') {
			document.querySelectorAll('#password, #confirm-password').forEach((input) => {
				input.type = 'text';
			});
			currInputType = 'text';
		} else {
			document.querySelectorAll('#password, #confirm-password').forEach((input) => {
				input.type = 'password';
			});
			currInputType = 'password';
		}
	};

	const usePassword = () => {
		generating = true;
		const password = generatePassword(9);
		console.log(password);
		document.querySelectorAll('#password, #confirm-password').forEach((input) => {
			input.value = password;
		});
		generating = false;
		currInputType = 'text';
	};

	let currStaff;

	onDestroy(() => {
		container.set([]);
	});
</script>

<svelte:head>
	<title>Staffs - Spek-n-Boonen</title>
</svelte:head>

<div class="staff-page flex-col items-start w-full max-w-full lg:p-0 md:p-4">
	<div class="manage w-full flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers w-full flex flex-col items-start gap-[0.25rem]">
			<div class="text-[2rem] tracking-[-0.04rem] font-bold">Staff management</div>
			<sub class="text-[#6B6B6B] text-sm"> Manage employees, assign roles and tasks </sub>
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

			<div class="filter-buttons flex items-start gap-5">
				<button
					on:click={toggleModal}
					class=" px-2.5 py-2 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
                    hover:bg-[#C7453C]
                    focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/plus.svg" alt="user-plus" />
					</div>
					<span class="text-white text-sm font-bold font-satoshi hidden sm:block"
						>Invite new user</span
					>
				</button>
			</div>
		</div>
	</div>

	<div class="border rounded-xl w-full max-w-full overflow-x-scroll no-scrollbar">
		<table class="table">
			<thead>
				<tr class="">
					<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">Name</th>
					<th class="bg-[#F9F9F9]">Email</th>
					<th class="bg-[#F9F9F9]">Role</th>
					<th class="bg-[#F9F9F9]">Date</th>
					<th class="bg-[#F9F9F9]">Status</th>

					<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></th>
				</tr>
			</thead>
			<tbody>
				{#each $Users as user}
					{#if user.is_staff}
						<User {user} />
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
</div>

<Modal mode="sheet" on:close={toggleModal} {showModal}>
	<form
		action="?/invite_staff"
		method="post"
		use:enhance={submit}
		class="w-full max-xsm:pb-4 pb-6 max-h-full overflow-x-scroll no-scrollbar flex flex-col gap-5 items-start justify-between bg-white rounded-lg"
		slot="modal-content"
	>
		<section class="md:h-full w-full">
			<div
				class="flex w-full sticky bg-white top-0 h-16 max-xsm:py-2 z-30 items-center justify-center mb-5"
			>
				<Sheet.Header
					is="text"
					class="flex flex-col h-full items-center justify-center w-full   z-10  "
				>
					<div class="w-full h-full px-3 flex flex-row justify-between items-center">
						<Sheet.Title
							class="flex items-center gap-2 text-primary-50 font-poppins font-semibold text-lg mr-auto"
						>
							<img src="/icons/UserWithEclipse.svg" alt="user icon " />
							<span>
								<!-- {currRoleId ? 'Edit' : 'Create'}  -->
								Invite User</span
							>
						</Sheet.Title>
						<button
							type="button"
							class="bg-[#F2F2F2] border border-[#E0E0E0] flex items-center rounded-full p-0.5"
						>
							<img src="/icons/close.svg" alt="close icon" />
						</button>
					</div>
					<Separator />
				</Sheet.Header>
			</div>
			<div class="form-group py-6 flex flex-col gap-10 items-start justify-center w-full px-4">
				<span class="font-satoshi text-sm">Kindly input user details and select user role</span>
				<section class="w-full px-3 flex flex-col gap-5">
					<div class="form-item w-full flex flex-col gap-1">
						<label for="email" class="text-sm mb-1 font-medium font-satoshi">Email</label>
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
					<div class="flex flex-col gap-4 justify-between items-center w-full">
						<div class="form-item w-full flex flex-col gap-1">
							<label for="password" class="text-sm mb-1 font-medium font-satoshi"
								>Create user password</label
							>
							<div class="w-full relative flex items-center px-0">
								<input
									type={currInputType}
									name="password"
									id="password"
									placeholder="Enter your password"
									class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9]"
								/>
								<button
									type="button"
									on:click={toggleInputType}
									class="absolute right-1 flex items-center cursor-pointer z-10 w-max p-2"
								>
									<span class={currInputType === 'password' ? 'flex items-center' : 'hidden'}>
										<iconify-icon icon="carbon:view" width="20"></iconify-icon>
									</span>
									<span class={currInputType === 'text' ? ' flex items-center' : 'hidden'}>
										<iconify-icon icon="carbon:view-off" width="20" class=""></iconify-icon>
									</span>
								</button>
							</div>
							{#if validationErrors?.password}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]"
									>{validationErrors.password}</sub
								>
							{/if}
						</div>

						<div class="form-item w-full flex flex-col gap-1">
							<label for="confirm-password" class="text-sm mb-1 font-medium font-satoshi"
								>Confirm password</label
							>
							<div class="w-full relative flex items-center px-0">
								<input
									type={currInputType}
									name="confirm-password"
									id="confirm-password"
									placeholder="Confirm your password"
									class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9]"
								/>
								<button
									type="button"
									on:click={toggleInputType}
									class="absolute right-1 flex items-center cursor-pointer z-10 w-max p-2"
								>
									<span class={currInputType === 'password' ? 'flex items-center' : 'hidden'}>
										<iconify-icon icon="carbon:view" width="20"></iconify-icon>
									</span>
									<span class={currInputType === 'text' ? ' flex items-center' : 'hidden'}>
										<iconify-icon icon="carbon:view-off" width="20" class=""></iconify-icon>
									</span>
								</button>
							</div>
							{#if validationErrors?.password2}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]"
									>{validationErrors.password2}</sub
								>
							{/if}
						</div>
						<div class="flex w-full">
							<button
								type="button"
								disabled={generating}
								on:click={() => usePassword()}
								class="rounded-md text-secondary-green text-sm flex items-center font-satoshi"
							>
								{#if generating}
									<iconify-icon icon="line-md:loading-twotone-loop" width="20"></iconify-icon>
								{:else}
									<div class="flex items-center gap-1">
										<KeyIcon size="18" />
										<span>Generate Password</span>
									</div>
								{/if}
							</button>
						</div>
					</div>
					<div class="flex flex-col gap-3 w-full mt-4">
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
							<div class="max-w-full">
								<PillSelector options={groups.results} />
							</div>
							<div class="hidden" id="rolesContainer"></div>
						{/if}
					</div>
					<div class="form-item w-full flex flex-col gap-1">
						<label for="work_hours" class="text-sm mb-1 font-medium font-satoshi"
							>Set weekly work hours</label
						>
						<input
							type="number"
							name="work_hours"
							id="work_hours"
							placeholder="Set weekly work hours"
							disabled={loading}
							class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
						/>
						<!-- {#if validationErrors?.email}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email[0]}</sub
							>
						{/if} -->
					</div>
					<div class="form-item w-full flex flex-col gap-1">
						<label for="date" class="text-sm mb-1 font-medium font-satoshi">Date Hired</label>
						<input
							type="date"
							name="date"
							id="date"
							placeholder="Select date"
							disabled={loading}
							class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
						/>
						<!-- {#if validationErrors?.email}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email[0]}</sub
							>
						{/if} -->
					</div>
				</section>
			</div>
		</section>
		<Sheet.Footer class="w-full  px-3 self-end">
			<div class="w-full px-4">
				<Button
					disabled={loading}
					type="submit"
					class="flex w-full bg-primary-red gap-2 items-center font-satoshi text-sm font-bold text-white py-2.5 px-3 rounded-md hover:bg-primary-100"
				>
					{#if loading}
						<iconify-icon width="25" icon="eos-icons:three-dots-loading"></iconify-icon>
					{:else if currStaff}
						<span>Proceed</span>
						<iconify-icon icon="ep:right" width="15"></iconify-icon>
					{:else}
						<span> Send Invite </span>

						<iconify-icon icon="ep:right" width="15"></iconify-icon>
					{/if}
				</Button>
			</div>
		</Sheet.Footer>
	</form>
</Modal>
