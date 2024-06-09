<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button } from './ui/button';
	import * as DropdownMenu from './ui/dropdown-menu';
	import type { ButcherShop, Farm } from '$lib/stores';
	import { showToast } from '$lib/utils';
	import { enhance } from '$app/forms';
	import { createEventDispatcher } from 'svelte';
	import PageLoader from './PageLoader.svelte';

	export let grid: boolean = false;
	export let data: Farm | ButcherShop;

	let loading: boolean = false;

	const deleteFunction: SubmitFunction = ({ formData }) => {
		loading = true;
		formData.append('id', `${data.id}`);
		return async ({ result, update }) => {
			// console.log('deleting');
			// console.log(result);
			try {
				if (result.status == 200) {
					dispatch('delete', data);
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
	const edit = () => {
		dispatch('edit', data);
	};
</script>

{#if loading}
	<PageLoader />
{/if}

{#if grid}
	<div
		class="w-full data flex flex-col items-start gap-3 pb-2 rounded-t-xl border-[0.5px] border-grey-300"
	>
		<div class="data-info flex w-full py-2 px-3 flex-col items-start gap-2 flex-[1 0 0]">
			<div class="data-name text-base line-clamp-1 font-medium">
				{data.name}
			</div>
			<section class="flex w-full items-center justify-between">
				<div class="date-added line-clamp-1 flex items-center gap-2 self-stretch">
					{data.address}
				</div>
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
								on:click={edit}
								class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
							>
								<img src="/icons/edit.svg" alt="edit icon" />
								<span class="text-grey-100">Edit</span>
							</Button>
						</DropdownMenu.Item>
						<form action="?/delete" method="post" use:enhance={deleteFunction} class="">
							<!-- <input type="text" class="hidden" bind:value={id} name="id" /> -->
							<DropdownMenu.Item>
								<Button
									class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
									type="submit"
									>{#if loading}
										<iconify-icon
											class="text-primary-red"
											width="20"
											icon="eos-icons:three-dots-loading"
										></iconify-icon>
									{:else}
										<img src="/icons/trash.svg" alt="trash icon" />
										<span class="button-text text-primary-red">Delete </span>
									{/if}</Button
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
					{data.name}
				</span>
			</div>
		</td>
		<td class="text-[#9C9C9C]">
			<span class="line-clamp-1">
				{data.address}
			</span></td
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
							on:click={edit}
							class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
						>
							<img src="/icons/edit.svg" alt="edit icon" />
							<span class="text-grey-100">Edit</span>
						</Button>
					</DropdownMenu.Item>
					<form action="?/delete" method="post" use:enhance={deleteFunction} class="">
						<!-- <input type="text" class="hidden" bind:value={id} name="id" /> -->
						<DropdownMenu.Item>
							<Button
								class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
								type="submit"
								>{#if loading}
									<iconify-icon
										class="text-primary-red"
										width="20"
										icon="eos-icons:three-dots-loading"
									></iconify-icon>
								{:else}
									<img src="/icons/trash.svg" alt="trash icon" />
									<span class="button-text text-primary-red">Delete </span>
								{/if}</Button
							>
						</DropdownMenu.Item>
					</form>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</td>
	</tr>
{/if}
