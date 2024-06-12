<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import ClockInOut from './ClockInOut.svelte';

	type ShiftType = 'Morning' | 'Afternoon' | 'Off';

	interface WorkDay {
		day: string;
		shift: ShiftType;
		clockInTime: string | null;
		clockOutTime: string | null;
	}

	const workSchedule: WorkDay[] = [
		{ day: 'Monday', shift: 'Morning', clockInTime: '09:00 AM', clockOutTime: '05:00 PM' },
		{ day: 'Tuesday', shift: 'Afternoon', clockInTime: '01:00 PM', clockOutTime: '09:00 PM' },
		{ day: 'Wednesday', shift: 'Morning', clockInTime: '09:00 AM', clockOutTime: '05:00 PM' },
		{ day: 'Thursday', shift: 'Afternoon', clockInTime: '01:00 PM', clockOutTime: '09:00 PM' },
		{ day: 'Friday', shift: 'Morning', clockInTime: '09:00 AM', clockOutTime: '05:00 PM' }
		// { day: 'Saturday', shift: 'Afternoon', clockInTime: '01:00 PM', clockOutTime: '09:00 PM' },
		// { day: 'Sunday', shift: 'Off', clockInTime: null, clockOutTime: null } // Day off
	];
</script>

<div class="w-full h-fit overflow-clip border border-grey-300 mt-8 rounded-xl">
	<Table.Root class="px-2 gap-5">
		<Table.Caption>This week's schedule.</Table.Caption>
		<Table.Header class="">
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
				<Table.Row class="h-[100px] ">
					<Table.Cell class="font-medium  text-grey-100 ">{schedule.day}</Table.Cell>

					<Table.Cell class="font-medium  text-grey-100 text-center"
						>{schedule.clockInTime}</Table.Cell
					>
					<Table.Cell class="font-medium  text-grey-100 text-center"
						>{schedule.clockOutTime}</Table.Cell
					>
					<Table.Cell class="font-medium  text-grey-100">
						<ClockInOut />
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
