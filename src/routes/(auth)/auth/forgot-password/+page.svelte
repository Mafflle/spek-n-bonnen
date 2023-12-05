<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import PasswordResetModal from '$lib/components/PasswordResetModal.svelte';
	import { getToastType, openPasswordResetModal, showToast } from '$lib/utils';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { slide } from 'svelte/transition';

	let loading: boolean = false;
	let email: string = '';
	let validationErrors: { email: string };

	const handleSubmit: SubmitFunction = async () => {
		loading = true;

		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					showToast('Password reset link sent successfully', 'success');
				} else if (result.status === 400) {
					validationErrors = result.data.errors;
				} else if (result.status == 500) {
					showToast(`Ooops something went wrong`, 'error');
				}
			} finally {
				loading = false;
				update;
			}
		};
	};
</script>

<div class="h-screen w-screen flex justify-center items-center bg-[#F2F2F2]">
	<form action="?/sendForgotPasswordMail" method="post" use:enhance={handleSubmit}>
		<div
			class="bg-white shadow-none border-none rounded-[16px] py-[50px] px-[30px] text-[#2d2d2d] flex flex-col justify-center items-center gap-10 w-full md:w-[22rem] lg:w-[28.25rem]"
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
			<div class="email-input w-full">
				<input
					type="email"
					id="email"
					placeholder="Enter your email"
					name="email"
					bind:value={email}
					class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
				{#if validationErrors?.email}
					<sub transition:slide={{ delay: 250, duration: 300 }} class="text-rose-500 text-xs"
						>{validationErrors.email}</sub
					>
				{/if}
			</div>

			<button
				disabled={loading}
				class="bg-primary-50 py-3 px-2 rounded-lg w-full md:w-[25rem]
                    hover:bg-[#C7453C] hover:rounded-[0.625rem]
                    focus:shadow-custom text-white font-bold text-sm max-h-12 flex items-center justify-center
                    "
				type="submit"
			>
				{#if loading}
					<iconify-icon width="35" icon="eos-icons:three-dots-loading"></iconify-icon>
				{:else}
					<span class="button-text">Send password reset link</span>
				{/if}
			</button>
			<a href="login" class="back flex items-center gap-[0.5625rem] hover:underline">
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
