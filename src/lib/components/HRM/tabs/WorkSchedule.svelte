<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import ClockInOut from '$lib/components/HRM/forms/ClockInOut.svelte';
	import type { Schedule } from '$lib/hrm';
	import { createEventDispatcher } from 'svelte';

	export let viewType: 'employee' | 'manager' = 'employee';

	const dispatch = createEventDispatcher();

	export let workSchedule: Schedule[] = [];

	let today = new Date();

	function getDayOfTheWeek(day: number) {
		switch (day) {
			case 1:
				return 'Monday';
			case 2:
				return 'Tuesday';
			case 3:
				return 'Wednesday';
			case 4:
				return 'Thursday';
			case 5:
				return 'Friday';
			case 6:
				return 'Saturday';
			case 7:
				return 'Sunday';
			default:
				break;
		}
	}
</script>

{#if workSchedule.length > 0}
	<div class="w-full h-fit overflow-clip border border-grey-300 rounded-xl">
		<Table.Root class="">
			<Table.Caption
				>This {viewType === 'employee' ? "week's" : "employee's"} schedule.</Table.Caption
			>
			<Table.Header class="sticky top-0">
				<Table.Row class="h-[55px] bg-[#F9F9F9] font-satoshi font-medium ">
					<Table.Head class=" text-grey-200 ">Day</Table.Head>
					<!-- <Table.Head class="text-grey-200">Shift</Table.Head> -->
					<Table.Head class="text-grey-200 text-center">Start Time</Table.Head>
					<Table.Head class="text-grey-200 text-center">End Time</Table.Head>
					<Table.Head class="text-grey-200 text-center">
						{#if viewType === 'employee'}
							Clock In/Out
						{/if}
					</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each workSchedule as schedule, i (i)}
					<Table.Row
						class="h-[100px] {viewType === 'employee' &&
							!(today.getDay() === schedule.id) &&
							'opacity-40 cursor-not-allowed bg-gray-50'}"
					>
						<Table.Cell class="font-medium  text-grey-100 "
							>{getDayOfTheWeek(schedule.day_of_week)}</Table.Cell
						>

						<Table.Cell class="font-medium  text-grey-100 text-center"
							>{schedule.start_time}</Table.Cell
						>
						<Table.Cell class="font-medium  text-grey-100 text-center"
							>{schedule.end_time}</Table.Cell
						>
						<Table.Cell class="font-medium  text-grey-100">
							{#if viewType === 'employee'}
								<ClockInOut {schedule} disabled={!(today.getDay() === schedule.id)} />
							{:else if viewType === 'manager'}
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
												on:click={() => dispatch('editSchedule', { schedule })}
												class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
											>
												<img src="/icons/edit.svg" alt="edit icon" />
												<span class="text-grey-100">Edit</span>
											</Button>
										</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							{/if}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
{:else}
	<div class="empty min-h-[60vh] h-full w-full flex justify-center items-center">
		<div class="empty-indicator h-full flex flex-col justify-center items-center gap-5 w-[277px]">
			<div class="icon">
				<img src="/icons/empty-Illustration.svg" alt="empty illustration " />
			</div>
			<div class="content">
				<div class="text flex flex-col gap-3 justify-center items-center text-grey-300">
					<h3 class="title text-3xl text-center font-medium tracking-[-0.64px]">
						No Work Schedule added
					</h3>
					<div class="info text-center text-sm font-medium leading-5 tracking-[-0.13px]">
						{viewType === 'manager' ? "This employee currently doesn't" : 'You currently don’t'} have
						any work schedule saved{viewType === 'manager'
							? ', click the button below to create one'
							: '.'}
					</div>
				</div>
			</div>
			{#if viewType === 'manager'}
				<div class="button">
					<button
						on:click={() => dispatch('createSchedule')}
						class=" px-2.5 py-2.5 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
			hover:bg-[#C7453C]
			focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
					>
						<div class="w-5 h-5 relative">
							<img src="/icons/plus.svg" alt="user-plus" />
						</div>
						<p class="text-white text-sm font-bold">Create Work Schedule</p>
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}
