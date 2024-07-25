<script lang="ts">
	import CustomTable from '$lib/components/customs/CustomTable.svelte';
	import CreateTask from '$lib/components/HRM/forms/CreateTask.svelte';
	import TaskTab from '$lib/components/HRM/tabs/TaskTab.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { type Task, Tasks } from '$lib/hrm';
	import { shortenText } from '$lib/utils.js';
	import * as Avatar from '$lib/components/ui/avatar';
	import dayjs from 'dayjs';
	import TaskRow from '$lib/components/customs/TaskRow.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	function toggleCurrTask(task: Task) {
		currentTask.set(task);
		dispatch('open');
	}

	export let data;

	let showCreate: boolean = false;

	function toggleCreate() {
		showCreate = !showCreate;
	}

	Tasks.set(data.allTasks.results);

	let tableProps = {
		columns: [
			{ name: 'Task' },
			{ name: 'Assignees' },
			{ name: 'Priority' },
			{ name: 'End time' },
			{ name: '' }
		],
		RowComponent: TaskRow,
		RowsData: $Tasks,
		Data: data
	};
</script>

<div class="tasks-page flex-col items-start w-full max-w-full lg:p-0 md:p-4">
	<div class="manage w-full flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers w-full flex flex-col items-start gap-[0.25rem]">
			<div class="text-[2rem] tracking-[-0.04rem] font-bold">Task management</div>
			<sub class="text-[#6B6B6B] text-sm"> Manage assign tasks.</sub>
		</div>
		<div class="filters flex items-center w-full justify-between">
			<div
				class="flex items-center md:w-[24em] border gap-2 rounded-md border-[#D9D9D9] text-[#232222] px-2"
			>
				<span>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
							stroke="#A9A9A9"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M21 20.9999L16.65 16.6499"
							stroke="#A9A9A9"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
				<input type="text" placeholder="Type here" class=" py-2 flex-auto outline-none" />
			</div>

			<div class="filter-buttons flex items-start gap-5">
				<button
					on:click={toggleCreate}
					class=" px-2.5 py-2 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
                        hover:bg-[#C7453C]
                        focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/plus.svg" alt="user-plus" />
					</div>
					<span class="text-white text-sm font-bold font-satoshi hidden sm:block">
						Create task
					</span>
				</button>
			</div>
		</div>
	</div>

	<div class="w-full">
		<CustomTable props={tableProps} />
		<!-- {#if Tasks.length > 0}
		{#each Tasks as task}
			<div
				on:click={() => toggleCurrTask(task)}
				class="col-span-1 cursor-pointer flex flex-col w-full border-2 min-h-[170px] p-4 gap-1 rounded-xl"
			>
				<section class="flex items-center justify-between">
					<h5 class="text-primary-red text-xs">Task Name</h5>
					<span
						class="bg-primary-green text-xs xl:text-sm text-[#41AA00] text-center py-0.5 px-4 rounded-3xl"
					>
						{task.status}
					</span>
				</section>
				<section class="grid text-grey-100 mb-auto">
					<h6 class="text-sm xl:text-lg font-satoshi font-medium">{task.title}</h6>
					<p class="xl:text-sm text-xs font-satoshi">
						{shortenText(task.description, 100)}
					</p>
				</section>
				<section class="flex items-center justify-between">
					<section class="flex items-center gap-2">
						<div class="flex items-center -space-x-2">
							{#each task.assignees as assignee, i}
								<Avatar.Root class="w-6 h-6">
									<Avatar.Image
										class="w-full h-full object-cover"
										src={assignee?.staff_profile?.profile_picture.image}
									/>
									<Avatar.Fallback class="text-xs"
										>{assignee?.email.substring(0, 2).toLocaleUpperCase()}</Avatar.Fallback
									>
								</Avatar.Root>
							{/each}
						</div>
						<span class="text-primary-softPink-50 text-xs">GroupA</span>
					</section>
					<div class=" flex items-center gap-1 text-primary-softPink-50">
						<img class="w-3.5 h-3.5" src="/icons/TaskClock.svg" alt="clock icon" />
						<span class="text-xs">{dayjs(task.end_time).diff(task.start_time, 'hour')}/hrs</span>
					</div>
				</section>
			</div>
		{/each}
	{:else}
		No Tasks created yet
	{/if} -->
	</div>
</div>

<Modal showModal={showCreate} on:close={toggleCreate} mode="sheet">
	<CreateTask
		endpoint="tasks"
		slot="modal-content"
		access={data.access}
		users={data.managers.results}
		on:close={toggleCreate}
	/>
</Modal>
