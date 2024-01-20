<script lang="ts">
	import * as DropdownMenu from './ui/dropdown-menu';
	import { Button } from './ui/button';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Manufacturers } from '$lib/stores';
	import { showToast } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

	export let name: string;
	export let date: string;
	export let grid: boolean;
	export let id: number;
	let loading: boolean = false;

	const dispatch = createEventDispatcher();

	const deleteManufacturer: SubmitFunction = () => {
		loading = true;
		return async ({ result, update }) => {
			try {
				if (result.status == 204) {
					Manufacturers.update((manufacturers) =>
						manufacturers.filter((manufacturer) => manufacturer.id !== id)
					);
					showToast('Manufacturer deleted successfully', 'success');
				} else {
					showToast('Ooops something went wrong', 'error');
				}
			} finally {
				loading = false;
				update();
			}
		};
	};

	const edit = (manufacturerName: string, id: number) => {
		const manufacturer = { id, name: manufacturerName };
		dispatch('edit', manufacturer);
	};
</script>

{#if grid}
	<div
		class="w-full manufacturer flex flex-col items-start gap-3 rounded-t-xl border-[0.5px] border-grey-300"
	>
		<div class="manufacturer-image h-32 self-stretch rounded-t-xl bg-[#f9f9f9]"></div>
		<div class="manufacturer-info flex w-full py-2 px-3 flex-col items-start gap-2 flex-[1 0 0]">
			<div class="manufacturer-name text-base font-medium">
				{name}
			</div>
			<div class="date-added flex items-center gap-2 self-stretch">
				<div class="date-icon">
					<img src="/icons/clock.svg" alt="clock icon" />
				</div>
				<div class="date text-xs flex-[1 0 0]">
					Added {date} months ago
				</div>
			</div>
		</div>
	</div>
{:else}
	<tr class="border-b border-[#D9D9D9]">
		<td>
			<div class="   justify-start items-center gap-3 inline-flex">
				<div class="w-[38px] h-[38px] bg-neutral-100 rounded-full"></div>
				<span class="grow shrink basis-0 text-[#6B6B6B] text-sm font-medium">
					{name}
				</span>
			</div>
		</td>
		<td class="text-[#9C9C9C]">{date}</td>
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
								on:click={() => edit(name, id)}
								class="text-xs flex items-center py-2 rounded h-auto gap-1"
								variant="secondary"
							>
								<iconify-icon icon="material-symbols:edit-outline" width="15"></iconify-icon>
								<span class="text-sm">Edit</span>
							</Button>
							<form
								action="?/delete"
								method="post"
								use:enhance={deleteManufacturer}
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
{/if}
