<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { adminExists, userLoading } from '$lib/stores/user';
	import { z } from 'zod';
	import type { SetupAdminPayload } from '$lib/types/user.types';

	import { toast } from 'svelte-sonner';
	import Input from '$components/Input.svelte';
	import { setupAdminSchema } from '$lib/client/schema';
	import auth from '$lib/client/auth';
	import AuthContext from '$components/AuthContext.svelte';

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

			await auth.setUpAdmin(validatedData);
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

<AuthContext>
	<svelte:fragment slot="context-image">
		<img src="/icons/user.svg" alt="User Icon" />
	</svelte:fragment>
	<svelte:fragment slot="context-title">Setup admin account</svelte:fragment>
	<svelte:fragment slot="context-description"
		>Fill in the form to create the first admin account</svelte:fragment
	>

	<form class="mt-10 space-y-4" on:submit|preventDefault={handleSubmit} slot="context-content">
		<Input
			label="Email"
			name="email"
			type="email"
			bind:value={formData.email}
			bind:inputErrors={formErrors.email}
		/>

		<Input
			label="Password"
			name="password"
			type="password"
			bind:value={formData.password}
			bind:inputErrors={formErrors.password}
		/>

		<Input
			label="Confirm password"
			name="confirm-password"
			type="password"
			bind:value={formData.confirmPassword}
			bind:inputErrors={formErrors.confirmPassword}
		/>

		<button type="submit" class="btn">
			{#if loading}
				<iconify-icon width="22" icon="line-md:loading-loop"></iconify-icon>
			{:else}
				Setup Admin
			{/if}
		</button>
	</form>
</AuthContext>
