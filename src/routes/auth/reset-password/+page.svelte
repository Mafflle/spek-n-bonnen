<script>
	import PasswordResetConfirmation from '$lib/components/PasswordResetConfirmation.svelte';
	import { openPasswordConfirmation } from '$lib/utils';

	// NOTE: The timeout is just for texting purposes, use openPasswordConfirmation to show confirmation dialog
	// setTimeout(() => {
	// 	openPasswordConfirmation();
	// }, 1000);
</script>

<div class="h-screen w-screen flex justify-center items-center bg-[#F2F2F2]">
	<form>
		<div
			class="bg-white shadow-none border-none rounded-[16px] py-[50px] px-[30px] text-[#2d2d2d] flex flex-col justify-center items-center gap-10 w-full md:w-[22rem] lg:w-[28.25rem]"
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
			`
			<div class="password-input">
				<input
					type="password"
					id="password"
					placeholder="New password"
					class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
			</div>
			<div class="password-input">
				<input
					type="password"
					id="confirm-password"
					placeholder="Confirm new password"
					class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
			</div>
			<div class="submit w-full">
				<button
					class="bg-primary-50 py-[0.88rem] px-[0.63rem] rounded-[8px] w-full md:w-[25rem]
                    hover:bg-[#C7453C] hover:rounded-[0.625rem]
                    focus:shadow-custom
                    "
					type="submit"
				>
					<div class="button-text text-white font-bold text-sm">Reset password</div>
				</button>
			</div>
		</div>
	</form>
</div>

<PasswordResetConfirmation />
