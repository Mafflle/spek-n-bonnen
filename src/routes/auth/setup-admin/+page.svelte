<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { adminExists, userLoading } from '$lib/stores/user';
	import { z } from 'zod';
	import { setupAdminSchema } from './schema';
	import type { SetupAdminPayload } from '$lib/types/user.types';
	import { setUpAdmin } from '$lib/client/user';
	import { toast } from 'svelte-sonner';

	$: {
		if ($adminExists && !$userLoading && browser) {
			goto('/auth/sign-in');
		}
	}

	const formData: SetupAdminPayload = {
		email: '',
		password: '',
		confirmPassword: ''
	};
	let formErrors: any = {};
	let loading = false;

	const handleSubmit = async () => {
		loading = true;
		formErrors = {};

		try {
			const dataToValidate = {
				...(formData.email.trim().length && { email: formData.email }),
				...(formData.password.length && { password: formData.password }),
				...(formData.confirmPassword.length && { confirmPassword: formData.confirmPassword })
			};

			const validatedData = setupAdminSchema.parse(dataToValidate) as SetupAdminPayload;
			console.log('validatedData', validatedData);
			await setUpAdmin(validatedData);
			toast.success('Admin account created successfully, you can now sign in');
			goto('/auth/sign-in');
		} catch (err) {
			if (err instanceof z.ZodError) {
				formErrors = err.flatten().fieldErrors;
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
	<title>Setup Admin Account - Spek & Boonen</title>
</svelte:head>

<div class="flex items-center justify-center">
	<img src="/icons/user.svg" alt="User Icon" />
</div>

<div class="space-y-1 pt-[24px] text-center">
	<h2 class="font-inter text-2xl font-medium">Setup admin account</h2>
	<p class="text-sm text-[#727272]">Fill in the form to create the first admin account</p>
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
	</div>

	<div class="form-control">
		<label for="confirm-password" class="form-label">Confirm password</label>
		<input
			type="password"
			id="confirm-password"
			class="form-input"
			bind:value={formData.confirmPassword}
			class:form-input-error={formErrors.confirmPassword}
		/>

		{#if formErrors.confirmPassword}
			{#each formErrors.confirmPassword as message}
				<p class="form-error">{message}</p>
			{/each}
		{/if}
	</div>

	<button type="submit" class="btn">
		{#if loading}
			<iconify-icon width="22" icon="line-md:loading-loop"></iconify-icon>
		{:else}
			Setup Admin
		{/if}
	</button>
</form>
