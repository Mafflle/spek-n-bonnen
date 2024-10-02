<script lang="ts">
	import auth from '$lib/client/auth';
	import { toast } from 'svelte-sonner';
	import { AxiosError } from 'axios';
	import { z } from 'zod';

	import type { LoginPayload } from '$lib/types/auth.types';
	import { initializeUserStore } from '$lib/stores/user';
	import { loginSchema } from '$lib/client/schema';

	import Input from '$components/Input.svelte';
	import AuthContext from '$components/AuthContext.svelte';

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

			await auth.login(validatedData);
			await initializeUserStore();
			toast.success('Logged in successfully');
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
	<title>Sign In - Spek & Boonen</title>
</svelte:head>

<AuthContext>
	<svelte:fragment slot="context-image">
		<img src="/icons/user.svg" alt="User Icon" />
	</svelte:fragment>
	<svelte:fragment slot="context-title">Welcome back admin</svelte:fragment>
	<svelte:fragment slot="context-description"
		>Enter the correct credentials below to access your account</svelte:fragment
	>

	<form
		slot="context-content"
		class="mt-10 flex flex-col space-y-5"
		autocomplete="off"
		on:submit|preventDefault={handleSubmit}
	>
		<div class="form-section">
			<Input
				name="email"
				bind:value={formData.email}
				label="Email"
				type="email"
				inputErrors={formErrors.email}
			/>
			<Input
				name="password"
				bind:value={formData.password}
				label="Password"
				type="password"
				inputErrors={formErrors.password}
			/>

			<a href="forgot-password" class="text-sm text-grey-special">Forgotten password?</a>
		</div>
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
