<script lang="ts">
	import { page } from '$app/stores';
	import { getLoggedinUser, showToast, type loggedInUser, updateLoggedInUsers } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

	import { LoggedinUsers } from '$lib/stores';
	import { browser } from '$app/environment';
	import Modal from '$lib/components/Modal.svelte';
	import LoggedInUsersLIst from '$lib/components/LoggedInUsersLIst.svelte';
	import LoggedInUsersActions from '$lib/components/LoggedInUsersActions.svelte';

	let loading: boolean = false;
	if (browser) {
		if ($LoggedinUsers.length < 1) {
			let users = getLoggedinUser();
			if (users.length > 0) {
				$LoggedinUsers = users;
			}
		}
	}
	let userToLogin: loggedInUser | null;
	let showModal: boolean = false;

	function toggleModal() {
		showModal = !showModal;
	}

	let validationErrors: { email?: string; password?: string };
	// console.log($page.url.searchParams.get('previous'));
	let currInputType = 'password';

	const toggleInputType = () => {
		if (currInputType === 'password') {
			document.getElementById('password').type = 'text';
			currInputType = 'text';
		} else {
			document.getElementById('password').type = 'password';
			currInputType = 'password';
		}
	};
	const submit: SubmitFunction = async ({ formData }) => {
		if (userToLogin?.email) {
			formData.append('email', `${userToLogin.email}`);
		}

		const previous = $page.url.searchParams.get('from');
		loading = true;
		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					let currentUser = result.data.currUser;
					updateLoggedInUsers(currentUser);

					showModal = false;
					if (previous) {
						await goto(`${previous}`);
					} else {
						await goto('/');
					}
				} else if (result.status === 400) {
					validationErrors = result.data.errors;
				} else if (result.status === 401) {
					showToast(`${result.data.message}`, 'error');
				} else if (result.status === 500) {
					showToast(`${result.data.message}`, 'error');
				}
			} finally {
				loading = false;
			}
		};
	};
</script>

<svelte:head>
	<title>Login - Spek-n-Boonen</title>
</svelte:head>
<div class="h-screen w-screen flex flex-col gap-5 justify-center items-center bg-[#F2F2F2]">
	<form action="?/login" method="post" use:enhance={submit}>
		<div
			class="bg-white shadow-none border-none rounded-[16px] py-[50px] px-[30px] text-[#2d2d2d] flex flex-col justify-center items-center gap-10 min-w-[22rem] lg:min-w-[28.25rem]"
		>
			<div class="greeting w-full">
				<div class="flex gap-[1.88rem] items-center w-full align-center">
					<div class="avatar w-auto h-16 flex items-center justify-center">
						<img src="/icons/user.svg" alt="avatar" />
					</div>
					<div class="admin gap-2 w-auto h-16 justify-center">
						<h1 class="text-[1.1rem] lg:text-2xl font-medium tracking-[-0.03rem] whitespace-nowrap">
							Welcome back admin
						</h1>
						<sub class="text-[0.8rem] lg:text-[0.9375rem] tracking-[-0.00938rem] text-[#575757]">
							Enter your credentials to log in
						</sub>
					</div>
				</div>
			</div>
			<div class=" flex flex-col gap-[1.28rem] w-full">
				<div class="email">
					<label for="email" class="block mb-2 text-[0.875rem]">Email</label>
					<input
						type="email"
						name="email"
						id="email"
						placeholder="Enter your Email"
						class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
					/>
					{#if validationErrors?.email}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
						>
					{/if}
				</div>

				<div class="password">
					<label for="password" class="block mb-2 text-[0.875rem]">Password</label>
					<div class="w-full relative flex items-center px-0">
						<input
							type="password"
							name="password"
							id="password"
							placeholder="Enter your password"
							class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
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
			</div>

			<div class="submit w-full flex flex-col gap-[1.88rem]">
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
						<span class="button-text">Log in </span>
					{/if}
				</button>

				<div class="forgot-password">
					<div class="flex gap-[0.38rem] text-[0.8125rem] justify-center">
						<div class="text-[#9C9C9C]">Forgotten password?</div>
						<a href="forgot-password" class="hover:underline">Click here to reset</a>
					</div>
				</div>
			</div>
		</div>
	</form>

	<LoggedInUsersLIst on:showLoggedInUsers={toggleModal} />
</div>

<Modal {showModal}>
	<svelte:fragment slot="modal-content">
		<LoggedInUsersActions
			bind:loading
			bind:userToLogin
			bind:validationErrors
			on:close={toggleModal}
			{submit}
		/>
	</svelte:fragment>
</Modal>
