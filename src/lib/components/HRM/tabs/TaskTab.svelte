<script lang="ts">
	import { currentTask, type Task } from '$lib/hrm';
	import { createEventDispatcher } from 'svelte';
	import { shortenText } from '$lib/utils.js';
	import * as Avatar from '$lib/components/ui/avatar';
	import dayjs from 'dayjs';

	export let Tasks: Task[] = [];
	const dispatch = createEventDispatcher();
	function toggleCurrTask(task: Task) {
		currentTask.set(task);
		dispatch('open');
	}
</script>

<div class="grid grid-cols-3 gap-4 xl:gap-6 xl:grid-cols-3">
	{#if Tasks.length > 0}
		{#each Tasks as task}
			<div
				on:click={() => toggleCurrTask(task)}
				class="col-span-1 cursor-pointer flex flex-col w-full border-2 min-h-[170px] p-4 gap-1 rounded-xl"
			>
				<section class="flex items-center justify-between">
					<h5 class="text-primary-red text-xs">Task Name</h5>
					<span
						class="bg-primary-green text-xs xl:text-sm text-[#41AA00] text-center py-0.5 px-4 rounded-3xl"
					>
						{task.status}
					</span>
				</section>
				<section class="grid text-grey-100 mb-auto">
					<h6 class="text-sm xl:text-lg font-satoshi font-medium">{task.title}</h6>
					<p class="xl:text-sm text-xs font-satoshi">
						{shortenText(task.description, 100)}
					</p>
				</section>
				<section class="flex items-center justify-between">
					<section class="flex items-center gap-2">
						<div class="flex items-center -space-x-2">
							{#each task.assignees as assignee, i}
								<Avatar.Root class="w-6 h-6">
									<Avatar.Image
										class="w-full h-full object-cover"
										src={assignee?.staff_profile?.profile_picture.image}
									/>
									<Avatar.Fallback class="text-xs"
										>{assignee?.email.substring(0, 2).toLocaleUpperCase()}</Avatar.Fallback
									>
								</Avatar.Root>
							{/each}
						</div>
						<span class="text-primary-softPink-50 text-xs">GroupA</span>
					</section>
					<div class=" flex items-center gap-1 text-primary-softPink-50">
						<img class="w-3.5 h-3.5" src="/icons/TaskClock.svg" alt="clock icon" />
						<span class="text-xs">{dayjs(task.end_time).diff(task.start_time, 'hour')}/hrs</span>
					</div>
				</section>
			</div>
		{/each}
	{:else}
		No Tasks created yet
	{/if}
</div>
