<script lang="ts">
	import { MainGroups, type MainGroup } from '$lib/stores';

	import * as DropdownMenu from './ui/dropdown-menu';
	import { Button } from './ui/button';
	import { InfoIcon } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import * as Dialog from './ui/dialog';
	import Separator from './ui/separator/separator.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { showToast } from '$lib/utils';
	import PageLoader from './PageLoader.svelte';
	import { enhance } from '$app/forms';

	let loading: boolean = false;
	const dispatch = createEventDispatcher();

	export let group: MainGroup;

	let showDeleteModal: boolean = false;
	function toggleDelete() {
		showDeleteModal = !showDeleteModal;
	}

	const deleteGroup: SubmitFunction = ({ formData }) => {
		loading = true;

		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					const id = group.id;
					MainGroups.update((groups) => groups.filter((group) => group.id !== id));
					showToast('Group deleted successfully', 'success');
				} else {
					showToast('Ooops something went wrong', 'error');
				}
			} finally {
				loading = false;
				update();
			}
		};
	};
</script>

<tr class="border-b border-[#D9D9D9] font-medium font-satoshi text-grey-100">
	<td class="">
		<p class="flex items-center">
			<span class="line-clamp-1"> {group.name}</span>
		</p>
	</td>
	<td class="">
		<p class="flex items-center">
			<span class="line-clamp-1"> {group.department}</span>
		</p>
	</td>
	<td class="">
		<p class="flex items-center">
			<span class="line-clamp-1 text-[{group.color}]"> {group.color} </span>
		</p>
	</td>
	<td class="">
		<p class="flex items-center">
			<span class="line-clamp-1"> {group.vat}%</span>
		</p>
	</td>
	<td class="">
		<p class="flex items-center">
			<span class="line-clamp-1"> {group.traceability}</span>
		</p>
	</td>
	<td class="text-[#9C9C9C]">
		<p class="flex items-center">
			<span class="line-clamp-1">
				{group.traceability_scenario.length > 30 &&
					group.traceability_scenario.slice(0, 20) + '...'}</span
			>
		</p>
	</td>
	<td>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} class=" p-0 flex justify-center items-center">
					<iconify-icon icon="pepicons-pencil:dots-y" style="color: #6b6b6b;" width="30"
					></iconify-icon></Button
				>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="py-3 px-1 flex flex-col justify-start	">
				<DropdownMenu.Item>
					<Button
						on:click={() => dispatch('edit', { id: group.id })}
						class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
					>
						<img src="/icons/edit.svg" alt="edit icon" />
						<span class="text-grey-100">Edit details</span>
					</Button>
				</DropdownMenu.Item>
				<!-- <DropdownMenu.Item>
					<a href={`/inventory/carcass/${carcass.id}`}>
						<Button
							class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
						>
							<InfoIcon class="text-grey-100" size="15" />
							<span class="text-grey-100">More information</span>
						</Button>
					</a>
				</DropdownMenu.Item> -->

				<DropdownMenu.Item>
					<Button
						on:click={toggleDelete}
						class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
					>
						<img src="/icons/trash.svg" alt="trash icon" />
						<span class="button-text text-primary-red">Delete </span>
					</Button>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</td>
</tr>

<Dialog.Root onOutsideClick={toggleDelete} bind:open={showDeleteModal} onOpenChange={toggleDelete}>
	<Dialog.Content>
		<div class="w-[500px]">
			<Dialog.Header class="py-5">
				<Dialog.Title class="text-sm font-medium px-3 mb-2 flex justify-between items-center">
					<span>Confirm Request</span>
					<button
						on:click={toggleDelete}
						class="rounded-full border-[#E0E0E0] bg-[#F2F2F2] p-0.5 border-2"
					>
						<img src="/icons/close.svg" class="w-full h-full object-cover" alt="Close icon" />
					</button>
				</Dialog.Title>
				<Separator class="my-8 md:block hidden" />

				<Dialog.Description class="pt-8 px-3  gap-3 flex flex-col items-center justify-center">
					<div class="w-full mb-3 flex justify-center">
						<img src="/icons/warning-2.svg" alt="A warning icon" />
					</div>
					<h3 class="text-primary-red text-2xl font-medium font-[poppins]">Delete Main Group</h3>
					<span class="text-center max-w-[280px] text-clip">
						This action means this main group will be permanently removed.
					</span>
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer class="pb-6 mt-3">
				<form
					class="w-full flex justify-center"
					action="?/delete"
					use:enhance={deleteGroup}
					method="post"
				>
					<input type="text" class="hidden" bind:value={group.id} name="id" />

					<Button
						class="bg-primary-red w-full max-w-[70%] border flex items-center gap-2 py-2"
						type="submit"
						disabled={loading}
					>
						{#if loading}
							<iconify-icon width="25" icon="eos-icons:three-dots-loading"></iconify-icon>
						{:else}
							<span> Delete </span>
							<iconify-icon icon="grommet-icons:link-next"></iconify-icon>
						{/if}
					</Button>
				</form>
			</Dialog.Footer>
		</div>
	</Dialog.Content>
</Dialog.Root>
