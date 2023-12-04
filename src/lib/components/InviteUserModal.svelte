<script>
	import { inviteUserModal } from '$lib/stores';
	import { closeInviteUserModal } from '$lib/utils';
	import RolePill from './RolePill.svelte';

	/**
	 * @type {boolean}
	 */
	let inviteUserModalOpen;

	$: inviteUserModalOpen = $inviteUserModal;

	// add roles of account manager, customer service, order taker, sales manager, cashier

	/**
	 * @type {Array<{[key: string]: boolean}>}
	 */
	const roles = [
		{ accountManager: false },
		{ customerService: false },
		{ orderTaker: false },
		{ salesManager: false },
		{ Cashier: false }
	];
</script>

{#if inviteUserModalOpen}
	<!-- Open the modal using ID.showModal() method -->

	<dialog id="invite_user_modal" class="modal modal-open">
		<div
			class="modal-box flex flex-col justify-center items-center gap-10 rounded-2xl bg-white w-full lg:w-[30.0625rem] p-[ 3.125rem 1.875rem]"
		>
			<div class="modal-content flex w-full flex-col items-center justify-center gap-[1.87rem]">
				<div class="w-full h-[33px] justify-end items-center gap-2.5 inline-flex">
					<div class="grow shrink basis-0 text-zinc-800 text-lg font-medium">Invite a user</div>
					<div class=" p-2.5 bg-neutral-100 rounded-md justify-center items-center gap-1 flex">
						<button class="text-center text-neutral-500 text-xs font-medium" disabled
							>Send invite</button
						>
					</div>
				</div>

				<div class="name flex flex-col md:flex-row gap-8 w-full items-center justify-between">
					<div class="first-name">
						<input
							type="text"
							id="first-name"
							placeholder="First name"
							class="input w-full md:w-[12.25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-primary-50 rounded-[0.5rem]"
						/>
					</div>
					<div class="last-name">
						<input
							type="text"
							id="last-name"
							placeholder="Last name"
							class="input w-full md:w-[12.25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-primary-50 rounded-[0.5rem]"
						/>
					</div>
				</div>

				<div class="email w-full">
					<input
						type="email"
						id="email"
						placeholder="Enter your Email"
						class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-primary-50 rounded-[0.5rem]"
					/>
				</div>

				<div
					class="user-role flex flex-col justify-center items-start gap-[1.25rem] self-stretch w-full"
				>
					<div class="role-header text-sm tracking-[-0.00875rem]">Select user role</div>
					<div class="roles flex items-start gap-[0.625rem] w-full flex-wrap">
						{#each roles as role, i (i)}
							{#each Object.keys(role) as key}
								<button
									on:click={() => {
										roles[i][key] = !roles[i][key];
									}}
								>
									<RolePill roleName={key} />
								</button>
							{/each}
						{/each}
					</div>
				</div>

				<div class="passwords w-full flex flex-col items-start gap-5 self-stretch">
					<input
						type="password"
						id="password"
						placeholder="Create user password"
						class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-primary-50 rounded-[0.5rem]"
					/>
					<input
						type="password"
						id="confirm-password"
						placeholder="Confirm user paswsword"
						class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-primary-50 rounded-[0.5rem]"
					/>
				</div>
			</div>
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<form method="dialog" class="modal-backdrop" on:click={() => closeInviteUserModal()}>
			<button>close</button>
		</form>
	</dialog>
{/if}
