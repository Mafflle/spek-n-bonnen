<script lang="ts">
	import AuthContext from '$components/AuthContext.svelte';
	import Input from '$components/Input.svelte';
	import auth from '$lib/client/auth';
	import { forgotPasswordSchema } from '$lib/client/schema';
	import type { forgotPasswordPayload } from '$lib/types/auth.types';
	import { AxiosError } from 'axios';
	import { toast } from 'svelte-sonner';
	import { z } from 'zod';

	let loading = false;
	let formData: forgotPasswordPayload = {
		email: ''
	};
	let formErrors: any = {};

	let mailSent = false;

	const handleSubmit = async () => {
		loading = true;
		formErrors = {};

		try {
			const dataToValidate = {
				...(formData.email.trim().length && { email: formData.email })
			};

			const validatedData = forgotPasswordSchema.parse(dataToValidate) as forgotPasswordPayload;

			await auth.getResetPasswordMail(validatedData);
			mailSent = true;
			toast.success('Password reset link sent successfully, check your mail');
		} catch (err) {
			console.log(err);

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
	<title>Forgot Password - Spek & Boonen</title>
</svelte:head>

<AuthContext>
	<svelte:fragment slot="context-image">
		<img
			src={!mailSent ? '/icons/key.svg' : '/icons/inbox.svg'}
			alt={!mailSent ? 'Key Icon' : 'Inbox icon'}
		/>
	</svelte:fragment>
	<svelte:fragment slot="context-title"
		>{mailSent ? 'Check your inbox' : 'Forgotten password?'}</svelte:fragment
	>
	<svelte:fragment slot="context-description">
		{#if mailSent}
			A password reset link has been sent to <span class="text-primary-black underline"
				>{formData?.email ?? 'Test@gmail.com'}</span
			>
		{:else}
			Enter your email to get a new one
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="context-content">
		{#if mailSent}
			<div class="mt-10 space-y-4">
				<a href="sign-in" class="btn flex items-center justify-center gap-2 p-3.5" type="button">
					<iconify-icon width="20" icon="eva:arrow-back-fill"></iconify-icon>
					<span class="font-medium"> Back to login </span>
				</a>
			</div>
		{:else}
			<form
				on:submit|preventDefault={handleSubmit}
				class="mt-10 flex flex-col space-y-5"
				autocomplete="off"
			>
				<div class="form-section">
					<Input
						name="email"
						bind:value={formData.email}
						label="Email"
						type="email"
						inputErrors={formErrors.email}
					/>
				</div>
				<div class="space-y-4">
					<button class="btn p-3.5" type="submit">
						{#if loading}
							<iconify-icon width="22" icon="line-md:loading-loop"></iconify-icon>
						{:else}
							<span class="font-medium"> Reset </span>
						{/if}
					</button>
				</div>
			</form>
		{/if}
	</svelte:fragment>
</AuthContext>

<style>
</style>
