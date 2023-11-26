<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { currentUser, getCurrentUser } from '$lib/user';
	import { checkForUserInDatabase, showToast } from '$lib/utils';
	import { Card, Label, Input } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	/**
	 * @typedef {object} setupError
	 * @property {string[]=} email
	 * @property {string[]=} firstName
	 * @property {string[]=} lastName
	 * @property {string[]=} password
	 * @property {string[]=} confirmPassword
	 */

	/**
	 * @type {boolean}
	 */
	let loading = false; //to show button loader or whatever loader we decide on

	/**
	 * @type {setupError}
	 */

	let validationErrors;

	onMount(async () => {
		const isUserInDB = await checkForUserInDatabase();
		const userProfile = await getCurrentUser();
		console.log(userProfile);
		if (isUserInDB && !userProfile) {
			await goto('login');
		} else if (userProfile) {
			await goto('/');
		}
	});
</script>

<svelte:head>
	<title>Setup - Spek-n-Boonen</title>
</svelte:head>

<div class="min-h-screen py-10 min-w-screen flex justify-center items-center bg-[#F2F2F2]">
	<form
		action="?/setup"
		method="post"
		use:enhance={() => {
			//this function helps us to progressively enhance the form when js is enabled, it's better to read on it from joyOfCode's blog
			loading = true;

			return async ({ result, update }) => {
				try {
					if (result.status === 400) {
						console.log('works');
						if (result.data?.errors) {
							validationErrors = result.data?.errors;
						}
					} else if (result.status === 500) {
						showToast(`${result.data.message}`, 'error');
					}
				} finally {
					loading = false;
					await update(); //prevents form from resetting after being submitted
				}
			};
		}}
	>
		<Card
			class="bg-white shadow-none border-none rounded-[16px] py-[50px] px-[30px] text-[#2d2d2d] flex flex-col justify-center items-center gap-10 w-[28.25rem]"
			size="lg"
		>
			<div class="greeting w-full">
				<div class="flex gap-[1.88rem] items-center w-full">
					<div class="avatar w-auto h-16 flex items-center justify-center">
						<img src="/icons/user.svg" alt="avatar" />
					</div>
					<div class="admin gap-2 w-auto h-16 justify-center">
						<h1 class="text-2xl font-medium tracking-[ -0.03rem] whitespace-nowrap">
							Setup admin account
						</h1>
						<sub class="text-[0.9375rem] tracking-[-0.00938rem] text-[#575757]"
							>Enter your credentials below</sub
						>
					</div>
				</div>
			</div>
			<div class="input flex flex-col gap-[1.28rem]">
				<div class="name flex gap-8">
					<div class="first-name">
						<Label for="first-name" class="block mb-2 text-[ 0.875rem]">First name</Label>
						<Input
							id="first-name"
							name="first-name"
							size="lg"
							placeholder="First name"
							class="focus:border-1 focus:border-[#DA4E45] focus:shadow-custom bg-white border-[#D9D9D9] w-[11.5rem] rounded-[0.5rem]"
							type="text"
						/>

						{#if validationErrors?.firstName}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]"
								>{validationErrors.firstName}</sub
							>
						{/if}
					</div>
					<div class="last-name">
						<Label for="last-name" class="block mb-2 text-[ 0.875rem]">Last name</Label>
						<Input
							id="last-name"
							name="last-name"
							size="lg"
							placeholder="Last name"
							class="focus:border-1 focus:border-[#DA4E45] focus:shadow-custom bg-white border-[#D9D9D9] w-[11.5rem] rounded-[0.5rem]"
							type="text"
						/>
						{#if validationErrors?.lastName}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.lastName}</sub
							>
						{/if}
					</div>
				</div>
				<div class="email">
					<Label for="email" class="block mb-2 text-[ 0.875rem]">Email</Label>
					<Input
						id="email"
						name="email"
						size="lg"
						placeholder="Enter your Email"
						class="focus:border-1 focus:border-[#DA4E45] focus:shadow-custom bg-white border-[#D9D9D9] w-[25rem] rounded-[0.5rem]"
						type="email"
					/>
					{#if validationErrors?.email}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
						>
					{/if}
				</div>

				<div class="password">
					<Label for="password" class="block mb-2 text-[ 0.875rem]">Password</Label>
					<Input
						id="password"
						name="password"
						size="lg"
						placeholder="Enter your password"
						class="focus:border-1 focus:border-[#DA4E45] focus:shadow-custom bg-white border-[#D9D9D9] w-[25rem] rounded-[0.5rem]"
						type="password"
					/>
					{#if validationErrors?.password}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.password}</sub
						>
					{/if}
				</div>
				<div class="password">
					<Label for="confirm-password" class="block mb-2 text-[ 0.875rem]">Confirm password</Label>
					<Input
						id="confirm-password"
						name="confirm-password"
						size="lg"
						placeholder="Confirm your password"
						class="focus:border-1 focus:border-[#DA4E45] focus:shadow-custom bg-white border-[#D9D9D9] w-[25rem] rounded-[0.5rem]"
						type="password"
					/>
					{#if validationErrors?.confirmPassword}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]"
							>{validationErrors.confirmPassword}</sub
						>
					{/if}
				</div>
			</div>

			<div class="submit w-full flex flex-col gap-[1.88rem]">
				<button
					class="bg-primary-50 py-[0.88rem] px-[0.63rem] rounded-[10px] w-[25rem]
                    hover:bg-[#C7453C] hover:rounded-[0.625rem] text-white font-bold text-sm max-h-12 flex items-center justify-center
                    focus:shadow-custom
                    "
					type="submit"
				>
					{#if loading}
						<iconify-icon width="25" icon="eos-icons:three-dots-loading"></iconify-icon>
					{:else}
						<span class="button-text">Sign up</span>
					{/if}
				</button>
			</div>
		</Card>
	</form>
</div>
