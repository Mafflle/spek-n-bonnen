<script lang="ts">
	import CustomTable from '$lib/components/customs/CustomTable.svelte';
	import ManageTask from '$lib/components/HRM/forms/ManageTask.svelte';

	import Modal from '$lib/components/Modal.svelte';
	import { Tasks } from '$lib/hrm';
	import TaskRow from '$lib/components/customs/TaskRow.svelte';

	import { writable } from 'svelte/store';
	const currentTask = writable(null);

	export let data;
	function handleToggleEdit(event: CustomEvent) {
		const taskData = event.detail;
		currentTask.set(taskData);
		showCreate = true;
	}
	let showCreate: boolean = false;

	function toggleCreate() {
		currentTask.set(null);
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
		RowComponent: TaskRow
	};
</script>

{#if $Tasks.length > 0}
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
			<CustomTable rowsData={$Tasks} props={tableProps} on:toggleEdit={handleToggleEdit} />
		</div>
	</div>
{:else}
	<div class="empty h-full w-full flex justify-center items-center">
		<div class="empty-indicator flex flex-col justify-center items-center gap-5 w-[277px]">
			<div class="icon">
				<img src="/icons/empty-Illustration.svg" alt="empty illustration " />
			</div>
			<div class="content">
				<div class="text flex flex-col gap-3 justify-center items-center text-grey-300">
					<h3 class="title text-3xl font-medium tracking-[-0.64px]">No Task added</h3>
					<div class="info text-center text-sm font-medium leading-5 tracking-[-0.13px]">
						You currently don’t have any task saved, click the button below to create one
					</div>
				</div>
			</div>
			<div class="button">
				<button
					type="button"
					on:click={toggleCreate}
					class=" px-2.5 py-2.5 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
			hover:bg-[#C7453C]
			focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/plus.svg" alt="user-plus" />
					</div>
					<p class="text-white text-sm font-bold">Add tasks</p>
				</button>
			</div>
		</div>
	</div>
{/if}
<Modal showModal={showCreate} on:close={toggleCreate} mode="sheet">
	<ManageTask
		on:close={(e) => {
			Tasks.set(e.detail.tasks);
			showCreate = !showCreate;
		}}
		endpoint="tasks"
		slot="modal-content"
		access={data.access}
		users={data.managers.results}
		task={$currentTask}
	/>
</Modal>
