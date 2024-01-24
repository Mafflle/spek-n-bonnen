<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button } from './ui/button';
	import { Input } from './ui/input';
	import { Label } from './ui/label';
	import * as DropdownMenu from './ui/dropdown-menu';
	import { showToast } from '$lib/utils';
	import { enhance } from '$app/forms';
	import { Roles } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';

	export let name: string;
	export let id: number;
	export let permissions: { codename: string; content_type: number; id: number; name: string }[];

	const dispatch = createEventDispatcher();

	let loading: boolean = false;

	const deleteRole: SubmitFunction = () => {
		loading = true;
		return async ({ result, update }) => {
			try {
				if (result.status == 200) {
					Roles.update((roles) => roles.filter((role) => role.id !== id));
					showToast('Role deleted successfully', 'success');
				} else {
					showToast('Ooops something went wrong', 'error');
				}
			} finally {
				loading = false;
				update();
			}
		};
	};

	const edit = (roleName: string, id: number, perms) => {
		perms = perms.map((perm) => {
			return {
				value: perm.id,
				label: perm.codename
			};
		});
		// console.log(perms);

		const role = { id, name: roleName, permissions: perms };
		dispatch('edit', role);
	};
</script>

<tr class="border-b border-[#D9D9D9] table-row">
	<td class="table-cell">
		<!-- <div class=" px-2 py-1 bg-stone-50 rounded-[20px] flex items-center justify-center w-full"> -->
		<span class=" text-right text-[#6B6B6B] text-[13px] font-medium">
			{name}
		</span>
		<!-- </div> -->
	</td>
	<td>
		<div class="text-[#9C9C9C] flex gap-1 items-center">
			{#each permissions.slice(0, 2) as permission}
				<div class="px-2 py-1 bg-stone-50 rounded-[20px] justify-start items-center text-[#6B6B6B]">
					{permission.codename}
				</div>
			{/each}
			<p
				class="w-7 h-7 text-black-100 rounded-full bg-secondary-50 {permissions.length - 2 !== 0
					? 'flex'
					: 'hidden'}  justify-center items-center"
			>
				<span>+</span> <span>{permissions.length - 2}</span>
			</p>
		</div>
	</td>
	<td class="table-cell">
		<DropdownMenu.Root>
			<!-- <button class=" px-1.5 flex justify-center items-center">
				<iconify-icon icon="pepicons-pencil:dots-y" style="color: #6b6b6b;" width="30"></iconify-icon>
			</button> -->

			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} class=" px-1.5 flex justify-center items-center">
					<iconify-icon icon="pepicons-pencil:dots-y" style="color: #6b6b6b;" width="30"
					></iconify-icon></Button
				>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="py-3 px-2">
				<div class="grid gap-5 w-full">
					<div class="grid gap-3">
						<Button
							on:click={() => edit(name, id, permissions)}
							class="text-xs flex items-center py-2 rounded h-auto gap-1"
							variant="secondary"
						>
							<iconify-icon icon="material-symbols:edit-outline" width="15"></iconify-icon>
							<span class="text-sm">Edit</span>
						</Button>
						<form
							action="?/delete"
							method="post"
							use:enhance={deleteRole}
							class="grid items-center gap-4"
						>
							<input type="text" class="hidden" bind:value={id} name="id" />
							<Button
								variant="destructive"
								class="text-sm flex items-center gap-1 py-2 rounded h-auto w-full "
								type="submit"
								>{#if loading}
									<iconify-icon width="20" icon="eos-icons:three-dots-loading"></iconify-icon>
								{:else}
									<iconify-icon icon="codicon:trash" width="15"></iconify-icon>
									<span class="button-text text-xs">Delete </span>
								{/if}</Button
							>
						</form>
					</div>
				</div>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</td>
</tr>
