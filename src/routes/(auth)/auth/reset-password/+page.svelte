<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import PasswordResetConfirmation from '$lib/components/PasswordResetConfirmation.svelte';
	import { openPasswordConfirmation, showToast } from '$lib/utils';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { slide } from 'svelte/transition';

	let validationErrors: { password?: [string]; confirmPassword?: [string] };
	let loading: boolean = false;
	let token = $page.url.searchParams.get('token');

	const handleSubmit: SubmitFunction = async () => {
		loading = true;

		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					showToast('Password reset successfully', 'success');
					await goto('login');
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

<div class="h-screen w-screen flex justify-center items-center bg-[#F2F2F2] px-5 md:p-0 shadow">
	<form
		class="w-full flex flex-col items-center justify-center"
		use:enhance={handleSubmit}
		method="post"
		action="?/resetpassword"
	>
		<input type="text" bind:value={token} class="hidden" name="token" />
		<div
			class="bg-white shadow-none border-none rounded-2xl text-[#2d2d2d] px-5 py-10 flex flex-col justify-center items-center gap-8 w-full sm:w-[25em] md:w-[28.25rem]"
		>
			<div class="pass-avatar">
				<img src="/icons/pass.svg" alt="password svg" />
			</div>
			<div class="card-text flex flex-col gap-2 text-center">
				<h1 class="text-2xl tracking-[-0.03rem] font-medium">Reset password</h1>
				<div class="text-[#575757] text-[0.9375rem] tracking-[-0.00938rem]">
					Enter your new password below
				</div>
			</div>

			<div class="password-input w-full">
				<input
					type="password"
					id="password"
					name="password"
					placeholder="New password"
					class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
				{#if validationErrors?.password}
					<sub
						transition:slide={{ delay: 250, duration: 300 }}
						class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.password[0]}</sub
					>
				{/if}
			</div>
			<div class="password-input w-full">
				<input
					type="password"
					name="confirm-password"
					id="confirm-password"
					placeholder="Confirm new password"
					class="input w-full xss:w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
				{#if validationErrors?.confirmPassword}
					<sub
						transition:slide={{ delay: 250, duration: 300 }}
						class="text-rose-500 text-xs tracking-[-0.0075rem]"
						>{validationErrors.confirmPassword[0]}</sub
					>
				{/if}
			</div>
			<div class="submit w-full">
				<button
					disabled={loading}
					class="bg-primary-50 py-3 px-2 rounded-lg w-full md:w-[25rem]
                    hover:bg-[#C7453C] hover:rounded-[0.625rem]
                    focus:shadow-custom text-white font-bold text-sm max-h-12 flex items-center justify-center"
					type="submit"
				>
					{#if loading}
						<iconify-icon width="35" icon="eos-icons:three-dots-loading"></iconify-icon>
					{:else}
						<span class="button-text">Reset password</span>
					{/if}
				</button>
			</div>
		</div>
	</form>
</div>

<PasswordResetConfirmation />
