<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';

	import { container } from '$lib/stores.js';
	import { onDestroy } from 'svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Avatar from '$lib/components/ui/avatar';

	import { type Schedule, workSchedules, type Task } from '$lib/hrm.js';
	import dayjs from 'dayjs';
	import Button from '$lib/components/ui/button/button.svelte';

	import WorkSchedule from '$lib/components/HRM/tabs/WorkSchedule.svelte';
	import ManageSchedule from '$lib/components/HRM/forms/ManageSchedule.svelte';
	import TaskTab from '$lib/components/HRM/tabs/TaskTab.svelte';
	import Profile from '$lib/components/HRM/tabs/Profile.svelte';

	export let data;

	let { userAccount, userTasks, userSchedule } = data;

	let showScheduleModal: boolean = false;
	let showTaskDetails: boolean = false;

	let validationErrors: {
		email?: [string];
		last_name?: [string];
		first_name?: [string];
		password?: [string];
		password2?: [string];
		groups?: [string];
	} = {};
	$: currentTab = 'schedules';

	$: workSchedules.set(userSchedule.results);

	let currentTask: Task | null;
	let currentSchedule: Schedule | null;

	function toggleScheduleModal(schedule?: Schedule) {
		if (schedule) {
			currentSchedule = schedule;
		} else {
			currentSchedule = null;
		}
		showScheduleModal = !showScheduleModal;
	}

	function toggleTaskDetails(task?: Task) {
		if (task) {
			currentTask = task;
		} else {
			currentTask = null;
		}

		showTaskDetails = !showTaskDetails;
	}

	console.log(userAccount);

	onDestroy(() => {
		container.set([]);
	});
</script>

<svelte:head>
	<title>Staffs - Spek-n-Boonen</title>
</svelte:head>

