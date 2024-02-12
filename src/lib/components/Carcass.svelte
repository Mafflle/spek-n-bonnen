<script lang="ts">
	import { Carcasses } from '$lib/stores';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Button from './ui/button/button.svelte';
	import * as DropdownMenu from './ui/dropdown-menu';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { createEventDispatcher, onMount } from 'svelte';
	import { showToast } from '$lib/utils';
	import { enhance } from '$app/forms';
	import PageLoader from './PageLoader.svelte';
	import Modal from './Modal.svelte';
	import { InfoIcon } from 'lucide-svelte';
	import type { CarcassType } from '$lib/stores/carcass.stores';

	dayjs.extend(relativeTime);

	export let carcass: CarcassType;

	let loading: boolean = false;
	const id = carcass.id;
	const dispatch = createEventDispatcher();
	const deleteCarcass: SubmitFunction = ({ formData }) => {
		loading = true;
		formData.append('carcass-id', `${carcass.id}`);
		return async ({ result, update }) => {
			try {
				if (result.status == 200) {
					const currCarcassId = carcass.id;
					Carcasses.update((carcasses) =>
						carcasses.filter((carcass) => carcass.id !== currCarcassId)
					);
					showToast('CarcassType deleted successfully', 'success');
				} else {
					showToast('Ooops something went wrong', 'error');
				}
			} finally {
				loading = false;
				update();
			}
		};
	};

	const viewCarcassInfo = (carcass: CarcassType) => {
		dispatch('view', { carcass });
	};
</script>

{#if loading}
	<PageLoader />
{/if}

<tr class="border-b border-[#D9D9D9] font-medium font-satoshi text-grey-100">
	<td class="">
		<p class="flex items-center">
			<span class="line-clamp-1"> {carcass.id}</span>
		</p>
	</td>
	<td class="">
		<p class="flex items-center">
			<span class="line-clamp-1"> {carcass.vendor.name}</span>
		</p>
	</td>
	<td class="">
		<p class="flex items-center">
			<span class="line-clamp-1"> {carcass.weight} Kg</span>
		</p>
	</td>
	<td class="">
		<p class="flex items-center">
			<span class="line-clamp-1"> ${carcass.purchase_price}</span>
		</p>
	</td>
	<td class="">
		<p class="flex items-center">
			<span class="line-clamp-1"> {carcass.fat_score}</span>
		</p>
	</td>
	<td class="text-[#9C9C9C]">
		<p class="flex items-center">
			<span class="line-clamp-1"> {dayjs(carcass.date_received).fromNow()}</span>
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
						on:click={() => dispatch('edit', { id: carcass.id })}
						class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
					>
						<img src="/icons/edit.svg" alt="edit icon" />
						<span class="text-grey-100">Edit</span>
					</Button>
				</DropdownMenu.Item>
				<DropdownMenu.Item>
					<Button
						on:click={() => viewCarcassInfo(carcass)}
						class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
					>
						<InfoIcon class="text-grey-100" size="15" />
						<span class="text-grey-100">More information</span>
					</Button>
				</DropdownMenu.Item>
				<form action="?/delete" method="post" use:enhance={deleteCarcass}>
					<input type="text" class="hidden" bind:value={carcass.id} name="id" />
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
