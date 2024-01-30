<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button } from './ui/button';
	import * as DropdownMenu from './ui/dropdown-menu';
	import { Primals, type Primal } from '$lib/stores';
	import { showToast } from '$lib/utils';
	import { enhance } from '$app/forms';
	import { createEventDispatcher, onMount } from 'svelte';

	export let name: string;
	export let description: string;
	export let grid: boolean;
	export let id: number;
	export let slug: string;
	export let primal: Primal;

	let loading: boolean = false;

	const deletePrimal: SubmitFunction = () => {
		loading = true;
		return async ({ result, update }) => {
			console.log('deleting');
			console.log(result);
			try {
				if (result.status == 200) {
					Primals.update((primals) => primals.filter((primal) => primal.slug !== slug));
					showToast('Primal deleted successfully', 'success');
				} else {
					showToast('Ooops something went wrong', 'error');
				}
			} catch (e) {
				console.log(e);
			} finally {
				loading = false;
				update();
			}
		};
	};

	const dispatch = createEventDispatcher();
	const editPrimal = (primal: Primal) => {
		dispatch('edit', primal);
	};
	onMount(() => {
		const storedGridPreference = localStorage.getItem('gridPreference');
		grid = storedGridPreference ? JSON.parse(storedGridPreference) : false;
	});
</script>

{#if grid}
	<div
		class="w-full primal flex flex-col items-start gap-3 pb-2 rounded-t-xl border-[0.5px] border-grey-300"
	>
		<div class="primal-info flex w-full py-2 px-3 flex-col items-start gap-2 flex-[1 0 0]">
			<div class="primal-name text-base font-medium">
				{primal.name}
			</div>
			<section class="flex w-full items-center justify-between">
				<div class="date-added flex items-center gap-2 self-stretch">
					{primal.description}
				</div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button builders={[builder]} class=" p-0 flex justify-center items-center">
							<iconify-icon icon="pepicons-pencil:dots-y" style="color: #6b6b6b;" width="30"
							></iconify-icon></Button
						>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="py-3 px-2">
						<div class="grid gap-5 w-full">
							<div class="grid gap-3">
								<Button
									on:click={() => editPrimal(primal)}
									class="text-xs flex items-center py-2 rounded h-auto gap-1"
									variant="secondary"
								>
									<iconify-icon icon="material-symbols:edit-outline" width="15"></iconify-icon>
									<span class="text-sm">Edit</span>
								</Button>
								<form
									action="?/delete"
									method="post"
									use:enhance={deletePrimal}
									class="grid items-center gap-4"
								>
									<input type="text" class="hidden" bind:value={slug} name="slug" />
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
			</section>
		</div>
	</div>
{:else}
	<tr class="border-b border-[#D9D9D9]">
		<td>
			<div class="justify-start items-center gap-3 inline-flex">
				<span class="grow shrink basis-0 text-[#6B6B6B] text-sm font-medium">
					{primal.name}
				</span>
			</div>
		</td>
		<td class="text-[#9C9C9C]">{primal.description}</td>
		<td class="table-cell">
			<DropdownMenu.Root>
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
								on:click={() => editPrimal(primal)}
								class="text-xs flex items-center py-2 rounded h-auto gap-1"
								variant="secondary"
							>
								<iconify-icon icon="material-symbols:edit-outline" width="15"></iconify-icon>
								<span class="text-sm">Edit</span>
							</Button>
							<form
								action="?/delete"
								method="post"
								use:enhance={deletePrimal}
								class="grid items-center gap-4"
							>
								<input type="text" class="hidden" bind:value={slug} name="slug" />
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
