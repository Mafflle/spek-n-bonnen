<script lang="ts">
	import { showToast } from '$lib/utils';
	import { AxiosError } from 'axios';
	import { slide } from 'svelte/transition';
	import { z } from 'zod';
	import { resetPassword, resetPasswordSchema } from '../logic';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	/**
	 * @typedef {object} validationError
	 * @property {string[]=} password
	 * @property {string[]=} confirmPassword
	 */

	let requestBody = {
		token: $page.url.searchParams.get('token'),
		password: '',
		confirmPassword: ''
	};

	/**
	 * @type {boolean}
	 */
	let loading = false;

	/**
	 * @type {validationError}
	 */
	let validationErrors;

	const handleSubmit = async () => {
		loading = true;
		try {
			const validatedData = resetPasswordSchema.parse(requestBody);
			const reset = await resetPassword(validatedData);
			// console.log(sendPasswordMail);
			showToast('Password reset successful', 'success');
			await goto('/login');
		} catch (error) {
			if (error instanceof z.ZodError) {
				validationErrors = error.flatten().fieldErrors;
			} else if (error instanceof AxiosError) {
				console.log(error);

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

<div class="h-screen w-screen flex justify-center items-center bg-[#F2F2F2]">
	<form on:submit|preventDefault={handleSubmit}>
		<div
			class="bg-white shadow-none border-none rounded-[16px] py-[50px] px-[30px] text-[#2d2d2d] flex flex-col justify-center items-center gap-10 w-[28.25rem]"
		>
			<div class="pass-avatar">
				<img src="/icons/pass.svg" alt="password svg" />
			</div>
			<div class="card-text flex flex-col gap-2 text-center">
				<h1 class="text-2xl tracking-[-0.03rem] font-medium">Reset Password</h1>
				<div class="text-[#575757] text-[0.9375rem] tracking-[-0.00938rem]">
					Enter your new password below
				</div>
			</div>
			<div class="email-input">
				<input
					type="password"
					id="password"
					placeholder="New password"
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
			<div class="email-input">
				<input
					type="password"
					id="confirm-password"
					placeholder="Confirm new password"
					bind:value={requestBody.confirmPassword}
					class="input w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
				{#if validationErrors?.confirmPassword}
					<sub
						transition:slide={{ delay: 250, duration: 300 }}
						class="text-rose-500 text-xs tracking-[-0.0075rem]"
						>{validationErrors.confirmPassword}</sub
					>
				{/if}
			</div>

			<button
				disabled={loading}
				class="bg-primary-50 py-[0.88rem] px-[0.63rem] rounded-[8px] w-[25rem]
                    hover:bg-[#C7453C] hover:rounded-[0.625rem]
                    focus:shadow-custom text-white font-bold text-sm max-h-12 flex items-center justify-center
                    "
				type="submit"
			>
				{#if loading}
					<iconify-icon width="35" icon="eos-icons:three-dots-loading"></iconify-icon>
				{:else}
					<span class="button-text">Reset password</span>
				{/if}
			</button>
		</div>
	</form>
</div>
