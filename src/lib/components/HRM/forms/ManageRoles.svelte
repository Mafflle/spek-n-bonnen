<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import Modal from '$lib/components/Modal.svelte';
	import PillSelector from '$lib/components/PillSelector.svelte';
	import { Roles, container } from '$lib/stores.js';
	import { debounce, showToast, type Option } from '$lib/utils.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';
	import { writable } from 'svelte/store';
	import { enhance } from '$app/forms';

	export let data;
	let { roles, permissions } = data;
	Roles.set(roles.results);
	console.log('manage roles data', data);

	let name: string = '';
	let validationErrors: { permissions?: [string]; name?: [string]; search?: string } = {};
	let showModal: boolean = false;
	let searching: boolean = false;
	let permissionsSelected: boolean = false;
	let isFilled: boolean = false;
	let loading: boolean = false;
	export let currRoleId: number | null = null;
	export let editRole = null;

	const dispatch = createEventDispatcher();

	console.log('editRole', editRole);

	const currentRole = writable(null);

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

	const toggleModal = () => {
		showModal = !showModal;
	};

	function toggleEdit() {
		console.log('Dispatching toggleEdit event on manage');
		dispatch('toggleEdit');
	}

	if (editRole) {
		console.log('editRole is active', editRole);
		name = editRole?.name;
		currRoleId = editRole?.id;
		container.set(editRole.permissions);
	} else {
		name = '';
		currRoleId = null;
		container.set([]);
	}

	const searchPermissions = debounce(async (search: string) => {
		searching = true;
		try {
			const res = await fetch(`roles/?search=${search}`, {
				headers: { access: `${data.access}` }
			});
			if (res.ok) {
				const filteredPermissions = await res.json();
				permissions = filteredPermissions;
			}
		} finally {
			searching = false;
		}
	}, 700);

	const submit: SubmitFunction = async ({ formData }) => {
		loading = true;
		if (currRoleId) formData.append('roleId', `${currRoleId}`);
		$container.map((item) => {
			formData.append('permissions', `${item.id}`);
		});

		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					if (currRoleId) {
						const editedRole = result.data.role;
						Roles.update((roles) => {
							const updatedRole = roles.map((role) => {
								if (role.id === editedRole.id) {
									role = editedRole;
								}
								return role;
							});
							return updatedRole;
						});
						showToast('Role updated successfully', 'success');
					} else {
						Roles.update((roles) => {
							return (roles = [...roles, result.data.role]);
						});
						showToast('New role created successfully', 'success');
						dispatch('close');
					}
					container.set([]);
					dispatch('close');

					toggleEdit();
				} else if (result.status === 400) {
					validationErrors = result.data.errors;
					showToast(`${result.data.message}`, 'error');
				} else if (result.status === 500) {
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

<form
	action="?/manage_role"
	method="post"
	use:enhance={submit}
	class="w-full py-6 flex flex-col justify-between h-full gap-4 bg-white rounded-lg"
>
	<section>
		<div class="flex md:sticky top-0 z-10 items-center justify-between mb-5">
			<Sheet.Header class="flex flex-col w-full gap-2 md:sticky top-0 bg-white z-30">
				<div class="w-full px-3 flex flex-row justify-between items-center">
					<Sheet.Title
						class="flex items-center gap-2 text-primary-50 font-poppins font-semibold text-lg mr-auto"
					>
						<img src="/icons/UserWithEclipse.svg" alt="user icon" />
						<span>{currRoleId ? 'Edit' : 'Create'} Role</span>
					</Sheet.Title>
					<button
						type="button"
						on:click={() => dispatch('close')}
						class="bg-[#F2F2F2] border border-[#E0E0E0] flex items-center rounded-full p-0.5"
					>
						<img src="/icons/close.svg" alt="close icon" />
					</button>
				</div>
				<Separator />
			</Sheet.Header>
		</div>
		<div class="w-full flex flex-col gap-6 px-4 items-start justify-center">
			<span class="font-satoshi text-sm mb-6">Kindly input role name and select permissions</span>
			<div class="name w-full px-3 flex flex-col items-start mb-3">
				<label for="name" class="block mb-1 font-satoshi font-medium text-sm">Role name</label>
				<input
					type="text"
					name="name"
					id="name"
					bind:value={name}
					disabled={loading}
					placeholder="Enter role name"
					class="input w-full focus:border-1 focus:border-primary-100 focus:outline-primary-100 border-[#D9D9D9] rounded-[0.5rem]"
				/>
				{#if validationErrors?.name}
					<sub
						transition:slide={{ delay: 250, duration: 300 }}
						class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.name}</sub
					>
				{/if}
			</div>
			<div class="max-w-full px-3 w-full">
				<div class="w-full mb-10">
					<input
						type="text"
						name="search"
						id="search"
						placeholder="Search permissions"
						on:input={(e) => searchPermissions(e?.target?.value)}
						disabled={loading}
						class="w-full px-2 placeholder-shown:px-0 placeholder-shown:py-1 focus:border-primary-100 focus:outline-none border-[#D9D9D9] border-b"
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
					<div class="max-w-full w-full">
						<label for="name" class="block text-sm font-satoshi mb-3">Select permissions:</label>
						<PillSelector options={permissions.results} disableOptions={loading} />
						<div class="hidden" id="permissions"></div>
					</div>
				{:else}
					<div class="flex item-center justify-center w-full gap-2 text-primary-100 py-5">
						<iconify-icon icon="nonicons:not-found-16" width="20"></iconify-icon>
						<p>No results found</p>
					</div>
				{/if}
			</div>
		</div>
	</section>
	<Sheet.Footer class="w-full px-3 self-end mb-8">
		<div class="w-full px-4">
			<Button
				disabled={loading}
				type="submit"
				class="flex w-full bg-primary-red gap-2 items-center font-satoshi text-sm font-bold text-white py-2.5 px-3 rounded-md hover:bg-primary-100"
			>
				{#if loading}
					<iconify-icon width="25" icon="eos-icons:three-dots-loading"></iconify-icon>
				{:else if currRoleId}
					<span>Update Role</span>
					<iconify-icon icon="ep:right" width="15"></iconify-icon>
				{:else}
					<span>Create Role</span>
					<iconify-icon icon="ep:right" width="15"></iconify-icon>
				{/if}
			</Button>
		</div>
	</Sheet.Footer>
</form>