<div class="staff-page flex-col items-start w-full max-w-full lg:p-0 md:p-4">
	<div class="manage w-full flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers w-full flex flex-col items-start gap-[0.25rem]">
			<div class="text-[2rem] tracking-[-0.04rem] font-bold">Employee Profile</div>
			<sub class="text-[#6B6B6B] text-sm">
				Manage employee profile, assign roles and create schedules
			</sub>
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
				{#if currentTab === 'schedules'}
					<button
						on:click={() => toggleScheduleModal()}
						class=" px-2.5 py-2 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
                    hover:bg-[#C7453C]
                    focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
					>
						<div class="w-5 h-5 relative">
							<img src="/icons/plus.svg" alt="user-plus" />
						</div>
						<span class="text-white text-xs font-bold font-satoshi hidden sm:block">
							Create work schdule
						</span>
					</button>
				{/if}
			</div>
		</div>
	</div>

	<Tabs.Root bind:value={currentTab} class="w-full ">
		<Tabs.List
			class=" h-[70px] justify-start oveflow-x-scroll bg-[#F7F7F7] flex flex-wrap px-6   space-x-5 md:flex-wrap-none mb-12 md:pb-1 "
		>
			<Tabs.Trigger
				class="data-[state=active]:bg-background data-[state=active]:font-medium font-normal w-36 data-[state=active]:text-grey-100 data-[state=active]:shadow"
				value="profile">Profile</Tabs.Trigger
			>
			<Tabs.Trigger
				class="data-[state=active]:bg-background data-[state=active]:font-medium font-normal w-36 data-[state=active]:text-grey-100 data-[state=active]:shadow"
				value="tasks">Tasks</Tabs.Trigger
			>
			<Tabs.Trigger
				class="data-[state=active]:bg-background data-[state=active]:font-medium font-normal w-36 data-[state=active]:text-grey-100 data-[state=active]:shadow"
				value="schedules">Work schedule</Tabs.Trigger
			>
			<Tabs.Trigger
				class="data-[state=active]:bg-background data-[state=active]:font-medium font-normal w-36 data-[state=active]:text-grey-100 data-[state=active]:shadow"
				value="vacation">Vacation</Tabs.Trigger
			>
			<!-- <Tabs.Trigger
				class="data-[state=active]:bg-background data-[state=active]:font-medium font-normal w-36 data-[state=active]:text-grey-100 data-[state=active]:shadow"
				value="balance">Balance</Tabs.Trigger
			> -->
		</Tabs.List>

		<Tabs.Content class="w-full" value="profile">
			<Profile view="manager" currentProfile={userAccount} />
		</Tabs.Content>
		<Tabs.Content class="w-full" value="tasks">
			<TaskTab Tasks={userTasks.results} />
		</Tabs.Content>
		<Tabs.Content class="w-full" value="schedules">
			<WorkSchedule
				workSchedule={$workSchedules}
				on:createSchedule={() => toggleScheduleModal()}
				on:editSchedule={(e) => toggleScheduleModal(e.detail.schedule)}
				viewType="manager"
			/>
		</Tabs.Content>
	</Tabs.Root>
</div>

<Modal mode="sheet" on:close={() => toggleScheduleModal()} showModal={showScheduleModal}>
	<div slot="modal-content" class="w-full h-fit max-h-full overflow-x-scroll no-scrollbar">
		{#if currentTab === 'schedules'}
			<ManageSchedule
				on:add-WH={() => (currentTab = 'profile')}
				bind:schedule={currentSchedule}
				on:close={() => toggleScheduleModal()}
			/>
			<!-- {:else if currentTab === 'tasks'} -->
		{/if}
	</div>
</Modal>

<Modal showModal={showTaskDetails} on:close={() => toggleTaskDetails()}>
	<div
		slot="modal-content"
		class="min-w-[460px] max-w-md col-span-1 flex flex-col min-h-[132px] py-4 px-8 gap-1 rounded-xl w-full bg-white"
	>
		{#if currentTask}
			<section class="flex items-center justify-end mb-2">
				<button on:click={() => toggleTaskDetails()}>
					<iconify-icon icon="hugeicons:cancel-01" width="25" class="text-grey-100"></iconify-icon>
				</button>
			</section>
			<section class="flex items-center justify-between">
				<h5 class="text-primary-red">{currentTask.title}</h5>
				<span
					class="bg-primary-green text-[10px] xl:text-sm text-[#41AA00] min-w-[77px] py-1 px-2.5 rounded-3xl"
				>
					{currentTask.status}
				</span>
			</section>
			<section class="grid text-grey-100 mb-5">
				<h6 class="text-xl font-satoshi font-medium">Solve all ticket enquiry</h6>
				<p class="text-sm xl:text-base font-satoshi">
					Lorem ipsum dolor sit amet, consectetur adipis, sed do eiusmod tempor incididunt ut labore
					et Lorem ipsum dolor sit amet, consectetur adipis,sed do eiusmod tempor incididunt ut
					labore et Lorem ipsum dolor sit amet, consectetur adipis,sed do eiusmod tempor incididunt
					ut labore et
				</p>
			</section>
			<section class="flex items-center justify-between mb-5">
				<section class="flex items-center gap-2">
					<div class="flex items-center -space-x-2">
						{#each currentTask.assignees as assignee, i}
							<Avatar.Root class="w-7 h-7">
								<Avatar.Image
									class="w-full h-full object-cover"
									src={assignee?.staff_profile?.profile_picture.image}
								/>
								<Avatar.Fallback class="text-sm"
									>{assignee?.email.substring(0, 2).toLocaleUpperCase()}</Avatar.Fallback
								>
							</Avatar.Root>
						{/each}
					</div>
					<span class="text-primary-softPink-50">GroupA</span>
				</section>
				<div class=" flex items-center gap-1 text-primary-softPink-50">
					<img class="w-5 h-5" src="/icons/TaskClock.svg" alt="clock icon" />
					<span>{dayjs(currentTask.end_time).diff(currentTask.start_time, 'hour')}/hrs</span>
				</div>
			</section>
			<section class="flex items-center justify-center gap-7">
				<Button
					on:click={() => {
						showTaskDetails = false;
						toggleScheduleModal();
					}}
					variant="outline"
					class="border-primary-red border text-primary-red">Edit Task</Button
				>
				<Button class="bg-primary-red border">Delete Task</Button>
			</section>
		{/if}
	</div>
</Modal>
