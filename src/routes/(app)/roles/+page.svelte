<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import PillSelector from '$lib/components/PillSelector.svelte';
	import Role from '$lib/components/Role.svelte';
	import { Roles, container } from '$lib/stores.js';
	import { debounce, showToast, type Option } from '$lib/utils.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';

	export let data;
	let { roles, permissions } = data;
	Roles.set(roles.results);

	// let allRoles: Role[] = roles.results;
	// const table = createTable(readable(allRoles));

	// const columns = table.createColumns([
	// 	table.column({
	// 		accessor: 'id',
	// 		header: 'Id'
	// 	}),
	// 	table.column({
	// 		accessor: 'name',
	// 		header: 'Name'
	// 	}),
	// 	table.column({
	// 		accessor: 'permissions',
	// 		header: 'Permissions',
	// 		cell: (permissions) => {permissions.value}
	// 	}),
	// 	table.column({
	// 		accessor: ({ id }) => id,
	// 		header: ''
	// 	})
	// ]);

	// const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);

	let name: string;
	let validationErrors: { permissions?: [string]; name?: [string]; search?: string } = {};
	let showModal: boolean = false;
	let searching: boolean = false;
	let permissionsSelected: boolean = false;
	let isFilled: boolean = false;
	let loading: boolean = false;
	let currRoleId: number;

	// conditional(s)

	// Function(s)

	// reactive function(s)
	$: {
		if (name || permissionsSelected) {
			isFilled = true;
		} else isFilled = false;
	}

	$: {
		if (validationErrors.permissions) {
			showToast('Please select permissions to assign to role', 'error');
		}
	}

	// utility function(s)
	const toggleModal = () => {
		showModal = !showModal;
	};
	const toggleEditModal = (role) => {
		showModal = !showModal;
		name = role.name;
		currRoleId = role.id;

		container.set(role.permissions);
	};
	// $: console.log($Roles);

	//permissions function(s)
	const searchPermissions = debounce(async (search: string) => {
		// if (!search.trim()) return (validationErrors.search = 'Search keyword is required');
		searching = true;
		try {
			const res = await fetch(`roles?search=${search}`, {
				headers: { access: `${data.access}` }
			});

			if (res.ok) {
				const filteredPermissions = await res.json();

				permissions = filteredPermissions;
			} else {
			}
		} finally {
			searching = false;
		}
	}, 700);

	const createPermissionsInput = (options: Option[]) => {
		const inputsContainer = document.getElementById('permissions');
		if (browser) {
			console.log(document.getElementById('permissions'));
		}

		while (inputsContainer?.firstChild) {
			inputsContainer.removeChild(inputsContainer.firstChild);
		}
		if (options.length > 0) {
			permissionsSelected = true;
			options.forEach((option) => {
				const input = document.createElement('input');
				input.name = 'permission';
				input.type = 'number';
				input.value = `${option.value}`;
				input.className = 'hidden';

				inputsContainer?.appendChild(input);
			});
		} else permissionsSelected = false;
	};

	// Roles CRUD function(s)
	const submit: SubmitFunction = async ({ formData }) => {
		loading = true;
		if (currRoleId) formData.set('role-id', `${currRoleId}`);

		$container.map((item) => {
			formData.append('permission', `${item.value}`);
		});

		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					if (result.data.edited === true) {
						// console.log(result.data);

						const editedRole = result.data.role;
						Roles.update((roles) => {
							const updatedRole = roles.map((role) => {
								if (role.id === editedRole.id) {
									role = editedRole;
								}
								return role;
							});
							// console.log(updatedRole);
							return updatedRole;
						});
						showToast('	Role updated successfully', 'success');
						container.set([]);
						toggleModal();
					} else {
						Roles.update((roles) => {
							return (roles = [...roles, result.data.role]);
						});
						showToast('New role created successfully', 'success');
						container.set([]);
						toggleModal();
					}
				} else if (result.status === 400) {
					validationErrors = result.data.errors;
					showToast(`${result.data.message}`, 'error');
				} else if (result.status == 500) {
					showToast('Ooops something went wrong', 'error');
				}
			} finally {
				loading = false;
				update();
			}
		};
	};

	onDestroy(() => {
		container.set([]);
	});
</script>

<svelte:head>
	<title>Roles - Spek-n-Boonen</title>
</svelte:head>

