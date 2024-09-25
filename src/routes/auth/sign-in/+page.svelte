<script lang="ts">
	import { z } from 'zod';
	import type { LoginPayload } from '$lib/types/auth.types';
	import { toast } from 'svelte-sonner';
	import { AxiosError } from 'axios';
	import { login } from '$lib/client/auth';
	import { loginSchema } from './schema';
	import { initializeUserStore } from '$lib/stores/user';

	const formData: LoginPayload = {
		email: '',
		password: ''
	};
	let formErrors: any = {};
	let loading = false;
	const handleSubmit = async () => {
		loading = true;
		formErrors = {};

		try {
			const dataToValidate = {
				...(formData.email.trim().length && { email: formData.email }),
				...(formData.password.length && { password: formData.password })
			};

			const validatedData = loginSchema.parse(dataToValidate) as LoginPayload;

			await login(validatedData);
			await initializeUserStore();
			toast.success('Logged in successfully');
		} catch (err) {
			if (err instanceof z.ZodError) {
				formErrors = err.flatten().fieldErrors;
				return;
			}

			if (err instanceof AxiosError && err.response?.status === 401) {
				toast.error('Invalid email or password');
				return;
			}

			toast.error('An error occurred, please try again');
			console.error(err);
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Sign In - Spek & Boonen</title>
</svelte:head>

<div class="flex items-center justify-center">
	<img src="/icons/user.svg" alt="User Icon" />
</div>

<div class="space-y-1 pt-[24px] text-center">
	<h2 class="font-inter text-2xl font-medium">Welcome back admin</h2>
	<p class="text-sm text-[#727272]">Enter the correct credentials below to access your account</p>
</div>

<form class="mt-10 space-y-4" on:submit|preventDefault={handleSubmit}>
	<div class="form-control">
		<label for="email" class="form-label">Email</label>
		<input
			type="text"
			id="email"
			class="form-input"
			bind:value={formData.email}
			class:form-input-error={formErrors.email}
		/>
		{#if formErrors.email}
			{#each formErrors.email as message}
				<p class="form-error">{message}</p>
			{/each}
		{/if}
	</div>

	<div class="form-control">
		<label for="password" class="form-label">Password</label>
		<input
			type="password"
			id="password"
			class="form-input"
			bind:value={formData.password}
			class:form-input-error={formErrors.password}
		/>
		{#if formErrors.password}
			{#each formErrors.password as message}
				<p class="form-error">{message}</p>
			{/each}
		{/if}
		<div>
			<a href="/auth/forgot-password" class="text-xs text-[#9C9C9C] hover:underline"
				>Forgotten password?</a
			>
		</div>
	</div>

	<div class="space-y-4">
		<button class="btn" type="submit">
			{#if loading}
				<iconify-icon width="22" icon="line-md:loading-loop"></iconify-icon>
			{:else}
				Sign in
			{/if}
		</button>
	</div>
</form>
