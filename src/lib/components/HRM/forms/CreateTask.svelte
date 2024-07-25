<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import { slide } from 'svelte/transition';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import HrmSelector from './HRMSelector.svelte';
	import DatePicker from '$lib/components/customs/DatePicker.svelte';
	import { ManagersAssigned } from '$lib/user';
	import Pill from '$lib/components/Pill.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { showToast } from '$lib/utils';
	import { enhance } from '$app/forms';
	import { Tasks, type Task } from '$lib/hrm';
	import { createEventDispatcher, onDestroy } from 'svelte';

	export let access;
	export let users;
	export let task: Task | null = null;
	export let endpoint;

	let start_time = null;
	let end_time = null;
	let loading: boolean = false;
	const dispatch = createEventDispatcher();

	let taskName = task?.title;
	let taskDescription = task?.description;
	let taskPriority = { value: task?.priority, label: task?.priority };

	ManagersAssigned.set(task?.assignees);

	$: times = task && { startTime: task?.start_time, endTime: task?.end_time };

	const submit: SubmitFunction = ({ formData, cancel }) => {
		loading = true;
		if ((start_time && end_time) || task) {
			formData.append('start_time', `${start_time || task?.start_time}`);
			formData.append('end_time', `${end_time || task?.end_time}`);
		} else {
			showToast('Please select the timeline for this task', 'error');
			loading = false;
			cancel();
		}

		if ($ManagersAssigned && $ManagersAssigned.length > 0) {
			$ManagersAssigned.forEach((manager) => {
				formData.append('assignees_ids', `${manager?.id}`);
			});
		} else {
			showToast('Please select employees to assign task', 'error');
			loading = false;
			cancel();
		}

		if (task && task.id) {
			formData.append('existingTaskId', `${task.id}`);
		}
		return async ({ update, result, formData }) => {
			try {
				if (result.status === 200) {
					console.log(result);

					if (result.data.edited) {
						let editedTask = result.data.editedTask;

						Tasks.update((tasks) => {
							return tasks.map((task) => {
								if (task.id === editedTask.id) {
									task = editedTask;
								}
								return task;
							});
						});

						showToast('Task updated successfully', 'success');
					} else {
						let newTask = result.data.newTask;

						Tasks.update((tasks) => {
							tasks.push(newTask);
							return tasks;
						});
						showToast('Task created successfully', 'success');
					}

					dispatch('close');
				} else if (result.status === 400) {
					validationErrors = result.data.errors;
					showToast('Validation error', 'error');
				} else {
					showToast('Oops something went wrong', 'error');
					console.log(result);
				}
			} finally {
				update();
				loading = false;
			}
		};
	};

	const taskPriorities = [
		{ label: 'Low', value: 'LOW', color: 'text-yellow-500' },
		{ label: 'Normal', value: 'NORMAL', color: 'text-[#38A6F5]' },
		{ label: 'High', value: 'HIGH', color: 'text-primary-red' }
	];

	let validationErrors: {
		title?: [string];
		description?: [string];
		priority?: [string];
		assignees_id?: [string];
		timeline?: [string];
	} = {};

	onDestroy(() => {
		task = null;
		dispatch('closed');
	});
</script>

<form
	method="post"
	use:enhance={submit}
	action="?/manage_task"
	class="w-full max-xsm:pb-4 pb-6 max-h-full overflow-x-scroll no-scrollbar flex flex-col gap-5 items-start justify-between bg-white rounded-lg"
