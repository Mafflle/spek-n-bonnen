<script>
	import PasswordResetModal from '$lib/components/PasswordResetModal.svelte';
	import { openPasswordResetModal, showToast } from '$lib/utils';
	import { AxiosError } from 'axios';
	import { slide } from 'svelte/transition';
	import { z } from 'zod';
	import { schema, sendForgotPasswordMail } from './logic';

	/**
	 * @typedef {object} validationError
	 * @property {string[]=} email
	 */

	/**
	 * @type {string}
	 */
	let email = '';

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
			const validatedData = schema.parse({ email });
			const sendPasswordMail = await sendForgotPasswordMail(validatedData);
			// console.log(sendPasswordMail);
			openPasswordResetModal();
			showToast('Password reset link sent successfully', 'success');
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

<div class="h-screen w-screen flex justify-center items-center bg-[#F2F2F2]">
	<form on:submit|preventDefault={handleSubmit}>
		<div
			class="bg-white shadow-none border-none rounded-[16px] py-[50px] px-[30px] text-[#2d2d2d] flex flex-col justify-center items-center gap-10 w-[28.25rem]"
		>
			<div class="pass-avatar">
				<img src="/icons/pass.svg" alt="password svg" />
			</div>
			<div class="card-text flex flex-col gap-2 text-center">
				<h1 class="text-2xl tracking-[-0.03rem] font-medium">Forgotten password?</h1>
				<div class="text-[#575757] text-[0.9375rem] tracking-[-0.00938rem]">
					Don’t worry, enter your email to get a new one
				</div>
			</div>
			<div class="email-input">
				<input
					type="email"
					id="email"
					placeholder="Enter your email"
					bind:value={email}
					class="input w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
				{#if validationErrors?.email}
					<sub
						transition:slide={{ delay: 250, duration: 300 }}
						class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
					>
				{/if}
			</div>

			<button
				disabled={loading}
				class="bg-primary-50 py-[0.88rem] px-[0.63rem] rounded-[10px] w-[25rem]
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
			<a href="/login" class="back flex items-center gap-[0.5625rem] hover:underline">
				<div class="back-icon">
					<img src="/icons/arrow-left.svg" alt="back icon" />
				</div>
				<div class="back-text text-[0.875rem] tracking-[-0.00875rem] font-medium">
					Back to log in
				</div>
			</a>
		</div>
	</form>
	<PasswordResetModal {email} />
</div>
