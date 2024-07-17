<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { TimeEntries } from '$lib/hrm';
	import dayjs from 'dayjs';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

{#if $TimeEntries && $TimeEntries.length > 0}
	<div class="w-full h-fit overflow-clip border border-grey-300 mt-8 rounded-xl">
		<Table.Root class="">
			<Table.Header class="sticky top-0">
				<Table.Row class="h-[55px] bg-[#F9F9F9] font-satoshi font-medium ">
					<Table.Head class=" text-grey-200 ">Date</Table.Head>
					<!-- <Table.Head class="text-grey-200">Shift</Table.Head> -->
					<Table.Head class="text-grey-200 text-center">Time</Table.Head>
					<Table.Head class="text-grey-200 text-center">Entry type</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each $TimeEntries as entry}
					<Table.Row class="h-[100px]">
						<Table.Cell class="font-medium  text-grey-100 "
							>{dayjs(entry.timestamp).format('DD ddd MMM YYYY')}</Table.Cell
						>

						<Table.Cell class="font-medium  text-grey-100 text-center"
							>{dayjs(entry.timestamp).format('HH:ss A')}</Table.Cell
						>
						<Table.Cell class="font-medium  text-grey-100 text-center"
							>{entry.event_type}</Table.Cell
						>
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
						No Time Entry logged
					</h3>
					<div class="info text-center text-sm font-medium leading-5 tracking-[-0.13px]">
						You currently don’t have any Time Entry saved.
					</div>
				</div>
			</div>
			<!-- {#if viewType === 'manager'}
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
						<p class="text-white text-sm font-bold">Create Work TimeEntry</p>
					</button>
				</div>
			{/if} -->
		</div>
	</div>
{/if}