>
	<section class="md:h-full w-full">
		<div
			class="flex w-full sticky bg-white top-0 h-16 max-xsm:py-2 z-30 items-center justify-center mb-5"
		>
			<Sheet.Header
				is="text"
				class="flex flex-col h-full items-center justify-center w-full   z-10  "
			>
				<div class="w-full h-full px-3 flex flex-row justify-between items-center">
					<Sheet.Title
						class="flex items-center gap-2 text-primary-50 font-poppins font-semibold text-lg mr-auto"
					>
						<img src="/icons/UserWithEclipse.svg" alt="user icon " />
						<span>{task ? 'Edit' : 'Create'} Task</span>
					</Sheet.Title>
					<button
						type="button"
						on:click={() => {
							// console.log('Close button clicked');
							dispatch('close');
						}}
						class="bg-[#F2F2F2] border border-[#E0E0E0] flex items-center rounded-full p-0.5"
					>
						<img src="/icons/close.svg" alt="close icon" />
					</button>
				</div>
				<Separator />
			</Sheet.Header>
		</div>
		<div class="form-group py-6 flex flex-col gap-10 items-start justify-center w-full px-4">
			<span class="font-satoshi text-sm"
				>Kindly fill the form below with the appropriate information</span
			>
			<section class="w-full flex flex-col gap-5">
				<div class="form-item w-full flex flex-col gap-1">
					<label for="title" class="text-sm mb-1 font-medium font-satoshi">Task name</label>
					<input
						type="text"
						name="title"
						id="title"
						bind:value={taskName}
						placeholder="Do something....."
						class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
					/>
					{#if validationErrors?.title}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.title[0]}</sub
						>
					{/if}
				</div>
				<div class="form-item w-full flex flex-col gap-1">
					<label for="description" class="text-sm mb-1 font-medium font-satoshi"
						>Task description</label
					>
					<Textarea name="description" rows={6} bind:value={taskDescription} />
					{#if validationErrors?.description}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]"
							>{validationErrors.description[0]}</sub
						>
					{/if}
				</div>
				<div class="form-item w-full flex flex-col gap-1">
					<label for="priority" class="text-sm mb-1 font-medium font-satoshi">Priority</label>

					<Select.Root bind:selected={taskPriority}>
						<Select.Trigger class="w-full flex items-center">
							<Select.Value placeholder="Select task priority" />
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each taskPriorities as priority}
									<Select.Item
										class="flex items-center gap-3 justify-start"
										value={priority.value}
										label={priority.label}
									>
										<iconify-icon
											class={priority.color}
											width="20"
											icon="material-symbols:flag-outline"
										></iconify-icon>
										<span>{priority.label}</span>
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
						<Select.Input name="priority" />
					</Select.Root>
					{#if validationErrors?.priority}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]"
							>{validationErrors.priority[0]}</sub
						>
					{/if}
				</div>
				<div class="form-item w-full flex flex-col gap-1">
					<label for="description" class="text-sm mb-1 font-medium font-satoshi"
						>Assign employees</label
					>
					<HrmSelector {endpoint} {users} {access} />
					{#if $ManagersAssigned && $ManagersAssigned.length > 0}
						<div class="flex items-center flex-wrap gap-2 mt-2.5">
							{#each $ManagersAssigned as manager}
								<Pill option={manager} selected={true} mute={true} />
							{/each}
						</div>
					{/if}
					{#if validationErrors?.assignees_id}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]"
							>{validationErrors.assignees_id[0]}</sub
						>
					{/if}
				</div>
				<div class="form-item w-full flex flex-col gap-1">
					<label for="date" class="text-sm mb-1 font-medium font-satoshi">Timeline</label>
					<DatePicker
						on:datePicked={(e) => {
							start_time = e.detail.startTime;
							end_time = e.detail.endTime;
						}}
						{times}
					/>

					{#if validationErrors?.timeline}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]"
							>{validationErrors.timeline[0]}</sub
						>
					{/if}
				</div>
			</section>
		</div>
	</section>
	<Sheet.Footer class="w-full  px-3 self-end">
		<div class="w-full px-4">
			<Button
				type="submit"
				class="flex w-full bg-primary-red gap-2 items-center font-satoshi text-sm font-bold text-white py-2.5 px-3 rounded-md hover:bg-primary-100"
			>
				{#if loading}
					<iconify-icon width="25" icon="eos-icons:three-dots-loading"></iconify-icon>
				{:else if task}
					<span>Update</span>
					<iconify-icon icon="ep:right" width="15"></iconify-icon>
				{:else}
					<span> Proceed</span>

					<iconify-icon icon="ep:right" width="15"></iconify-icon>
				{/if}
			</Button>
		</div>
	</Sheet.Footer>
</form>

<style>
</style>
