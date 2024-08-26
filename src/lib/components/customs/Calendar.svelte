<script>
	import dayjs from 'dayjs';
	import localeData from 'dayjs/plugin/localeData';
	import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	dayjs.extend(localeData);
	dayjs.extend(isSameOrAfter);

	dayjs().localeData();

	let selectedDate = dayjs();

	let startDate = null;

	let endDate = null;
	let isSelectingStart = true; // Flag to track if selecting start or end date

	// $: console.log('start', startDate);
	// $: console.log('end', endDate);

	function prevMonth() {
		selectedDate = selectedDate.subtract(1, 'month');
	}

	function nextMonth() {
		selectedDate = selectedDate.add(1, 'month');
	}

	function generateCalendarDays() {
		const startOfMonth = selectedDate.startOf('month');
		const endOfMonth = selectedDate.endOf('month');
		const days = [];

		// Fill in days before the start of the month
		for (let i = 0; i < startOfMonth.day(); i++) {
			days.push(startOfMonth.subtract(i + 1, 'day'));
		}

		// Days of the current month
		let day = startOfMonth;
		while (day.isBefore(endOfMonth) || day.isSame(endOfMonth)) {
			days.push(day);
			day = day.add(1, 'day');
		}
		return days.map((day) => ({
			date: day
		}));
	}

	function selectDate(day) {
		selectedDate = day; // Track the currently selected date

		// User is selecting the first date (or re-selecting a single date)
		if (!startDate || (startDate && !endDate)) {
			startDate = day;
			isSelectingStart = false; // No need to select a range anymore
		} else {
			// User is selecting the end date of a range
			if (day.isBefore(startDate, 'day')) {
				// Swap start and end dates if end date is before start date
				endDate = startDate;
				startDate = day;
			} else {
				endDate = day;
			}

			// If dates are the same, treat it as a single date selection
			if (startDate.isSame(endDate, 'day')) {
				endDate = null;
			}

			isSelectingStart = true; // Ready to select a new start date
		}

		// Dispatch an event with the selected dates (null if single date)
		dispatch('selectedDates', { startDate, endDate });
	}

	const dispatch = createEventDispatcher();

	function getDaysOfWeek() {
		return dayjs.weekdaysShort();
	}
</script>

<div transition:fly={{ y: 200, duration: 200 }} class="calendar-container min-w-full w-full">
	<header class="flex items-center gap-4 justify-center border-b pb-2">
		<button type="button" class="prev-btn" on:click={prevMonth}>Prev</button>
		<span class="text-lg font-semibold">{selectedDate.format('MMMM YYYY')}</span>
		<button type="button" class="next-btn" on:click={nextMonth}>Next</button>
	</header>

	<div class="days-of-week grid grid-cols-7 text-center pt-2">
		{#each getDaysOfWeek() as dayOfWeek}
			<div class="text-sm font-medium text-gray-500">{dayOfWeek}</div>
		{/each}
	</div>

	<div class="days grid grid-cols-7 gap-2 mt-2">
		{#each generateCalendarDays() as day}
			<button
				type="button"
				disabled={day.date.isBefore(dayjs(), 'day')}
				class="day-btn relative"
				class:current={day.date.isSame(selectedDate, 'day')}
				class:today={day.date.isSame(dayjs(), 'day')}
				class:not-current-month={!day.date.isSame(selectedDate, 'month')}
				class:disabled={day.date.isBefore(dayjs(), 'day')}
				class:start-date={day.date.isSame(startDate, 'day')}
				class:end-date={day.date.isSame(endDate, 'day')}
				class:in-range={day.date.isAfter(startDate, 'day') && day.date.isBefore(endDate, 'day')}
				on:click={() => selectDate(day.date)}
			>
				{day.date.format('D')}
			</button>
		{/each}
	</div>
</div>
