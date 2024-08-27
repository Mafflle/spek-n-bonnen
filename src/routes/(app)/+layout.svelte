<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Modal from '$lib/components/Modal.svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { LoggedinUsers, mediaState } from '$lib/stores.js';
	import { currentUser } from '$lib/user.js';
	import { showToast, updateLoggedInUsers, type loggedInUser, type ToastType } from '$lib/utils.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { onDestroy, onMount } from 'svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import MediaManager from '../../lib/components/MediaManager.svelte';
	export let data;
	const { images, user } = data;

	let message = $page.url.searchParams.get('message') as string;
	let messageType = $page.url.searchParams.get('type') as ToastType;

	onMount(() => {
		if (message && messageType) {
			showToast(message, messageType);
			$page.url.searchParams.delete('message');
			$page.url.searchParams.delete('type');
		}
	});

	currentUser.set(user);

	let userToLogin: loggedInUser | null;

	const unsubscribe = currentUser.subscribe((currUser) => currUser);
	const unsubscribeLoggedInUsers = LoggedinUsers.subscribe((users) => users);
	let showModal: boolean = false;
	let loading: boolean = false;

	function selectUserToLogin(user: loggedInUser) {
		userToLogin = user;
	}
	function toggleModal() {
		showModal = !showModal;
	}
	let validationErrors: { email?: string; password?: string };

	const submit: SubmitFunction = async ({ formData }) => {
		loading = true;
		if (userToLogin?.email) {
			formData.append('email', `${userToLogin.email}`);
		}
		// const previous = $page.url.searchParams.get('from');
		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					let currUser = result.data.currUser;
					currentUser.set(currUser);
					showToast('Login successful', 'success');
					toggleModal();
					userToLogin = null;
				} else if (result.status === 400) {
					validationErrors = result.data.errors;
				} else if (result.status === 401) {
					showToast(`${result.data.message}`, 'error');
				} else if (result.status === 500) {
					showToast(`${result.data.message}`, 'error');
				}
			} finally {
				update();
				loading = false;
			}
		};
	};

	updateLoggedInUsers($currentUser);

	onDestroy(() => {
		unsubscribe();
		unsubscribeLoggedInUsers();
	});
</script>

<div class="flex max-h-screen h-full overflow-hidden max-w-[100vw] w-full bg-[#F9F9F9]">
	<SideNav on:showSwitch={toggleModal} />
	<div
		class="flex-1 overflow-y-scroll h-screen relative lg:m-4 md:rounded-lg pt-10 md:p-8 px-5 max-xsm:mb-16 bg-white"
	>
		<slot />
	</div>
</div>

