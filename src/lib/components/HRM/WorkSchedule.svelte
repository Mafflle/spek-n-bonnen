<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';

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
		{ day: 'Friday', shift: 'Morning', clockInTime: '09:00 AM', clockOutTime: '05:00 PM' },
		{ day: 'Saturday', shift: 'Afternoon', clockInTime: '01:00 PM', clockOutTime: '09:00 PM' },
		{ day: 'Sunday', shift: 'Off', clockInTime: null, clockOutTime: null } // Day off
	];
</script>

<div class="w-full max-w-[700px] h-fit overflow-clip border border-grey-300 mt-10 rounded-xl">
	<Table.Root class="px-2 gap-5">
		<Table.Caption>This week's schedule.</Table.Caption>
		<Table.Header class="">
			<Table.Row class="h-[55px] bg-[#F9F9F9] font-satoshi font-medium ">
				<Table.Head class=" text-grey-200">Day</Table.Head>
				<!-- <Table.Head class="text-grey-200">Shift</Table.Head> -->
				<Table.Head class="text-grey-200">Start Time</Table.Head>
				<Table.Head class="text-grey-200">End Time</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each workSchedule as schedule, i (i)}
				<Table.Row class="h-[100px] cursor-pointer">
					<Table.Cell class="font-medium  text-grey-100">{schedule.day}</Table.Cell>
					<!-- <Table.Cell class="font-medium  text-grey-100">{schedule.shift}</Table.Cell> -->
					<Table.Cell class="font-medium  text-grey-100">{schedule.clockInTime}</Table.Cell>
					<Table.Cell class="font-medium  text-grey-100">{schedule.clockOutTime}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
