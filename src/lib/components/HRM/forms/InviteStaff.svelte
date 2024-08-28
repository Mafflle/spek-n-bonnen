<script lang="ts">
	import Pill from '$lib/components/Pill.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import PillSelector from '$lib/components/PillSelector.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import { slide } from 'svelte/transition';
	import { ManagersAssigned, Users, type User } from '$lib/user.js';
	import { container } from '$lib/stores.js';

	import { KeyIcon, LogIn, User } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	import { generatePassword, showToast } from '$lib/utils.js';
	import HRMSelector from './HRMSelector.svelte';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	export let groups;
	export let access;
	export let staffManagers;

	console.log(staffManagers);

	let currInputType = 'password';
	let currStaff;
	let openManagerModal: boolean = false;
	let searching: boolean = false;

	let showModal: boolean = false;

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

	const dispatch = createEventDispatcher();
	const toggleModal = () => {
		dispatch('close');
	};

	let loading: boolean = false;
	let validationErrors: {
		email?: [string];
		last_name?: [string];
		first_name?: [string];
		password?: [string];
		password2?: [string];
		groups?: [string];
	} = {};

	const submit: SubmitFunction = async ({ formData }) => {
		loading = true;

		$container.forEach((item) => formData.append('role', `${item.id}`));
		$ManagersAssigned.forEach((manager) => formData.append('assigned_manager', `${manager?.id}`));
		formData.append('is_manager', `${is_manager}`);

		return async ({ result, update }) => {
			try {
				// console.log(result);

				if (result.status === 200) {
					container.set([]);

					if (result.data && result.data.invitedStaff) {
						console.log(result.data.invitedStaff);
						let staff = result.data.invitedStaff;
						Users.update((state) => [...state, staff]);
					}
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

	let generating: boolean = false;
	let is_manager: boolean = false;
</script>

<form
	action="?/invite_staff"
	method="post"
	use:enhance={submit}
	class="w-full max-xsm:pb-4 pb-6 flex flex-col gap-5 items-start justify-between bg-white rounded-lg"
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
						on:click={toggleModal}
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
								class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.password}</sub
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
						searchEndpoint="groups"
						on:searched={(e) => console.log(e.detail)}
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
				<div class="flex flex-col gap-1 w-full mt-4">
					<label for="is_manager" class="text-sm mb-1 font-medium font-satoshi">Is manager</label>
					<Switch bind:checked={is_manager} class="bg-primary-100" />
				</div>
				<div class="flex flex-col gap-1 w-full mt-4">
					<label for="managers" class="text-sm mb-1 font-medium font-satoshi">Assign manager</label>
					<HRMSelector users={staffManagers} access={$page.data.access} endpoint="/staffs" />
					<div class="flex flex-wrap items-center w-full mt-4 gap-2">
						{#each $ManagersAssigned as assigned}
							<Pill selected={true} mute={true} option={assigned} />
						{/each}
					</div>
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
