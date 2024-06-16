<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import ClockInOut from './ClockInOut.svelte';

	type ShiftType = 'Morning' | 'Afternoon' | 'Off';

	interface WorkDay {
		day: string;
		id: number;
		clockInTime: string | null;
		clockOutTime: string | null;
	}

	const workSchedule: WorkDay[] = [
		{ id: 1, day: 'Monday', clockInTime: '09:00 AM', clockOutTime: '05:00 PM' },
		{ id: 2, day: 'Tuesday', clockInTime: '01:00 PM', clockOutTime: '09:00 PM' },
		{ id: 3, day: 'Wednesday', clockInTime: '09:00 AM', clockOutTime: '05:00 PM' },
		{ id: 4, day: 'Thursday', clockInTime: '01:00 PM', clockOutTime: '09:00 PM' },
		{ id: 5, day: 'Friday', clockInTime: '09:00 AM', clockOutTime: '05:00 PM' },
		{ id: 6, day: 'Saturday', clockInTime: '01:00 PM', clockOutTime: '09:00 PM' },
		{ id: 0, day: 'Sunday', clockInTime: null, clockOutTime: null }
	];

	let today = new Date();
</script>

<div class="w-full h-fit overflow-clip border border-grey-300 mt-8 rounded-xl">
	<Table.Root class="">
		<Table.Caption>This week's schedule.</Table.Caption>
		<Table.Header class="sticky top-0">
			<Table.Row class="h-[55px] bg-[#F9F9F9] font-satoshi font-medium ">
				<Table.Head class=" text-grey-200 ">Day</Table.Head>
				<!-- <Table.Head class="text-grey-200">Shift</Table.Head> -->
				<Table.Head class="text-grey-200 text-center">Start Time</Table.Head>
				<Table.Head class="text-grey-200 text-center">End Time</Table.Head>
				<Table.Head class="text-grey-200 text-center">Clock In/Out</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each workSchedule as schedule, i (i)}
				<Table.Row
					class="h-[100px] {!(today.getDay() === schedule.id) &&
						'opacity-40 cursor-not-allowed bg-gray-50'}"
				>
					<Table.Cell class="font-medium  text-grey-100 ">{schedule.day}</Table.Cell>

					<Table.Cell class="font-medium  text-grey-100 text-center"
						>{schedule.clockInTime}</Table.Cell
					>
					<Table.Cell class="font-medium  text-grey-100 text-center"
						>{schedule.clockOutTime}</Table.Cell
					>
					<Table.Cell class="font-medium  text-grey-100">
						<ClockInOut disabled={!(today.getDay() === schedule.id)} />
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
