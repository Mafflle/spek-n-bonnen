<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button } from './ui/button';
	import * as DropdownMenu from './ui/dropdown-menu';
	import { Primals, type Primal } from '$lib/stores';
	import { showToast } from '$lib/utils';
	import { enhance } from '$app/forms';
	import { createEventDispatcher, onMount } from 'svelte';
	import PageLoader from './PageLoader.svelte';
	import { InfoIcon } from 'lucide-svelte';
	import DeleteConfirmation from './DeleteConfirmation.svelte';

	export let grid: boolean;
	export let slug: string;
	export let primal: Primal;
	export let showAlert: boolean = false;

	let form: any;

	console.log(primal.slug);

	let loading: boolean = false;

	const deletePrimal: SubmitFunction = ({ formData }) => {
		loading = true;
		// formData.append('slug', `${primal.slug}`);
		console.log('fdata', formData);
		return async ({ result, update }) => {
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
	const viewPrimalInfo = (primal: Primal) => {
		dispatch('view', { primal });
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

{#if loading}
	<PageLoader />
{/if}

<DeleteConfirmation
	{showAlert}
	on:close={() => (showAlert = false)}
	on:delete={() => {
		showAlert = false;
		form.requestSubmit();
	}}
/>

{#if grid}
	<div
		class="w-full primal flex flex-col items-start gap-3 pb-2 rounded-t-xl border-[0.5px] border-grey-300"
	>
		<div class="primal-info flex w-full py-2 px-3 flex-col items-start gap-2 flex-[1 0 0]">
			<p class="primal-name text-base font-medium line-clamp-1">
				{primal.name}
			</p>
			<section class="flex w-full items-center justify-between">
				<span class="date-added flex items-center gap-2 self-stretch line-clamp-2">
					{primal.description ?? 'No description'}
				</span>
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
					<DropdownMenu.Content class="py-3 px-1 flex flex-col justify-start">
						<DropdownMenu.Item>
							<Button
								on:click={() => editPrimal(primal)}
								class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
							>
								<img src="/icons/edit.svg" alt="edit icon" />
								<span class="text-grey-100">Edit</span>
							</Button>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<Button
								on:click={() => viewPrimalInfo(primal)}
								class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
							>
								<InfoIcon class="text-grey-100" size="15" />
								<span class="text-grey-100">More information</span>
							</Button>
						</DropdownMenu.Item>
						<form action="?/delete" method="post" use:enhance={deletePrimal} class="">
							<!-- <input type="text" class="hidden" bind:value={id} name="id" /> -->
							<DropdownMenu.Item>
								<Button
									class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
									type="submit"
								>
									<img src="/icons/trash.svg" alt="trash icon" />
									<span class="button-text text-primary-red">Delete </span></Button
								>
							</DropdownMenu.Item>
						</form>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</section>
		</div>
	</div>
{:else}
	<tr class="border-b border-[#D9D9D9]">
		<td>
			<div class="justify-start items-center gap-3 inline-flex">
				<span class="grow shrink basis-0 text-[#6B6B6B] text-sm font-medium line-clamp-1">
					{primal.name}
				</span>
			</div>
		</td>
		<td class="text-[#9C9C9C]"> <span class="line-clamp-2">{primal.reorder_point ?? 0}kg</span></td>
		<td class="text-[#9C9C9C] max-w-[280px]">
			<span class="line-clamp-3">{primal.description ?? 'No description'}</span></td
		>
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
				<DropdownMenu.Content class="py-3 px-1 flex flex-col justify-start	">
					<DropdownMenu.Item>
						<Button
							on:click={() => editPrimal(primal)}
							class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
						>
							<img src="/icons/edit.svg" alt="edit icon" />
							<span class="text-grey-100">Edit</span>
						</Button>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<Button
							on:click={() => viewPrimalInfo(primal)}
							class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
						>
							<InfoIcon class="text-grey-100" size="15" />
							<span class="text-grey-100">More information</span>
						</Button>
					</DropdownMenu.Item>
					<form
						action="?/delete"
						method="post"
						use:enhance={deletePrimal}
						class=""
						bind:this={form}
					>
						<input type="text" class="hidden" bind:value={primal.slug} name="slug" />
						<DropdownMenu.Item>
							<Button
								class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
								type="submit"
								on:click={(e) => {
									e.preventDefault();

									showAlert = true;
								}}
							>
								<img src="/icons/trash.svg" alt="trash icon" />
								<span class="button-text text-primary-red">Delete </span>
							</Button>
						</DropdownMenu.Item>
					</form>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</td>
	</tr>
{/if}
