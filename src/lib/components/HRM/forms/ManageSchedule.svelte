<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import { slide } from 'svelte/transition';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { calculateTimeDifference, calculateTotalTimeDifference, showToast } from '$lib/utils';
	import { enhance } from '$app/forms';
	import { workSchedules, type Schedule } from '$lib/hrm';
	import type { StaffProfile } from '$lib/user';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { page } from '$app/stores';

	export let schedule: Schedule | null = null;

	$: currUserProfile = $page.data.userAccount.staff_profile as StaffProfile;

	$: totalScheduledHours = calculateTotalTimeDifference($workSchedules) / 60;

	let loading: boolean = false;
	const dispatch = createEventDispatcher();

	const submit: SubmitFunction = ({ formData, cancel }) => {
		loading = true;

		let start_time = formData.get('start_time') as string;
		let end_time = formData.get('end_time') as string;

		let currTimeDiff = calculateTimeDifference(start_time, end_time) / 60 + totalScheduledHours;

		if (currUserProfile && currTimeDiff > currUserProfile?.preferred_weekly_working_hours) {
			cancel();

			showToast(
				`${currUserProfile.preferred_name}'s schedule is currently overallocated by ${(currTimeDiff - currUserProfile.preferred_weekly_working_hours).toFixed(1)} hours. Please review and make necessary adjustments.`,
				'info'
			);
			loading = false;
		}

		if (currUserProfile && !currUserProfile.preferred_weekly_working_hours) {
			cancel();
			dispatch('close');
			dispatch('add-WH');
		}
		let staffId = $page.params.id;
		if (staffId) {
			formData.append('account_id', `${staffId}`);
		} else {
			showToast('This user does not exist', 'error');
			cancel();
		}

		if (schedule) {
			formData.append('schedule_id', `${schedule.id}`);
		}
		return async ({ update, result, formData }) => {
			try {
				if (result.status === 200) {
					console.log(result);

					if (result.data.edited) {
						let editedSchedule = result.data.editedSchedule;
						workSchedules.update((schedules) => {
							return schedules.map((schedule) => {
								if (schedule.id === editedSchedule.id) {
									schedule = editedSchedule;
								}
								return schedule;
							});
						});
						showToast('Schedule updated successfully', 'success');
					} else {
						let newSchedule = result.data.newWorkSchedule;
						workSchedules.update((schedule) => {
							return [...schedule, newSchedule];
						});
						showToast('Schedule created successfully', 'success');
					}

					dispatch('close');
				} else if (result.status === 400) {
					validationErrors = result.data.errors;
					showToast('Validation error', 'error');
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

	const daysOfTheWeek = [
		{ label: 'Monday', value: 1 },
		{ label: 'Tuesday', value: 2 },
		{ label: 'Wednesday', value: 3 },
		{ label: 'Thursday', value: 4 },
		{ label: 'Friday', value: 5 },
		{ label: 'Saturday', value: 6 },
		{ label: 'Sunday', value: 7 }
	];

	let validationErrors: {
		day_of_week?: [string];
		start_time?: [string];
		_time?: [string];
	} = {};

	onDestroy(() => {
		schedule = null;
		dispatch('closed');
	});

	$: currentDayOfWeek = daysOfTheWeek.find((day) => day.value === schedule?.day_of_week);
	let start_time = schedule?.start_time;
	let end_time = schedule?.end_time;
</script>

<form
	method="post"
	use:enhance={submit}
	action="?/manage_schedule"
	class="w-full max-xsm:pb-4 pb-6 max-h-full h-screen overflow-x-scroll no-scrollbar flex flex-col gap-5 items-start justify-between bg-white rounded-lg"
>
	<section class="md:h-full w-full mb-auto">
		<div
			class="flex w-full sticky bg-white top-0 h-16 max-xsm:py-2 z-30 items-center justify-center mb-5"
		>
			<Sheet.Header
				is="text"
				class="flex flex-col h-full items-center justify-center w-full   z-10  "
			>
				<div class="w-full h-full px-3 flex flex-row justify-between items-center">
					<Sheet.Title
						class="flex items-center gap-2 text-primary-50 font-poppins font-semibold text-lg mr-auto"
					>
						<img src="/icons/UserWithEclipse.svg" alt="user icon " />
						<span>{schedule ? 'Edit' : 'Create'} Work Schedule</span>
					</Sheet.Title>
					<button
						type="button"
						class="bg-[#F2F2F2] border border-[#E0E0E0] flex items-center rounded-full p-0.5"
					>
						<img src="/icons/close.svg" alt="close icon" />
					</button>
				</div>
				<Separator />
			</Sheet.Header>
		</div>
		<div class="form-group py-6 flex flex-col gap-10 items-start justify-center w-full px-4">
			<span class="font-satoshi text-sm"
				>Kindly fill the form below with the appropriate information</span
			>
			<section class="w-full flex flex-col gap-5">
				<div class="form-item w-full flex flex-col gap-1">
					<label for="day_of_week" class="text-sm mb-1 font-medium font-satoshi">Day of week</label>

					<Select.Root bind:selected={currentDayOfWeek}>
						<Select.Trigger disabled={loading} class="w-full flex items-center">
							<Select.Value placeholder="Select day of the week" />
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each daysOfTheWeek as day}
									<Select.Item
										disabled={$workSchedules.some((schedule) => schedule.day_of_week === day.value)}
										class="flex items-center justify-start"
										value={day.value}
										label={day.label}
									>
										<span>{day.label}</span>
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
						<Select.Input name="day_of_week" />
					</Select.Root>
					{#if validationErrors?.day_of_week}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]"
							>{validationErrors.day_of_week[0]}</sub
						>
					{/if}
				</div>

				<div class="flex items-center mt-4 py-4 gap-3">
					<div class="form-item w-full flex flex-col gap-1">
						<label for="start_time" class="text-sm mb-1 font-medium font-satoshi">Start time</label>

						<input
							disabled={loading}
							type="time"
							class="border px-3 py-2 rounded-md"
							name="start_time"
							bind:value={start_time}
						/>
					</div>
					<div class="form-item w-full flex flex-col gap-1">
						<label for="end_time" class="text-sm mb-1 font-medium font-satoshi">End time</label>

						<input
							disabled={loading}
							type="time"
							class="border px-3 py-2 rounded-md"
							name="end_time"
							bind:value={end_time}
						/>
					</div>
					{#if validationErrors?.day_of_week}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 w-full text-xs tracking-[-0.0075rem]"
							>{validationErrors?.start_time[0]}</sub
						>
					{/if}
				</div>
			</section>
		</div>
	</section>
	<Sheet.Footer class="w-full  px-3 mt-auto">
		<div class="w-full px-4">
			<Button
				type="submit"
				class="flex w-full bg-primary-red gap-2 items-center font-satoshi text-sm font-bold text-white py-2.5 px-3 rounded-md hover:bg-primary-100"
			>
				{#if loading}
					<iconify-icon width="25" icon="eos-icons:three-dots-loading"></iconify-icon>
				{:else if schedule}
					<span>Update</span>
					<iconify-icon icon="ep:right" width="15"></iconify-icon>
				{:else}
					<span> Proceed</span>

					<iconify-icon icon="ep:right" width="15"></iconify-icon>
				{/if}
			</Button>
		</div>
	</Sheet.Footer>
</form>

<style>
</style>
