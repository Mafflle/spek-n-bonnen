<script lang="ts">
	import { page } from '$app/stores';
	import {
		getLoggedInLoggedinUser,
		showToast,
		type loggedInUser,
		getRandomColor
	} from '$lib/utils';
	import { slide } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import * as Avatar from '$lib/components/ui/avatar';
	import { currentUser } from '$lib/user';

	import { LoggedinUser } from '$lib/stores';
	import { browser } from '$app/environment';
	import Modal from '$lib/components/Modal.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Button from '$lib/components/ui/button/button.svelte';

	let loading: boolean = false;
	if (browser) {
		if ($LoggedinUser.length < 1) {
			let users = getLoggedInLoggedinUser();
			if (users.length > 0) {
				$LoggedinUser = users;
			} else {
				let currUser = {
					name: `${$currentUser?.first_name} ${$currentUser?.last_name}`,
					email: `${$currentUser?.email}`
				};
				users.push(currUser);
				$LoggedinUser = users;
				localStorage.setItem('loggedInLoggedinUser', JSON.stringify(users));
			}
		}
	}
	let userToLogin: loggedInUser | null;
	let showModal: boolean = false;

	function toggleModal() {
		showModal = !showModal;
	}
	function selectUserToLogin(user: loggedInUser) {
		userToLogin = user;
		toggleModal();
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
					const existingLoggedinUser = getLoggedInLoggedinUser();
					let currentUser = result.data.currUser;
					console.log(result);

					const userData = {
						name: `${currentUser?.first_name} ${currentUser?.last_name}`,
						email: `${currentUser?.email}`,
						color: getRandomColor()
					};
					if (existingLoggedinUser.length > 0) {
						if (!existingLoggedinUser.find((user) => user.email === userData?.email)) {
							existingLoggedinUser.push(userData);
						}
					} else {
						existingLoggedinUser.push(userData);
					}
					localStorage.setItem('loggedInLoggedinUser', JSON.stringify(existingLoggedinUser));
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
				update();
			}
		};
	};
</script>

<svelte:head>
	<title>Login - Spek-n-Boonen</title>
</svelte:head>
<div class="h-screen w-screen flex justify-center items-center bg-[#F2F2F2]">
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
						class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
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
							class="h-12 w-full px-4 py-2.5 rounded-md outline-none focus:outline-primary-100 focus:border-1 focus:border-primary-100 focus:shadow-custom border"
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
				<div class="flex flex-col gap-2 justify-center items-center">
					<Collapsible.Root>
						<div class="flex items-center justify-between space-x-4 px-4">
							<Collapsible.Trigger asChild let:builder>
								<h4 class="text-sm font-semibold">Choose an account:</h4>
								<Button builders={[builder]} variant="ghost" size="sm" class="w-9 p-0">
									<iconify-icon icon="ph:caret-down" class="h-4 w-4"></iconify-icon>
									<span class="sr-only">Toggle</span>
								</Button>
							</Collapsible.Trigger>
						</div>
						<div class="rounded-md border px-4 py-3 font-mono text-sm flex items-center gap-2">
							<Avatar.Root class="w-8 h-8">
								<!-- <Avatar.Image class="w-full h-full" src="https://github.com/shadcn.png" alt="@shadcn" /> -->
								<Avatar.Fallback>
									<span class="text-base">
										{$LoggedinUser[0]?.name.split(' ')[0][0]}{$LoggedinUser[0]?.name.split(
											' '
										)[1][0]}
									</span>
								</Avatar.Fallback>
							</Avatar.Root>
							<span>
								{$LoggedinUser[0]?.name}
							</span>
						</div>
						<Collapsible.Content>
							{#each $LoggedinUser as user}
								<div class="rounded-md border px-4 py-3 font-mono text-sm">
									<button
										type="button"
										on:click={() => selectUserToLogin(user)}
										disabled={$currentUser?.email === user.email}
										class="flex items-center gap-2 transition-all rounded-full"
									>
										<Avatar.Root class="w-8 h-8">
											<!-- <Avatar.Image class="w-full h-full" src="https://github.com/shadcn.png" alt="@shadcn" /> -->
											<Avatar.Fallback>
												<span class="text-base">
													{`${user.name.split(' ')[0][0]}${user.name.split(' ')[1][0]}`}
												</span>
											</Avatar.Fallback>
										</Avatar.Root>
										<div class="w-full flex items-center justify-center">
											<span class="font-satoshi font-medium text-center">{user.name}</span>
										</div>
									</button>
								</div>
							{/each}
						</Collapsible.Content>
					</Collapsible.Root>
					<div class="flex items-center justify-center gap-3 w-full"></div>
				</div>
				<div class="forgot-password">
					<div class="flex gap-[0.38rem] text-[0.8125rem] justify-center">
						<div class="text-[#9C9C9C]">Forgotten password?</div>
						<a href="forgot-password" class="hover:underline">Click here to reset</a>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>

<Modal {showModal}>
	<div
		class="flex flex-col gap-2 md:p-5 w-full px-3 overflow-hidden py-5 md:min-w-[400px] rounded-2xl items-center"
		slot="modal-content"
	>
		<section class="w-full items-center flex justify-end">
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
				action="?/login"
				method="post"
			>
				<div class="flex flex-col items-center gap-2">
					<Avatar.Root class="w-16 h-16">
						<!-- <Avatar.Image class="w-full h-full" src="https://github.com/shadcn.png" alt="@shadcn" /> -->
						<Avatar.Fallback>
							<span class="text-2xl">
								{`${userToLogin.name.split(' ')[0][0]}${userToLogin.name.split(' ')[1][0]}`}
							</span>
						</Avatar.Fallback>
					</Avatar.Root>
					<div class="w-full flex items-center justify-center">
						<span class="font-satoshi font-medium text-center">{userToLogin.name}</span>
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
	</div>
</Modal>
