<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Modal from '$lib/components/Modal.svelte';
	import { createEventDispatcher } from 'svelte';
	import dayjs from 'dayjs';
	import { enhance } from '$app/forms';
	import { ProductTypes } from '$lib/stores';
	import { toast } from 'svelte-sonner';
	import type { Product } from '$lib/stores/product.stores';

	export let data: Product;

	let showMoreDetails: boolean = false;
	const dispatch = createEventDispatcher();

	function toggleDetails() {
		showMoreDetails = !showMoreDetails;
	}

	function toggleEdit(data) {
		console.log('Dispatching toggleEdit event', data);
		dispatch('toggleEdit', data);
	}
</script>

<Table.Row class="h-[80px]">
	<Table.Cell class="font-medium text-grey-100">
		<section class="flex items-center gap-2">
			{#if data.featured_img}
				<div class="min-w-[141px] min-h-[90px] bg-[#f9f9f9]"></div>
			{/if}
		</section>
	</Table.Cell>

	<Table.Cell class="font-medium text-grey-100 ">
		<span>{data.name}</span>
	</Table.Cell>
	<Table.Cell class="font-medium text-grey-100 ">
		<span>Type-{data.product_type}</span>
	</Table.Cell>
	<Table.Cell class="font-medium text-grey-100 ">
		<span>{data.sku}</span>
	</Table.Cell>

	<Table.Cell class="">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} class="p-0 flex justify-center items-center">
					<iconify-icon icon="pepicons-pencil:dots-y" style="color: #6b6b6b;" width="30"
					></iconify-icon></Button
				>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="py-3 px-1 flex flex-col justify-start">
				<DropdownMenu.Item>
					<Button
						on:click={() => toggleEdit(data)}
						class="text-xs font-satoshi -tracking-[0.14px] flex items-center justify-start py-1 h-auto rounded gap-2"
					>
						<img src="/icons/edit.svg" alt="edit icon" />
						<span class="text-grey-100">Edit</span>
					</Button>
				</DropdownMenu.Item>

				<DropdownMenu.Item>
					<form method="post">
						<input type="text" bind:value={data.id} class="hidden" name="id" id="id" />
						<Button
							class="text-xs font-satoshi -tracking-[0.14px] flex items-center justify-start py-1 h-auto rounded gap-2"
							type="submit"
						>
							<img src="/icons/trash.svg" alt="trash icon" />
							<span class="button-text text-primary-red">Delete</span>
						</Button>
					</form>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Table.Cell>
</Table.Row>

<!-- <Modal showModal={showMoreDetails} on:close={toggleDetails}>
	<div class="bg-white w-[800px] rounded-md grid grid-cols-1 pt-4 pb-16" slot="modal-content">
		<section
			class="flex items-center justify-between px-6 pb-6 mb-5 border-b-[0.5px] border-grey-300"
		>
			<h6 class="font-medium text-sm text-grey-100 font-satoshi">
				Product type Management / More Details
			</h6>
			<button
				on:click={toggleDetails}
				type="button"
				class="bg-[#F2F2F2] border border-[#E0E0E0] flex items-center rounded-full p-0.5"
			>
				<img src="/icons/close.svg" alt="close icon" />
			</button>
		</section>

		<section class="pt-4 px-6 flex flex-col items-start">
			<h3 class="font-satoshi font-bold text-3xl mb-8 text-black-100">{data.name}</h3>

			<div class="border border-grey-300 w-full mb-12 rounded-md p-2.5 px-4">
				<p class="text-sm text-grey-200 font-satoshi">{data.description}</p>
			</div>

			<div class="flex items-start justify-between max-w-[610px] w-full">
				<section class="grid gap-8">
					<div class="w-full grid grid-cols-2 gap-16">
						<section class="font-satoshi flex items-center gap-2 text-grey-200 text-sm font-medium">
							<iconify-icon width="20" icon="tabler:users"></iconify-icon>
							<span>Members</span>
						</section>
						<section class="flex items-center -space-x-2">
							{#each data.members as member, i}
								<Avatar.Root class="w-7 h-7">
									<Avatar.Image class="w-full h-full object-cover" src={member?.profile_picture} />
									<Avatar.Fallback class="text-xs"
										>{member?.name.substring(0, 2).toLocaleUpperCase()}</Avatar.Fallback
									>
								</Avatar.Root>
							{/each}
						</section>
					</div>

					<div class="w-full grid grid-cols-2 gap-16">
						<section class="font-satoshi flex items-center gap-2 text-grey-200 text-sm font-medium">
							<img src="/icons/calendar-add.svg" class="w-5 h-5" alt="Calendar icon" />
							<span>Created at</span>
						</section>
						<span class="font-medium text-sm text-grey-100">
							{dayjs(data.created_at).format('hh:mm A')}
						</span>
					</div>
					<div class="w-full grid grid-cols-2 gap-16">
						<section class="font-satoshi flex items-center gap-2 text-grey-200 text-sm font-medium">
							<img src="/icons/calendar-edit.svg" class="w-5 h-5" alt="Calendar icon" />
							<span>Updated at</span>
						</section>

						<span class="font-medium text-sm text-grey-100">
							{dayjs(data.updated_at).format('hh:mm A')}
						</span>
					</div>
				</section>
			</div>
		</section>
	</div>
</Modal> -->
