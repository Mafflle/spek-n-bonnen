<script lang="ts">
	import { enhance } from '$app/forms';
	import { type loggedInUser } from '$lib/utils';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { currentUser } from '$lib/user';
	import { slide } from 'svelte/transition';
	import { LoggedinUsers } from '$lib/stores';

	export let userToLogin: loggedInUser | null;
	export let submit: SubmitFunction;
	export let validationErrors: { email?: string; password?: string };
	export let loading: boolean = false;
	export let action: string | null = null;

	const dispatch = createEventDispatcher();

	const selectUserToLogin = (user: loggedInUser) => {
		userToLogin = user;
	};
	const close = () => {
		dispatch('close');
	};
	let currInputType = 'password';

	const toggleInputType = () => {
		if (currInputType === 'password') {
			document.getElementById('lupassword').type = 'text';
			currInputType = 'text';
		} else {
			document.getElementById('lupassword').type = 'password';
			currInputType = 'password';
		}
	};

	const unsubscribe = currentUser.subscribe((currUser) => (currUser = currUser));

	onDestroy(unsubscribe);
</script>

<div
	class="flex flex-col gap-2 md:p-5 w-full px-3 overflow-hidden py-5 md:min-w-[400px] rounded-2xl items-center"
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
				close();
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
			action={action ?? '?/login'}
			method="post"
		>
			<div class="flex flex-col items-center gap-2">
				<Avatar.Root class="w-16 h-16">
					<Avatar.Image
						class="w-full h-full object-cover"
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
					<label for="password" class="block mb-1 text-sm font-satoshi font-medium">Password</label>
					<div class="w-full relative flex items-center px-0">
						<div class="w-full relative flex items-center px-0">
							<input
								type="password"
								name="password"
								id="lupassword"
								placeholder="Enter your password"
								class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
							/>
							<button
								type="button"
								on:click={toggleInputType}
								class="absolute right-1 flex items-center cursor-pointer z-10 w-max p-2"
							>
								<span class="flex items-center">
									<iconify-icon
										icon={currInputType === 'password' ? 'carbon:view' : 'carbon:view-off'}
										width="20"
									></iconify-icon>
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
	{:else if !userToLogin}
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

						{#if $currentUser?.email === user.email}
							<iconify-icon icon="icon-park-solid:check-one" width="18" style="color: #41AA00"
							></iconify-icon>
						{/if}
					</div>
				</button>
			{/each}
		</div>
	{:else if $LoggedinUsers.length < 1}
		<div>No user added yet</div>
	{/if}
</div>
