<script lang="ts">
	import dayjs from 'dayjs';
	import Modal from '../../Modal.svelte';
	import Separator from '../../ui/separator/separator.svelte';
	import { TimeEntries, type TimeEntry, type Schedule } from '../../../hrm';
	import { formatTime, showToast } from '$lib/utils';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { createEventDispatcher, onDestroy } from 'svelte';

	let todaysEntries = filterTodaysEntries($TimeEntries);

	let timerState: 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END' =
		todaysEntries.length > 0 ? todaysEntries[0].event_type : 'CLOCK_IN';
	let showModal: boolean = false;
	export let disabled: boolean = false;

	export let schedule: Schedule;
	let loading: boolean = false;

	$: actionToPerform = 'Clock me in';

	let eventTime;

	function handleEntryAction(newState: 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END') {
		timerState = newState;

		if (newState === 'CLOCK_OUT') {
			eventTime = schedule.end_time;
			actionToPerform = 'Clock me out';
		} else if (newState === 'BREAK_START') {
			actionToPerform = 'Pause';
		} else if (newState === 'CLOCK_IN') {
			if (!!todaysEntries.find((entry) => entry.event_type === newState)) {
				timerState = 'BREAK_END';
				actionToPerform = 'Resume';
			} else {
				actionToPerform = 'Clock me in';
			}
			eventTime = schedule.start_time;
		}
		showModal = true;
		// Add your timer logic here based on newState
	}

	const submit: SubmitFunction = ({ formData }) => {
		loading = true;
		formData.append('event_type', `${timerState}`);
		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					const newEntry = result.data.newTimeEntry;
					TimeEntries.update((entries) => {
						return [newEntry, ...entries];
					});

					showToast('Time entry successful', 'success');
					showModal = false;
				} else if (result.status === 400) {
					if (result.data.non_field_errors) {
						showToast(`${result.data.non_field_errors}`, 'error');
					} else {
						showToast('Ooops something went wrong', 'error');
					}
				} else {
					showToast('Oops something went wrong', 'error');
					console.log(result);
				}
			} finally {
				update();
				loading = false;
			}
		};
	};

	const clockStates: {
		src: string;
		activeSrc: string;
		alt: string;
		state: 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END';
	}[] = [
		{
			src: 'play-icon.svg',
			activeSrc: 'play-icon(active).svg',
			alt: 'Play icon',
			state: 'CLOCK_IN'
		},
		{
			src: 'pause-icon.svg',
			activeSrc: 'pause-icon(active).svg',
			alt: 'Pause icon',
			state: 'BREAK_START'
		},
		{
			src: 'stop-icon.svg',
			activeSrc: 'stop-icon(active).svg',
			alt: 'Stop icon',
			state: 'CLOCK_OUT'
		}
	];

	function filterTodaysEntries(entries: TimeEntry[]) {
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Start of today

		return entries.filter((entry) => {
			const entryDate = new Date(entry.timestamp);
			return entryDate >= today;
		});
	}

	let timeString: string = '';
	let intervalId;

	function updateClock() {
		const now = new Date();

		timeString = dayjs(now).format('hh:mm A');
	}

	intervalId = setInterval(updateClock, 1000);

	onDestroy(() => {
		clearInterval(intervalId); // Clear the interval
	});

	function disableButton(state: string, todaysEntries: TimeEntry[]) {
		if (state === 'CLOCK_IN') {
			return (
				!!todaysEntries.find((entry) => entry.event_type === state) &&
				todaysEntries.length > 0 &&
				todaysEntries[0].event_type !== 'BREAK_START'
			);
		} else if (state === 'CLOCK_OUT') {
			return (
				todaysEntries.length === 0 ||
				!!todaysEntries.find((entry) => entry.event_type === 'CLOCK_OUT') ||
				todaysEntries[0].event_type === 'BREAK_START'
			);
		} else if (state === 'BREAK_START') {
			return (
				todaysEntries.length === 0 ||
				!!todaysEntries.find((entry) => entry.event_type === 'CLOCK_OUT')
			);
		}
		return !!todaysEntries.find((entry) => entry.event_type === state);
	}
</script>

<span class="flex items-center gap-3.5 justify-center">
	{#each clockStates as state}
		<button
			class="p-0 disabled:cursor-not-allowed"
			on:click={() => handleEntryAction(state.state)}
			disabled={disabled || disableButton(state.state, todaysEntries)}
		>
			<img
				class="w-full h-full transition-all"
				src="/icons/{todaysEntries.length > 0 &&
				todaysEntries[0].event_type === state.state &&
				!disabled
					? state.activeSrc
					: state.src}"
				alt={state.alt}
			/>
		</button>
	{/each}
</span>

<Modal mode="dialog" {showModal} on:close={() => (showModal = false)}>
	<form
		action="?/manage_time_entry"
		method="post"
		use:enhance={submit}
		class="min-w-[400px] pb-6 text-black-100 max-w-[510px] w-full rounded-none"
		slot="modal-content"
	>
		<section class="flex justify-between p-4 items-center">
			<div class="flex gap-2 items-center">
				<div class="w-8 h-7">
					<img class="w-full h-full" src="/icons/ScheduleClock.svg" alt="clock icon" />
				</div>
				<h3 class="font-poppins font-semibold text-primary-50">
					{#if showModal}
						{actionToPerform}
					{/if}
				</h3>
			</div>
			<button class="w-fit h-fit" on:click={() => (showModal = false)}>
				<span class="w-7 h-7">
					<img class="w-full h-full" src="/icons/CloseIcon.svg" alt="close icon" />
				</span>
			</button>
		</section>
		<Separator />
		<section
			class="text-black-100 flex-col flex items-center justify-center gap-2 h-[230px] w-full"
		>
			<p class="text-2xl font-bold">{dayjs(new Date()).format('DD MMMM YYYY')}</p>
			<h2 class="text-5xl font-bold font-satoshi">
				{timeString}
			</h2>
		</section>
		<section class="flex w-full p-6">
			<button
				type="submit"
				class="w-full flex items-center gap-1.5 justify-center bg-primary-red rounded-lg font-bold text-sm text-white py-2.5 px-4"
			>
				{#if loading}
					<iconify-icon width="25" icon="eos-icons:three-dots-loading"></iconify-icon>
				{:else}
					<span> Proceed </span>
					<iconify-icon icon="ep:right" width="15"></iconify-icon>
				{/if}
			</button>
		</section>
	</form>
</Modal>
