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
	import { Providers, type Provider } from '$lib/stores/providers.stores';
	import * as Avatar from './ui/avatar';
	import DeleteModal from './DeleteModal.svelte';
	dayjs.extend(relativeTime);

	export let provider: Provider;
	let loading: boolean = false;
	let showModal: boolean = false;

	function toggleDelete() {
		showModal = !showModal;
	}

	const deleteProvider: SubmitFunction = async ({ formData }) => {
		loading = true;
		formData.append('slug', `${provider.slug}`);
		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					Providers.update((providers) => providers.filter((item) => item.id !== provider.id));
					showToast('Provider deleted successfully', 'success');
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
	const edit = (provider: Provider) => {
		dispatch('edit', provider);
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
					{#if provider.image}
						<Avatar.Image
							class="object-cover"
							src={provider.image ? provider.image.image : '/icons/human.jpg'}
						></Avatar.Image>
						<Avatar.Fallback>{provider.type[0].toLocaleUpperCase()}</Avatar.Fallback>
					{/if}
				</Avatar.Root>
			</div>
			<span class="grow shrink basis-0 text-[#6B6B6B] text-sm font-medium line-clamp-1">
				{provider.name}
			</span>
		</div>
	</td>
	<td class="w-fit">
		{#if provider.address}
			<span class="w-full">{provider.address}</span>
		{:else}
			<span class="italic text-grey-200"> No address provided </span>
		{/if}
	</td>
	<td>{provider.type}</td>
	<td class=""><span class="line-clamp-1">{dayjs(provider.updated_at).fromNow()}</span></td>
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
						on:click={() => edit(provider)}
						class="text-sm font-satoshi -tracking-[0.14px] w-full  flex items-center justify-start py-1  rounded gap-2"
					>
						<img src="/icons/edit.svg" alt="edit icon" />
						<span class="text-grey-100">Edit detail</span>
					</Button>
				</DropdownMenu.Item>
				<form action="?/delete" method="post" use:enhance={deleteProvider} class="">
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
	deleteItem={deleteProvider}
	endPoint="delete"
	id={provider.slug}
	{toggleDelete}
	isDeleting={loading}
	mainNameForHeader="Provider"
	mainNameForSub="provider"
/>

<style>
	td {
		border: none;
		padding: 20px;
	}
</style>
