<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button } from './ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as DropdownMenu from './ui/dropdown-menu';
	import { showToast } from '$lib/utils';
	import { enhance } from '$app/forms';
	import { Roles } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import PageLoader from './PageLoader.svelte';

	export let name: string;
	export let id: number;
	export let permissions: { codename: string; content_type: number; id: number; name: string }[];

	const dispatch = createEventDispatcher();

	let loading: boolean = false;

	const deleteRole: SubmitFunction = ({ formData }) => {
		loading = true;
		formData.append('id', `${id}`);
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

	const edit = () => {
		let perms = permissions.map((perm) => {
			return {
				value: perm.id,
				label: perm.codename
			};
		});
		// console.log(perms);

		const role = { id, name, permissions: perms };
		dispatch('edit', role);
	};
</script>

{#if loading}
	<PageLoader />
{/if}

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
			<!-- {#each permissions.slice(0, 2) as permission}
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
			</p> -->
			<Tooltip.Root>
				<Tooltip.Trigger>
					<p>{permissions.length}</p>
				</Tooltip.Trigger>
				<Tooltip.Content class="flex flex-col gap-4 px-3 py-2">
					{#each permissions as permission}
						<p class="text-xs text-grey-100">{permission.name}</p>
					{/each}
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	</td>
	<td class="table-cell">
		<DropdownMenu.Root>
			<!-- <button class=" px-1.5 flex justify-center items-center">
					<iconify-icon icon="pepicons-pencil:dots-y" style="color: #6b6b6b;" width="30"></iconify-icon>
				</button> -->

			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} class=" p-0 flex justify-center items-center">
					<iconify-icon icon="pepicons-pencil:dots-y" style="color: #6b6b6b;" width="30"
					></iconify-icon></Button
				>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="py-3 flex flex-col justify-start gap-1	">
				<DropdownMenu.Item
					on:click={edit}
					class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-2 rounded gap-2"
				>
					<img src="/icons/edit.svg" alt="edit icon" />
					<span class="text-grey-100">Edit</span>
				</DropdownMenu.Item>
				<!-- <input type="text" class="hidden" bind:value={id} name="id" /> -->
				<DropdownMenu.Item
					class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-2  rounded gap-2"
				>
					<img src="/icons/trash.svg" class="h-4 w-4" alt="trash icon" />
					<span class="button-text text-primary-red">Delete </span>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</td>
</tr>
