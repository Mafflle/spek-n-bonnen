<script lang="ts">
	import type { Task } from '$lib/hrm';

	export let tasks: Task[] = [];
	let currentView: 'hour' | 'day' = 'day';

	let selectedMonth = new Date().getMonth(); // Current month
	let selectedYear = new Date().getFullYear();

	function generateDays() {
		const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 (Sun) - 6 (Sat)
		const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
		const totalDays = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7; // Total cells in the calendar grid

		let days = [];

		// Add days of the current month
		for (let i = 1; i <= daysInMonth; i++) {
			days.push({ day: i, currentMonth: true });
		}

		return days;
	}
	function getTasksForDay(day) {
		const dayStart = new Date(selectedYear, selectedMonth, day); // Start of the day (00:00)
		const dayEnd = new Date(selectedYear, selectedMonth, day, 23, 59, 59); // End of the day (23:59:59)

		return tasks.filter((task) => {
			const taskStartTime = new Date(task.start_time);
			const taskEndTime = new Date(task.end_time);

			// Condition 1: Task starts and ends within the same day
			if (taskStartTime >= dayStart && taskEndTime <= dayEnd) {
				return true;
			}

			// Condition 2: Multi-day task that starts before this day and ends after it
			if (taskStartTime < dayStart && taskEndTime > dayEnd) {
				return true;
			}

			// Condition 3: Task starts before this day and ends during this day
			if (taskStartTime < dayStart && taskEndTime >= dayStart && taskEndTime <= dayEnd) {
				return true;
			}

			// Condition 4: Task starts during this day and ends after this day
			if (taskStartTime >= dayStart && taskStartTime <= dayEnd && taskEndTime > dayEnd) {
				return true;
			}

			return false; // Task does not fall within this day
		});
	}

	function switchView() {
		if (currentView === 'day') {
			currentView = 'hour';
		} else {
			currentView = 'day';
		}
	}
</script>

<button on:click={switchView}> switch view </button>

<div
	class=" flex pt-5 rounded-[16px] min-h-[544px] h-full border border-grey-200 w-full col-span-full overflow-x-scroll no-scrollbar"
>
	{#if currentView === 'day'}
		{#each generateDays() as day}
			<div
				class=" relative flex min-w-20 flex-col items-center max-h-full mt-8 border-r border-grey-200"
			>
				<h5 class=" text-center absolute -top-7 text-grey-100 text-sm">{day.day}</h5>

				{#each getTasksForDay(day.day) as task}
					<div class="absolute bg-white border rounded-[16px] z-10 min-w-36">
						<p>{task.title}</p>
					</div>
				{/each}
			</div>
		{/each}
	{/if}
</div>
<!-- </div> -->
<!-- </section> -->
