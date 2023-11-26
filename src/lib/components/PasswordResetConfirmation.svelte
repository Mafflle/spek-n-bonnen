<script>
	import { passwordConfirmation } from '$lib/stores';
	import { closePasswordResetModal } from '$lib/utils';

	/**
	 * @type {boolean}
	 */
	let passwordConfirmationOpen;

	$: passwordConfirmationOpen = $passwordConfirmation;
</script>

{#if passwordConfirmationOpen}
	<!-- Open the modal using ID.showModal() method -->
	<dialog id="my_modal_1" class="modal modal-open">
		<div
			class="modal-box flex flex-col justify-center items-center gap-10 rounded-2xl bg-white w-[30.0625rem] p-[ 3.125rem 1.875rem]"
		>
			<div class="email-avatar">
				<img src="/icons/password-confirm.svg" alt="email svg" />
			</div>
			<div class="modal-text text-center flex flex-col justify-center items-center gap-2">
				<h1 class="text-2xl tracking-[-0.03rem] font-medium">Password reset successful</h1>
				<div class="text-[#575757] text-[0.9375rem] tracking-[-0.00938rem] w-[19.125rem]">
					Hey user, you can now log in with your new password, welcome back!
				</div>
			</div>
			<a href="/login" class="back flex items-center gap-[0.5625rem] hover:underline">
				<div class="back-icon">
					<img src="/icons/arrow-left.svg" alt="back icon" />
				</div>
				<div class="back-text text-[0.875rem] tracking-[-0.00875rem] font-medium">
					Back to log in
				</div>
			</a>
		</div>
	</dialog>
{/if}
