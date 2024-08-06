<script lang="ts">
	import dayjs from 'dayjs';
	import localeData from 'dayjs/plugin/localeData';
	import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
	import * as Popover from '../ui/popover';
	import Button from '../ui/button/button.svelte';
	import Calendar from './Calendar.svelte';
	import { createEventDispatcher } from 'svelte';

	dayjs.extend(localeData);
	dayjs.extend(isSameOrAfter);

	dayjs().localeData();

	const dispatch = createEventDispatcher();
	let selectedDate = dayjs();
	let showCalendar = false;
	let startTime = null;
	let endTime = null;
	let startDate = null;
	let endDate = null;
	let startDateTimeString = '';
	let endDateTimeString = '';

	export let times: any | null = null;

	// $: console.log(times);

	function selectTimeline() {
		startDateTimeString = dayjs(`${startDate.format('YYYY-MM-DD')} ${startTime}`).toISOString();
		if (!endDate) {
			endDate = startDate;
		}
		endDateTimeString = dayjs(`${endDate.format('YYYY-MM-DD')} ${endTime}`).toISOString();

		dispatch('datePicked', {
			startTime: startDateTimeString,
			endTime: endDateTimeString
		});

		showCalendar = false;
	}
</script>

<Popover.Root bind:open={showCalendar}>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			type="button"
			size="lg"
			class="text-grey-100 w-full  border  flex items-center justify-between gap-1.5 px-2.5 py-2.5 outline-none focus:outline-primary-100 focus:border-primary-100 {showCalendar
				? 'border-primary-100 outline-primary-100'
				: 'border-grey-300'} "
		>
			<span class="flex-1 text-start">
				{#if times}
					{dayjs(times.startTime).format('h:mma, D-M-YYYY')} - {dayjs(times.endTime).format(
						'h:mma, D-M-YYYY'
					)}
				{:else if !startDateTimeString || !endDateTimeString}
					{selectedDate.format('MMM DD, YYYY')}
				{:else}
					{dayjs(startDateTimeString).format('h:mma, D-M-YYYY')} - {dayjs(endDateTimeString).format(
						'h:mma, D-M-YYYY'
					)}
				{/if}
			</span>
			<iconify-icon width="20" icon="solar:calendar-broken"></iconify-icon>
		</Button>
	</Popover.Trigger>

	<Popover.Content class="w-full grid  bg-white border p-4">
		<Calendar
			on:selectedDates={(e) => {
				endDate = e.detail.endDate;
				startDate = e.detail.startDate;
			}}
		/>
		<div class="flex items-center mt-4 py-4 gap-3">
			<div class="form-item w-full flex flex-col gap-1">
				<label for="start_time" class="text-sm mb-1 font-medium font-satoshi">Start time</label>

				<input
					disabled={!startDate}
					type="time"
					class="border px-3 py-2 rounded-md"
					name="start-time"
					bind:value={startTime}
				/>
			</div>
			<div class="form-item w-full flex flex-col gap-1">
				<label for="start_time" class="text-sm mb-1 font-medium font-satoshi">End time</label>

				<input
					disabled={!startTime}
					type="time"
					class="border px-3 py-2 rounded-md"
					name="end-time"
					bind:value={endTime}
				/>
			</div>
		</div>
		<div class="flex w-full items-center justify-center mt-5">
			<button
				disabled={!startDate || !startTime || !endTime}
				on:click={selectTimeline}
				type="button"
				class="bg-primary-red text-white transition duration-200 disabled:bg-pGrey py-2 px-6 disabled:text-grey-200 disabled:cursor-not-allowed text-sm rounded-md font-medium"
				>Done</button
			>
		</div>
	</Popover.Content>
</Popover.Root>