<Modal {showModal}>
	<div
		class="flex flex-col gap-2 md:p-5 w-full px-3 overflow-hidden py-5 md:min-w-[400px] rounded-2xl items-center"
		slot="modal-content"
	>
		<section class="w-full items-center flex {userToLogin ? 'justify-between' : 'justify-end'}">
			{#if userToLogin}
				<button on:click={() => (userToLogin = null)}>
					<iconify-icon class="text-grey-100" width="25" icon="mingcute:left-line"></iconify-icon>
				</button>
			{/if}
			<button
				on:click={() => {
					userToLogin = null;
					toggleModal();
				}}
				class="bg-[#F2F2F2] border border-[#E0E0E0] flex items-center rounded-full p-0.5"
			>
				<img src="/icons/close.svg" alt="close icon" />
			</button>
		</section>
		{#if userToLogin}
			<h5 class="text-primary-25 text-xl font-satoshi font-medium mb-12">Login</h5>
			<form
				use:enhance={submit}
				class="w-full flex flex-col justify-center gap-8"
				action="/?/login"
				method="post"
			>
				<div class="flex flex-col items-center gap-2">
					<Avatar.Root class="w-16 h-16">
						<Avatar.Image
							class="w-full h-full"
							src={userToLogin.avatar}
							alt="User's profile picture"
						/>
						<Avatar.Fallback>
							{#if userToLogin.name}
								<span class="text-2xl">
									{`${userToLogin.name.substring(0, 2).toLocaleUpperCase()}`}
								</span>
							{:else}
								<span class="text-2xl">
									{`${userToLogin.email.substring(0, 2).toLocaleUpperCase()}`}
								</span>
							{/if}
						</Avatar.Fallback>
					</Avatar.Root>
					<div class="w-full flex items-center justify-center">
						<span class="font-satoshi font-medium text-center"
							>{userToLogin.name ?? userToLogin.email}</span
						>
					</div>
				</div>
				<div class=" flex flex-col justify-center items-center gap-6 w-full">
					<div class="password w-full">
						<label for="password" class="block mb-1 text-sm font-satoshi font-medium"
							>Password</label
						>
						<div class="w-full relative flex items-center px-0">
							<input
								type="password"
								name="password"
								id="password"
								placeholder="Enter your password"
								class=" w-full px-4 py-2 border-grey-300 rounded-md outline-none focus:outline-primary-100 focus:border-1 focus:border-primary-100 focus:shadow-custom border"
							/>
							<!-- <button
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
						</button> -->
						</div>
						{#if validationErrors?.password}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.password}</sub
							>
						{/if}
					</div>
					<div class="submit w-full flex flex-col gap-[1.88rem]">
						<button
							class="bg-primary-red py-3 px-3 rounded-[8px] w-full
					hover:bg-[#C7453C] hover:rounded-[0.625rem]
					focus:shadow-custom text-white font-bold font-satoshi text-sm flex gap-1 items-center justify-center
					"
							type="submit"
						>
							{#if loading}
								<iconify-icon width="25" icon="eos-icons:three-dots-loading"></iconify-icon>
							{:else}
								<span class="button-text">Log in </span>
								<iconify-icon icon="ep:right" width="15"></iconify-icon>
							{/if}
						</button>

						<div class="forgot-password">
							<div class="flex gap-[0.38rem] text-[0.8125rem] justify-center">
								<div class="text-[#9C9C9C]">Forgotten password?</div>
								<a href="auth/forgot-password" class="hover:underline">Click here to reset</a>
							</div>
						</div>
					</div>
				</div>
			</form>
		{/if}
		{#if !userToLogin && $LoggedinUsers.length > 0}
			<div class="flex flex-col items-center justify-center gap-5 w-full mb-6">
				{#each $LoggedinUsers as user}
					<button
						disabled={$currentUser?.email === user.email}
						on:click={() => selectUserToLogin(user)}
						class="flex w-full px-4 py-2 items-center gap-3 transition-all rounded hover:badge-ghost"
					>
						<Avatar.Root class="w-10 h-10">
							<Avatar.Image
								class="w-full h-full object-cover"
								src={user.avatar}
								alt="User's profile picture"
							/>
							<Avatar.Fallback>
								{#if user.name}
									<span class="text-2xl">
										{`${user.name.substring(0, 2).toLocaleUpperCase()}`}
									</span>
								{:else}
									<span class="text-2xl">
										{`${user.email.substring(0, 2).toLocaleUpperCase()}`}
									</span>
								{/if}
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="w-full flex items-center justify-between">
							<span class="text-xl text-start">{user.name ?? user.email}</span>
							<!-- <iconify-icon icon="icon-park:check-one"  style="color: #41AA00;"
						></iconify-icon> -->
							{#if $currentUser?.email === user.email}
								<iconify-icon icon="icon-park-solid:check-one" width="18" style="color: #41AA00"
								></iconify-icon>
							{/if}
						</div>
					</button>
				{/each}
				<form action="/?/logout" method="post" class="w-full">
					<button
						type="submit"
						class="w-full px-4 cursor-pointer py-2 justify-start items-center gap-1 flex text-primary-50"
					>
						<iconify-icon icon="lets-icons:add-round" width="20"></iconify-icon>
						<span class="text-lg font-satoshi block">Add Account</span></button
					>
				</form>
			</div>
		{:else if $LoggedinUsers.length < 1}
			<div>No user added yet</div>
		{/if}
	</div>
</Modal>

<!-- <MediaManager images={images.results} /> -->
