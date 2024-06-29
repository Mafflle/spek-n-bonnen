<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';

	import { container } from '$lib/stores.js';
	import { Users, type User } from '$lib/user.js';
	import { onDestroy } from 'svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Avatar from '$lib/components/ui/avatar';
	import User from '$lib/components/User.svelte';
	import InviteStaff from '$lib/components/HRM/InviteStaff.svelte';
	import CreateTask from '$lib/components/HRM/CreateTask.svelte';
	import { Tasks, type Task } from '$lib/hrm.js';
	import dayjs from 'dayjs';
	import Button from '$lib/components/ui/button/button.svelte';
	import { shortenText } from '$lib/utils.js';

	export let data;

	let { groups, access, users, tasks } = data;

	Tasks.set(tasks.results as Task[]);

	let showModal: boolean = false;
	let showTaskDetails: boolean = false;

	let validationErrors: {
		email?: [string];
		last_name?: [string];
		first_name?: [string];
		password?: [string];
		password2?: [string];
		groups?: [string];
	} = {};
	$: currentTab = 'tasks';

	const staffManagers = data.staffManagers.results as User[];
	let currentTask: Task | null;

	$Users = users.results;

	const toggleModal = () => {
		showModal = !showModal;
	};

	function toggleTaskDetails(task?: Task) {
		if (task) {
			currentTask = task;
		} else {
			currentTask = null;
		}

		showTaskDetails = !showTaskDetails;
	}

	// $: console.log(currentTask);
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
			<div class="text-[2rem] tracking-[-0.04rem] font-bold">Staff management</div>
			<sub class="text-[#6B6B6B] text-sm"> Manage employees, assign roles and tasks </sub>
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
					on:click={toggleModal}
					class=" px-2.5 py-2 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
                    hover:bg-[#C7453C]
                    focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/plus.svg" alt="user-plus" />
					</div>
					<span class="text-white text-sm font-bold font-satoshi hidden sm:block">
						{#if currentTab === 'staffs'}
							Invite new user
						{:else if currentTab === 'tasks'}
							Create task
						{/if}
					</span>
				</button>
			</div>
		</div>
	</div>

	<Tabs.Root bind:value={currentTab} class="w-full ">
		<Tabs.List
			class=" h-[70px] justify-start oveflow-x-scroll bg-[#F7F7F7] flex flex-wrap px-6  xl:pl-10 space-x-8 md:flex-wrap-none mb-12 md:pb-1 "
		>
			<Tabs.Trigger
				class="data-[state=active]:bg-background font-normal w-28 data-[state=active]:text-grey-100 data-[state=active]:shadow"
				value="staffs">Staffs</Tabs.Trigger
			>
			<Tabs.Trigger
				class="data-[state=active]:bg-background data-[state=active]:font-medium font-normal w-28 data-[state=active]:text-grey-100 data-[state=active]:shadow"
				value="tasks">Tasks</Tabs.Trigger
			>
			<Tabs.Trigger
				class="data-[state=active]:bg-background font-normal w-28 data-[state=active]:text-grey-100 data-[state=active]:shadow"
				value="work-schedule">Work schedule</Tabs.Trigger
			>
			<Tabs.Trigger
				class="data-[state=active]:bg-background font-normal w-28 data-[state=active]:text-grey-100 data-[state=active]:shadow"
				value="origin">Origin</Tabs.Trigger
			>
			<Tabs.Trigger
				class="data-[state=active]:bg-background font-normal w-28 data-[state=active]:text-grey-100 data-[state=active]:shadow"
				value="destination">Destination</Tabs.Trigger
			>
		</Tabs.List>
		<!-- <Separator data-separator-root class="hidden md:block" /> -->
		<Tabs.Content class="w-full   " value="staffs">
			<div class="border rounded-xl w-full max-w-full overflow-x-scroll no-scrollbar">
				<table class="table">
					<thead class="">
						<tr class="">
							<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">Name</th>
							<th class="bg-[#F9F9F9]">Email</th>
							<th class="bg-[#F9F9F9]">Role</th>
							<th class="bg-[#F9F9F9]">Date</th>
							<th class="bg-[#F9F9F9]">Status</th>

							<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></th>
						</tr>
					</thead>
					<tbody>
						{#each $Users as user}
							{#if user.is_staff}
								<User {user} />
							{/if}
						{/each}
					</tbody>
				</table>
			</div>
		</Tabs.Content>
		<Tabs.Content class="w-full" value="tasks">
			<div class="grid grid-cols-3 gap-4 xl:gap-6 xl:grid-cols-3">
				{#each $Tasks as task, i}
					<div
						on:click={() => toggleTaskDetails(task)}
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
												>{assignee.email.substring(0, 2).toLocaleUpperCase()}</Avatar.Fallback
											>
										</Avatar.Root>
									{/each}
								</div>
								<span class="text-primary-softPink-50 text-xs">GroupA</span>
							</section>
							<div class=" flex items-center gap-1 text-primary-softPink-50">
								<img class="w-3.5 h-3.5" src="/icons/TaskClock.svg" alt="clock icon" />
								<span class="text-xs">{dayjs(task.end_time).diff(task.start_time, 'hour')}/hrs</span
								>
							</div>
						</section>
					</div>
				{/each}
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>

<Modal mode="sheet" on:close={toggleModal} {showModal}>
	<div slot="modal-content" class="w-full h-fit max-h-full overflow-x-scroll no-scrollbar">
		{#if currentTab === 'staffs'}
			<InviteStaff {groups} {access} {staffManagers} />
		{:else if currentTab === 'tasks'}
			<CreateTask
				on:close={() => {
					currentTask = null;
					toggleModal();
				}}
				task={currentTask}
				{access}
				users={users.results}
			/>
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
								<!-- {#if assignee.staff_profile} -->
								<Avatar.Image
									class="w-full h-full object-cover"
									src={assignee?.staff_profile?.profile_picture.image}
								/>
								<Avatar.Fallback class="text-sm"
									>{assignee?.email.substring(0, 2).toLocaleUpperCase()}</Avatar.Fallback
								>
								<!-- {/if} -->
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
						toggleModal();
					}}
					variant="outline"
					class="border-primary-red border text-primary-red">Edit Task</Button
				>
				<Button class="bg-primary-red border">Delete Task</Button>
			</section>
		{/if}
	</div>
</Modal>
