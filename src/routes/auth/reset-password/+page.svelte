<script lang="ts">
	import { page } from '$app/stores';
	import AuthContext from '$components/AuthContext.svelte';
	import Input from '$components/Input.svelte';
	import auth from '$lib/client/auth';
	import { resetPasswordSchema } from '$lib/client/schema';
	import type { resetPasswordPayload } from '$lib/types/auth.types';
	import { toast } from 'svelte-sonner';
	import { z } from 'zod';

	let formData: resetPasswordPayload = { password: '', confirmPassword: '' };
	let formErrors: any = {};
	let loading = false;

	const handleSubmit = async () => {
		loading = true;
		formErrors = {};

		try {
			const dataToValidate = {
				...(formData.password.length && { password: formData.password }),
				...(formData.confirmPassword.length && { confirmPassword: formData.confirmPassword })
			};

			const { password } = resetPasswordSchema.parse(dataToValidate) as resetPasswordPayload;
			const token = $page.url.searchParams.get('token');

			if (token) {
				await auth.resetPassword(password, token);
			} else {
				toast.error('Please request another reset password link');
			}
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
	<title>Reset Password - Spek & Boonen</title>
</svelte:head>

<AuthContext>
	<svelte:fragment slot="context-image">
		<img src="/icons/key.svg" alt="Key Icon" />
	</svelte:fragment>
	<svelte:fragment slot="context-title">Reset password</svelte:fragment>
	<svelte:fragment slot="context-description">Enter your new password below</svelte:fragment>

	<form
		slot="context-content"
		class="mt-10 flex flex-col space-y-5"
		autocomplete="off"
		on:submit|preventDefault={handleSubmit}
	>
		<Input
			name="password"
			bind:value={formData.password}
			label="New password"
			type="password"
			inputErrors={formErrors.password}
		/>
		<Input
			name="confirm-password"
			bind:value={formData.confirmPassword}
			label="Confirm password"
			type="password"
			inputErrors={formErrors.confirmPassword}
		/>

		<div class="space-y-4">
			<button class="btn p-3.5" type="submit">
				{#if loading}
					<iconify-icon width="22" icon="line-md:loading-loop"></iconify-icon>
				{:else}
					<span class="font-medium"> Login </span>
				{/if}
			</button>
		</div>
	</form>
</AuthContext>
