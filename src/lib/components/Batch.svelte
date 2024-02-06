<script lang="ts">
	import * as DropdownMenu from './ui/dropdown-menu';
	import { Button } from './ui/button';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Batches, type Batch } from '$lib/stores';
	import { showToast } from '$lib/utils';
	import { createEventDispatcher, onMount } from 'svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import PageLoader from './PageLoader.svelte';

	dayjs.extend(relativeTime);

	export let batch: Batch;
	export let grid: boolean;

	let loading: boolean = false;

	const dispatch = createEventDispatcher();

	const deleteBatch: SubmitFunction = ({ formData }) => {
		loading = true;
		formData.append('batch-id', `${batch.id}`);
		return async ({ result, update }) => {
			try {
				if (result.status == 200) {
					const currBatchId = batch.id;
					Batches.update((batches) => batches.filter((batch) => batch.id !== currBatchId));
					showToast('Batch deleted successfully', 'success');
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
		dispatch('edit', batch);
	};
	onMount(() => {
		const storedGridPreference = localStorage.getItem('gridPreference');
		grid = storedGridPreference ? JSON.parse(storedGridPreference) : false;
	});
</script>

{#if loading}
	<PageLoader />
{/if}

{#if grid}
	<div
		class="w-full batch flex flex-col items-start gap-3 rounded-t-xl border-[0.5px] border-grey-300"
	>
		<div class="batch-image h-32 self-stretch rounded-t-xl bg-[#f9f9f9]"></div>
		<div class="batch-info flex w-full py-2 px-3 flex-col items-start gap-2 flex-[1 0 0]">
			<div class="batch-id text-base font-medium line-clamp-1">
				{batch.id}
			</div>
			<div class="batch-primal text-base font-medium line-clamp-1">
				{batch.primal}
			</div>
			<div class="batch-carcass text-base font-medium line-clamp-1">
				{batch.carcass}
			</div>
			<div class="batch-barcode text-base font-medium line-clamp-1">
				{batch.ean_barcode}
			</div>
			<div class="batch-quantity text-base font-medium line-clamp-1">
				{batch.quantity}
			</div>
			<div class="batch-remaining_quantity text-base font-medium line-clamp-1">
				{batch.remaining_quantity}
			</div>
			<div class="batch-expiry text-base font-medium line-clamp-1">
				{batch.expiry_date}
			</div>
		</div>
	</div>
{:else}
	<tr class="border-b border-[#D9D9D9]">
		<td>
			<div class="   justify-start items-center gap-3 inline-flex">
				<div class="w-[38px] h-[38px] bg-neutral-100 rounded-full"></div>
				<span class="grow shrink basis-0 text-[#6B6B6B] text-sm font-medium line-clamp-1">
					{batch.id}
				</span>
			</div>
		</td>
		<td>
			<div class="   justify-start items-center gap-3 inline-flex">
				<div class="w-[38px] h-[38px] bg-neutral-100 rounded-full"></div>
				<span class="grow shrink basis-0 text-[#6B6B6B] text-sm font-medium line-clamp-1">
					{batch.primal}
				</span>
			</div>
		</td>

		<td>
			<div class="   justify-start items-center gap-3 inline-flex">
				<div class="w-[38px] h-[38px] bg-neutral-100 rounded-full"></div>
				<span class="grow shrink basis-0 text-[#6B6B6B] text-sm font-medium line-clamp-1">
					{batch.carcass}
				</span>
			</div>
		</td>
		<td>
			<div class="   justify-start items-center gap-3 inline-flex">
				<div class="w-[38px] h-[38px] bg-neutral-100 rounded-full"></div>
				<span class="grow shrink basis-0 text-[#6B6B6B] text-sm font-medium line-clamp-1">
					{batch.ean_barcode}
				</span>
			</div>
		</td>
		<td>
			<div class="   justify-start items-center gap-3 inline-flex">
				<div class="w-[38px] h-[38px] bg-neutral-100 rounded-full"></div>
				<span class="grow shrink basis-0 text-[#6B6B6B] text-sm font-medium line-clamp-1">
					{batch.quantity}
				</span>
			</div>
		</td>
		<td>
			<div class="   justify-start items-center gap-3 inline-flex">
				<div class="w-[38px] h-[38px] bg-neutral-100 rounded-full"></div>
				<span class="grow shrink basis-0 text-[#6B6B6B] text-sm font-medium line-clamp-1">
					{batch.remaining_quantity}
				</span>
			</div>
		</td>
		<td>
			<div class="   justify-start items-center gap-3 inline-flex">
				<div class="w-[38px] h-[38px] bg-neutral-100 rounded-full"></div>
				<span class="grow shrink basis-0 text-[#6B6B6B] text-sm font-medium line-clamp-1">
					{batch.expiry_date}
				</span>
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
					<form action="?/delete" method="post" use:enhance={deleteBatch} class="">
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
