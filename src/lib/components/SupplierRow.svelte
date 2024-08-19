<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button } from './ui/button';
	import * as DropdownMenu from './ui/dropdown-menu';
	import { showToast } from '$lib/utils';
	import { enhance } from '$app/forms';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { createEventDispatcher, onMount } from 'svelte';
	import PageLoader from './PageLoader.svelte';
	import { Suppliers, type Supplier } from '$lib/stores/suppliers.stores';
	import * as Avatar from './ui/avatar';
	import DeleteModal from './DeleteModal.svelte';
	dayjs.extend(relativeTime);

	export let data: Supplier;
	let loading: boolean = false;
	let showModal: boolean = false;

	function toggleDelete() {
		showModal = !showModal;
	}

	const deleteSupplier: SubmitFunction = async ({ formData }) => {
		loading = true;
		formData.append('slug', `${data.id}`);
		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					Suppliers.update((suppliers) => suppliers.filter((item) => item.id !== data.id));
					showToast('Supplier deleted successfully', 'success');
					toggleDelete();
				} else {
					showToast('Ooops something went wrong', 'error');
				}
			} finally {
				update();
				loading = false;
			}
		};
	};

	const dispatch = createEventDispatcher();
	const edit = (data: Supplier) => {
		dispatch('toggleEdit', data);
	};
</script>

{#if loading}
	<PageLoader />
{/if}

<tr class="border-b w-full font-satoshi font-medium text-grey-100 border-[#D9D9D9]">
	<td>
		<div class="ustify-start items-center gap-3 inline-flex">
			<div class="w-[38px] h-[38px] bg-neutral-100 rounded-full">
				<Avatar.Root>
					<Avatar.Image
						class="object-cover"
						src={data.logo?.image ? data.logo.image : '/icons/Supplier.svg'}
					></Avatar.Image>
				</Avatar.Root>
			</div>
		</div>
	</td>
	<td class="w-fit">
		<span>{data.company_name}</span>
	</td>
	<td class="w-fit">
		<span>{data.contact_person}</span>
	</td>
	<td class="w-fit">
		<span>{data.email}</span>
	</td>
	<td class="w-fit">
		{#if data.phone}
			<span>{data.phone}</span>
		{:else}
			<span>-----</span>
		{/if}
	</td>
	<td class="w-fit">
		{#if data.address}
			<span class="w-full">{data.address}</span>
		{:else}
			<span class="italic text-grey-200"> No address provided </span>
		{/if}
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
			<DropdownMenu.Content class="py-3 flex flex-col justify-start gap-1">
				<DropdownMenu.Item class="full">
					<Button
						on:click={() => edit(data)}
						class="text-sm font-satoshi -tracking-[0.14px] w-full  flex items-center justify-start py-1  rounded gap-2"
					>
						<img src="/icons/edit.svg" alt="edit icon" />
						<span class="text-grey-100">Edit detail</span>
					</Button>
				</DropdownMenu.Item>
				<form action="?/delete" method="post" use:enhance={deleteSupplier} class="">
					<!-- <input type="text" class="hidden" bind:value={id} name="id" /> -->
					<DropdownMenu.Item>
						<Button
							on:click={toggleDelete}
							class="text-sm font-satoshi cursor-pointer -tracking-[0.14px]  flex items-center justify-start py-2  rounded gap-2"
						>
							<img src="/icons/trash.svg" class="h-4 w-4" alt="trash icon" />
							<span class="button-text text-primary-red">Delete </span>
						</Button>
					</DropdownMenu.Item>
				</form>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</td>
</tr>
<DeleteModal
	showDeleteModal={showModal}
	deleteItem={deleteSupplier}
	endPoint="delete"
	id={data.id}
	{toggleDelete}
	isDeleting={loading}
	mainNameForHeader="Supplier"
	mainNameForSub="data"
/>

<style>
	td {
		border: none;
		padding: 20px;
	}
</style>
