<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ManagersAssigned, type User } from '$lib/user.js';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import { showToast } from '$lib/utils';

	export let users: User[];
	export let access;
	export let endpoint: string;
	export let view = 'manager';

	let loading: boolean = false;
	let searching: string = '';
	let assignedManagers: User[] = [];

	export let openSelectModal: boolean = false;

	function selectManager(manager: User) {
		if (assignedManagers.length > 0) {
			if (!assignedManagers.find((user) => user.id === manager?.id)) {
				assignedManagers = [...assignedManagers, manager];
			} else {
				assignedManagers = assignedManagers.filter(
					(assignedManager) => assignedManager?.id !== manager?.id
				);
			}
		} else {
			assignedManagers = [manager];
		}
	}

	function assignManagers(managers: User[]) {
		ManagersAssigned.update((users) => {
			if (users && users.length > 0) {
				let filteredUsers = managers.filter((manager) => {
					if (!users.find((user) => user.id === manager.id)) {
						return manager;
					}
				});

				return [...users, ...filteredUsers];
			} else {
				return [...managers];
			}
		});
		openSelectModal = false;
	}
</script>

<Popover.Root bind:open={openSelectModal} onOpenChange={(e) => (assignedManagers = [])}>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			type="button"
			class="w-full border border-grey-300 h-[48px] rounded-lg px-4 flex items-center justify-center"
		>
			<div class=" flex items-center w-full justify-between">
				<span class="text-sm text-grey-200">Select</span>

				<span class="w-fit h-fit text-grey-100">
					<iconify-icon width="20" icon="iconamoon:arrow-down-2-duotone"></iconify-icon>
				</span>
			</div>
		</Button>
	</Popover.Trigger>
	<Popover.Content class="md:w-[350px] md:h-[350px] grid ">
		<div class="w-full pt-5">
			<SearchInput
				placeholder="Search employees"
				token={access}
				{loading}
				{endpoint}
				searchEndpoint="users"
				query="is_staff=true"
				on:searched={(e) => {
					console.log(e.detail);

					if (e.detail.results.length < 1) {
						showToast('No result found', 'info');
						return;
					} else {
						users = e.detail.results;
					}
				}}
				on:searching={(e) => (searching = e.detail)}
			/>
		</div>
		<div
			class="flex flex-col items-start justify-center gap-3 max-h-[190px] h-fit overflow-y-scroll no-scrollbar snap-center w-full mb-6"
		>
			{#if searching}
				<div class="flex item-center justify-center min-w-full text-primary-100 py-5">
					<iconify-icon icon="line-md:loading-twotone-loop" width="30"></iconify-icon>
				</div>
			{:else}
				{#each users as user, i}
					<button
						on:click={() => selectManager(user)}
						type="button"
						class="flex w-full px-4 py-2 items-center gap-3 transition-all rounded hover:badge-ghost"
					>
						<Avatar.Root class="w-9 h-9 ">
							{#if user?.staff_profile?.profile_picture}
								<Avatar.Image
									class="w-full h-full object-cover"
									src={user?.staff_profile.profile_picture.image}
									alt="User's profile picture"
								/>
							{/if}
							<Avatar.Fallback>
								<span class="text-sm font-bold">
									{`${user.email.substring(0, 2).toLocaleUpperCase()}`}
								</span>
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="w-full flex items-center justify-between">
							<span class="font-medium text-start"
								>{user?.staff_profile?.preferred_name ?? user.email}</span
							>

							{#if assignedManagers.find((manager) => manager?.id === user?.id)}
								<iconify-icon icon="icon-park-solid:check-one" width="18" style="color: #41AA00"
								></iconify-icon>
							{/if}
						</div>
					</button>
				{/each}
			{/if}
		</div>
		<div class="flex w-full items-center justify-center">
			<Button
				type="button"
				on:click={() => assignManagers(assignedManagers)}
				disabled={assignedManagers.length < 1}
				class="bg-primary-red text-white transition duration-200 disabled:bg-pGrey py-3 px-6 disabled:text-grey-200 disabled:cursor-not-allowed text-sm rounded-md font-medium"
			>
				{view === 'manager' ? 'Assign manager' : 'Assign employee'}
			</Button>
		</div>
	</Popover.Content>
</Popover.Root>