<div class="staff-page flex-col items-start">
	<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<h1 class="text-[2rem] tracking-[-0.04rem] font-bold">Role management</h1>
			<sub class="text-[#6B6B6B] text-sm"> Create roles, delete and update roles</sub>
		</div>
		<div class="filters flex items-center w-full gap-2 md:gap-0 justify-between">
			<div
				class="flex items-center sm:w-[24em] border rounded-md border-[#D9D9D9] text-[#232222] px-2"
			>
				<span>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
							stroke="#A9A9A9"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M21 20.9999L16.65 16.6499"
							stroke="#A9A9A9"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
				<input type="text" placeholder="Type here" class="w-full py-2 flex-auto outline-none" />
			</div>

			<div class="filter-buttons flex items-start">
				<button
					on:click={toggleModal}
					class=" md:p-2.5 px-2.5 py-2 bg-primary-100 rounded-md text-white justify-center items-center gap-2.5 inline-flex
                    hover:bg-[#C7453C]
                    focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
				>
					<iconify-icon icon="mdi:key-add" width="23"></iconify-icon>
					<span class=" hidden sm:block text-sm font-bold font-['Satoshi']">Create roles</span>
				</button>
			</div>
		</div>
	</div>

	<div class="border rounded-xl max-w-full w-full overflow-x-scroll no-scrollbar">
		<table class=" table w-full">
			<thead class="">
				<tr class="table-row">
					<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">Name</th>
					<th class="bg-[#F9F9F9]">Permissions</th>
					<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]">Actions</th>
				</tr>
			</thead>
			{#if $Roles.length > 0}
				<tbody class="table-row-group">
					{#each $Roles as role}
						<Role
							on:edit={(e) => toggleEditModal(e.detail)}
							name={role.name}
							id={role.id}
							permissions={role.permissions}
						/>
					{/each}
				</tbody>{/if}
		</table>
		{#if roles.count < 1}
			<div class="w-full py-3 flex justify-center">
				<h3 class="text-lg font-semibold text-center">No roles created yet</h3>
			</div>
		{/if}

		<!-- <Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttr={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
									<Table.Head {...attrs}>
										<Render of={cell.render()} />
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										<Render of={cell.render()} />
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root> -->
	</div>
</div>
.

<Modal {showModal} on:close={() => (showModal = false)}>
	<form
		action="?/create"
		method="post"
		use:enhance={submit}
		slot="modal-content"
		class="max-w-2xl w-xl px-4 md:px-8 py-6 grid grid-cols-1 gap-4 bg-white rounded-lg"
	>
		<section class="flex items-center justify-between mb-5">
			<h2 class="text-xl font-medium font-satoshi text-center">
				{currRoleId ? 'Edit role' : 'Create role'}
			</h2>
			<button
				disabled={loading}
				type="submit"
				class="{isFilled
					? 'bg-primary-red text-white'
					: 'bg-sGray'} text-sm py-2 px-4 rounded flex items-center"
			>
				{#if loading}
					<iconify-icon icon="line-md:loading-twotone-loop" width="20"></iconify-icon>
				{:else}
					Submit
				{/if}
			</button>
		</section>
		<div class="w-full flex flex-col gap-4 items-start justify-center">
			<div class="name w-full flex flex-col items-start mb-5">
				<label for="name" class="block mb-2 text-[0.875rem]">Name:</label>
				<input
					type="text"
					name="name"
					id="name"
					bind:value={name}
					disabled={loading}
					placeholder="Enter role name"
					class="input w-full md:w-[25rem] focus:border-1 focus:border-primary-100 focus:outline-primary-100 border-[#D9D9D9] rounded-[0.5rem]"
				/>
				{#if validationErrors?.name}
					<sub
						transition:slide={{ delay: 250, duration: 300 }}
						class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.name}</sub
					>
				{/if}
			</div>
			<div class="max-w-full w-full">
				<div class=" w-full mb-5">
					<input
						type="text"
						name="search"
						id="search"
						placeholder="Search permissions"
						on:input={(e) => searchPermissions(e?.target?.value)}
						disabled={loading}
						class="w-full px-2 focus:border-primary-100 focus:outline-none border-[#D9D9D9] border-b"
					/>
					{#if validationErrors?.search}
						<sub transition:slide={{ delay: 250, duration: 300 }} class="text-rose-500 text-xs"
							>{validationErrors.search}</sub
						>
					{/if}
				</div>
				{#if searching}
					<div class="flex item-center justify-center min-w-full text-primary-100 py-5">
						<iconify-icon icon="line-md:loading-twotone-loop" width="30"></iconify-icon>
					</div>
				{:else if permissions.count > 0}
					<label for="name" class="block mb-2 text-[0.875rem]">Select permissions:</label>

					<PillSelector options={permissions.results} disableOptions={loading} />
					<div class="hidden" id="permissions"></div>
				{:else}
					<div class="flex item-center justify-center w-full gap-2 text-primary-100 py-5">
						<iconify-icon icon="nonicons:not-found-16" width="20"></iconify-icon>
						<p>No results found</p>
					</div>
				{/if}
			</div>
		</div>
	</form>
</Modal>
