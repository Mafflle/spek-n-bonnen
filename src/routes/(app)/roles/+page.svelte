<script lang="ts">
	import CustomTable from '$lib/components/customs/CustomTable.svelte';
	import RoleRow from '$lib/components/customs/RoleRow.svelte';
	import ManageRoles from '$lib/components/HRM/forms/ManageRoles.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { Roles, container } from '$lib/stores.js';
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';

	const currentRole = writable(null);
	const dispatch = createEventDispatcher();
	let showCreate: boolean = false;
	export let data;
	Roles.set(data.roles.results);

	function handleToggleEdit(event: CustomEvent) {
		const roleData = event.detail;
		currentRole.set(roleData);
		showCreate = true;
	}

	function toggleCreate() {
		currentRole.set(null);
		showCreate = !showCreate;
	}

	let tableProps = {
		columns: [{ name: 'name' }, { name: 'permissions' }, { name: '' }],
		RowComponent: RoleRow
	};

	console.log('tableProps', tableProps);

	function handleModalClose(event) {
		showCreate = false;
	}
</script>

<div class="roles-page flex-col items-start w-full max-w-full lg:p-0 md:p-4">
	<div class="manage w-full flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers w-full flex flex-col items-start gap-[0.25rem]">
			<div class="text-[2rem] tracking-[-0.04rem] font-bold">Role Management</div>
			<sub class="text-[#6B6B6B] text-sm">Manage roles and permissions.</sub>
		</div>
		<div class="filters flex items-center w-full justify-between">
			<div class="filter-buttons flex items-start gap-5">
				<button
					on:click={toggleCreate}
					class=" px-2.5 py-2 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
                        hover:bg-[#C7453C]
                        focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/plus.svg" alt="plus icon" />
					</div>
					<span class="text-white text-sm font-bold hidden sm:block"> Create Role </span>
				</button>
			</div>
		</div>
	</div>

	<div class="w-full">
		<CustomTable rowsData={$Roles} props={tableProps} on:toggleEdit={handleToggleEdit} />
	</div>
</div>

<Modal showModal={showCreate} on:close={handleModalClose} mode="sheet">
	<ManageRoles
		currRoleId={$currentRole?.id}
		editRole={$currentRole}
		{data}
		on:toggleEdit={handleModalClose}
		slot="modal-content"
	/>
</Modal>
