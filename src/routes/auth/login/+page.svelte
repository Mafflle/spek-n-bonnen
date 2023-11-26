<script lang="ts">
	import { page } from '$app/stores';
	import { currentUser } from '$lib/user';
	import { showToast } from '$lib/utils';
	import { AxiosError } from 'axios';
	import { slide } from 'svelte/transition';
	import { login, loginSchema } from './logic';
	import { z } from 'zod';
	import { goto } from '$app/navigation';

	/**
	 * @type {boolean}
	 */
	let loading = false;

	/**
	 * @typedef {object} validationError
	 * @property {string[]=} email
	 * @property {string[]=} password
	 */

	/**
	 * @type {validationError}
	 */
	let validationErrors: { email?: string; password?: string };

	let requestBody = {
		email: '',
		password: ''
	};

	let next = $page.url.searchParams.get('previous');

	const handleSubmit = async () => {
		loading = true;

		try {
			const validatedData = loginSchema.parse(requestBody);
			const res = await login(validatedData);
			currentUser.set(res);
			showToast('Login successful', 'success');
			if (next) {
				await goto(`${next}`);
			} else await goto('/');
			await goto('/');
		} catch (error) {
			if (error instanceof z.ZodError) {
				validationErrors = error.flatten().fieldErrors;
			} else if (error instanceof AxiosError) {
				// console.log(error);

				showToast(error.response?.data.message || 'Ooops something went wrong', 'error');
			} else {
				console.log(error);
				showToast('Ooops something went wrong', 'error');
			}
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Login - Spek-n-Boonen</title>
</svelte:head>

<div class="h-screen w-screen flex justify-center items-center bg-[#F2F2F2]">
	<form on:submit|preventDefault={handleSubmit}>
		<div
			class="bg-white shadow-none border-none rounded-[16px] py-[50px] px-[30px] text-[#2d2d2d] flex flex-col justify-center items-center gap-10 w-[28.25rem]"
		>
			<div class="greeting w-full">
				<div class="flex gap-[1.88rem] items-center w-full align-center">
					<div class="avatar w-auto h-16 flex items-center justify-center">
						<img src="/icons/user.svg" alt="avatar" />
					</div>
					<div class="admin gap-2 w-auto h-16 justify-center">
						<h1 class="text-2xl font-medium tracking-[ -0.03rem] whitespace-nowrap">
							Welcome back admin
						</h1>
						<sub class="text-[0.9375rem] tracking-[-0.00938rem] text-[#575757]">
							Enter your credentials to log in
						</sub>
					</div>
				</div>
			</div>
			<div class=" flex flex-col gap-[1.28rem]">
				<div class="email">
					<label for="email" class="block mb-2 text-[ 0.875rem]">Email</label>
					<input
						bind:value={requestBody.email}
						type="email"
						name="email"
						id="email"
						placeholder="Enter your Email"
						class="input w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.email}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
						>
					{/if}
				</div>

				<div class="password">
					<label for="password" class="block mb-2 text-[ 0.875rem]">Password</label>
					<input
						type="password"
						name="password"
						id="password"
						placeholder="Enter your password"
						bind:value={requestBody.password}
						class="input w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
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
					class="bg-primary-50 py-[0.88rem] px-[0.63rem] rounded-[10px] w-[25rem]
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
</div>
