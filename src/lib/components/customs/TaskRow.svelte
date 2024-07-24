<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import type { Task, TaskStatus } from '$lib/hrm';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import dayjs from 'dayjs';
	import Modal from '$lib/components/Modal.svelte';

	export let data: Task;

	let showMoredDetails: boolean = false;

	function toggleDetails() {
		showMoredDetails = !showMoredDetails;
	}

	function returnPriorityColor(priority) {
		switch (priority) {
			case 'LOW':
				return 'text-yellow-500';
			case 'NORMAL':
				return 'text-[#38A6F5]';
			case 'HIGH':
				return 'text-primary-red';
		}
	}
</script>

<Table.Row class="h-[80px]">
	<Table.Cell class="font-medium  text-grey-100 ">
		<section class="flex items-center gap-2">
			<input type="checkbox" class="w-5 h-5" />
			<span>{data.title}</span>
		</section>
	</Table.Cell>

	<Table.Cell class="font-medium  text-grey-100 text-center">
		<section class="flex items-center -space-x-2">
			{#each data.assignees as assignee, i}
				<Avatar.Root class="w-7 h-7">
					<Avatar.Image
						class="w-full h-full object-cover"
						src={assignee?.staff_profile?.profile_picture.image}
					/>
					<Avatar.Fallback class="text-xs"
						>{assignee?.email.substring(0, 2).toLocaleUpperCase()}</Avatar.Fallback
					>
				</Avatar.Root>
			{/each}
		</section>
	</Table.Cell>
	<Table.Cell class="font-medium  text-grey-100 text-center">
		<div class="flex gap-2 {returnPriorityColor(data.priority)} items-center">
			<iconify-icon width="20" icon="bi:flag"></iconify-icon>
			<span>{data.priority}</span>
		</div>
	</Table.Cell>
	<Table.Cell class="font-medium  text-primary-red">
		<section class="flex items-center gap-2">
			<iconify-icon icon="majesticons:clock-line" width="20"></iconify-icon>
			<span>
				{dayjs(data.end_time).format('hh:mm A')}
			</span>
		</section>
	</Table.Cell>
	<Table.Cell class="flex justify-end">
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
						on:click={toggleDetails}
						class="text-xs font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
					>
						<img src="/icons/edit.svg" alt="edit icon" />
						<span class="text-grey-100">Edit</span>
					</Button>
				</DropdownMenu.Item>

				<DropdownMenu.Item>
					<Button
						on:click={toggleDetails}
						class="text-xs font-satoshi text-grey-100 -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
					>
						<iconify-icon width="17" icon="ph:eye-light"></iconify-icon>
						<span class="text-grey-100">View</span>
					</Button>
				</DropdownMenu.Item>
				<!-- <input type="text" class="hidden" bind:value={id} name="id" /> -->
				<DropdownMenu.Item>
					<form action="?/delete" method="post" class="">
						<Button
							class="text-xs font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
							type="submit"
						>
							<!-- {#if loading}
								<iconify-icon
									class="text-primary-red"
									width="20"
									icon="eos-icons:three-dots-loading"
								></iconify-icon>
							{:else} -->
							<img src="/icons/trash.svg" alt="trash icon" />
							<span class="button-text text-primary-red">Delete </span>
							<!-- {/if} -->
						</Button>
					</form>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Table.Cell>
</Table.Row>

<Modal showModal={showMoredDetails} on:close={toggleDetails}>
	<div class="bg-white w-[800px] rounded-md grid grid-cols-1 pt-4 pb-16" slot="modal-content">
		<section
			class="flex items-center justify-between px-6 pb-6 mb-5 border-b-[0.5px] border-grey-300"
		>
			<h6 class="font-medium text-sm text-grey-100 font-satoshi">Task Management / More Details</h6>
			<button
				on:click={toggleDetails}
				type="button"
				class="bg-[#F2F2F2] border border-[#E0E0E0] flex items-center rounded-full p-0.5"
			>
				<img src="/icons/close.svg" alt="close icon" />
			</button>
		</section>

		<section class="pt-4 px-6 flex flex-col items-start">
			<h3 class="font-satoshi font-bold text-3xl mb-8 text-black-100">{data.title}</h3>

			<div class="border border-grey-300 w-full mb-12 rounded-md p-2.5 px-4">
				<p class="text-sm text-grey-200 font-satoshi">{data.description}</p>
			</div>

			<div class="flex items-start justify-between max-w-[610px] w-full">
				<section class="grid gap-8">
					<div class="w-full grid grid-cols-2 gap-16">
						<section class="font-satoshi flex items-center gap-2 text-grey-200 text-sm font-medium">
							<iconify-icon width="16" icon="pajamas:status"></iconify-icon>
							<span>Status</span>
						</section>
						<div
							class=" w-fit flex items-center gap-1 py-0.5 px-2 rounded font-medium text-sm text-active-green border border-active-green bg-primary-green"
						>
							<span>
								{data.status}
							</span>
							<iconify-icon width="15" icon="ic:round-check-circle"></iconify-icon>
						</div>
					</div>
					<div class="w-full grid grid-cols-2 gap-16">
						<section class="font-satoshi flex items-center gap-2 text-grey-200 text-sm font-medium">
							<iconify-icon width="20" icon="carbon:play-outline"></iconify-icon>
							<span>Start time</span>
						</section>
						<span class=" font-medium text-sm text-grey-100">
							{dayjs(data.start_time).format('hh:mm A')}
						</span>
					</div>
					<div class="w-full grid grid-cols-2 gap-16">
						<section class="font-satoshi flex items-center gap-2 text-grey-200 text-sm font-medium">
							<iconify-icon width="20" icon="carbon:stop-outline"></iconify-icon>
							<span>End time</span>
						</section>

						<span class=" font-medium text-sm text-grey-100">
							{dayjs(data.end_time).format('hh:mm A')}
						</span>
					</div>
					<div class="w-full grid grid-cols-2 gap-16">
						<section class="font-satoshi flex items-center gap-2 text-grey-200 text-sm font-medium">
							<iconify-icon width="17" icon="bi:flag"></iconify-icon>
							<span>Priority</span>
						</section>

						<span class=" font-medium text-sm {returnPriorityColor(data.priority)}">
							{data.priority}
						</span>
					</div>
				</section>

				<section class="grid gap-8">
					<div class="w-full grid grid-cols-2 gap-16">
						<section class="font-satoshi flex items-center gap-2 text-grey-200 text-sm font-medium">
							<iconify-icon width="20" icon="tabler:users"></iconify-icon>
							<span>Assignees</span>
						</section>
						<section class="flex items-center -space-x-2">
							{#each data.assignees as assignee, i}
								<Avatar.Root class="w-7 h-7">
									<Avatar.Image
										class="w-full h-full object-cover"
										src={assignee?.staff_profile?.profile_picture.image}
									/>
									<Avatar.Fallback class="text-xs"
										>{assignee?.email.substring(0, 2).toLocaleUpperCase()}</Avatar.Fallback
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
						<span class=" font-medium text-sm text-grey-100">
							{dayjs(data.created_at).format('hh:mm A')}
						</span>
					</div>
					<div class="w-full grid grid-cols-2 gap-16">
						<section class="font-satoshi flex items-center gap-2 text-grey-200 text-sm font-medium">
							<img src="/icons/calendar-edit.svg" class="w-5 h-5" alt="Calendar icon" />
							<span>Updated at</span>
						</section>

						<span class=" font-medium text-sm text-grey-100">
							{dayjs(data.updated_at).format('hh:mm A')}
						</span>
					</div>
				</section>
			</div>
		</section>
	</div>
</Modal>
