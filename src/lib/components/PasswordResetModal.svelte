<script>
	import { passwordModal } from '$lib/stores';
	import { closePasswordResetModal } from '$lib/utils';

	/**
	 * @type {boolean}
	 */
	let passwordModalOpen;

	$: passwordModalOpen = $passwordModal;
	/**
	 * @type {string}
	 */
	export let email;
</script>

{#if passwordModalOpen}
	<!-- Open the modal using ID.showModal() method -->
	<dialog id="my_modal_1" class="modal modal-open">
		<div
			class="modal-box flex flex-col justify-center items-center gap-10 rounded-2xl bg-white w-full lg:w-[30.0625rem] p-[ 3.125rem 1.875rem]"
		>
			<div class="email-avatar">
				<img src="/icons/email.svg" alt="email svg" />
			</div>
			<div class="modal-text text-center flex flex-col justify-center items-center gap-2">
				<h1 class="text-2xl tracking-[-0.03rem] font-medium">Reset email sent</h1>
				<div class="text-[#575757] text-[0.9375rem] tracking-[-0.00938rem] w-[19.125rem]">
					We have just sent a password reset link to this address to <b>{email}</b>
				</div>
			</div>
			<div class="modal-action">
				<form method="dialog" class="flex justify-center items-center gap-[1.875rem]">
					<!-- if there is a button in form, it will close the modal -->
					<button
						class="bg-primary-50 py-[0.88rem] px-[0.63rem] rounded-[10px] w-[10.0625rem]
                    hover:bg-[#C7453C] hover:rounded-[0.625rem]
                    focus:shadow-custom
                    "
						on:click={() => {
							closePasswordResetModal();
						}}
					>
						<div class="button-text text-white font-bold text-sm">Got it</div>
					</button>
					<button
						class="bg-transparent text-primary-50 py-[0.88rem] px-[0.63rem] rounded-[10px] w-[10.0625rem]
                    hover:bg-[#C7453C] hover:text-white hover:rounded-[0.625rem] border-[#C7453C] border
                    focus:shadow-custom
                    "
					>
						<div class="button-text font-bold text-sm">Resend</div>
					</button>
				</form>
			</div>
		</div>
	</dialog>
{/if}
