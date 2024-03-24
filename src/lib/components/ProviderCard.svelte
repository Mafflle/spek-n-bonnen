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
	dayjs.extend(relativeTime);

	export let provider: Provider;
	let loading: boolean = false;

	const deleteProvider: SubmitFunction = async ({ formData }) => {
		loading = true;
		formData.append('slug', `${provider.slug}`);
		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					Providers.update((providers) => providers.filter((item) => item.id !== provider.id));
					showToast('Provider deleted successfully', 'success');
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

<tr class="border-b font-satoshi font-medium text-grey-100 border-[#D9D9D9]">
	<td>
		<div class="   justify-start items-center gap-3 inline-flex">
			<div class="w-[38px] h-[38px] bg-neutral-100 rounded-full">
				<Avatar.Root>
					{#if provider.image}
						<Avatar.Image src={provider.image ? provider.image.image : '/icons/human.jpg'}
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
	<td>{provider.address ? provider.address : 'No address provided'}</td>
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
			<DropdownMenu.Content class="py-3 px-1 flex flex-col justify-start	">
				<DropdownMenu.Item>
					<Button
						on:click={() => edit(provider)}
						class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
					>
						<img src="/icons/edit.svg" alt="edit icon" />
						<span class="text-grey-100">Edit detail</span>
					</Button>
				</DropdownMenu.Item>
				<form action="?/delete" method="post" use:enhance={deleteProvider} class="">
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

<style>
	td {
		border: none;
		padding: 20px;
	}
</style>
