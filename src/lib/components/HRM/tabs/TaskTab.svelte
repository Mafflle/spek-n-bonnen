<script lang="ts">
	import { currentTask, type Task } from '$lib/hrm';
	import { createEventDispatcher } from 'svelte';
	import { shortenText } from '$lib/utils.js';
	import * as Avatar from '$lib/components/ui/avatar';
	import dayjs from 'dayjs';
	import CustomTable from '$lib/components/customs/CustomTable.svelte';
	import TaskRow from '$lib/components/customs/TaskRow.svelte';

	export let Tasks: Task[] = [];
	const dispatch = createEventDispatcher();
	function toggleCurrTask(task: Task) {
		currentTask.set(task);
		dispatch('open');
	}

	let tableProps = {
		columns: [
			{ name: 'Task' },
			{ name: 'Assignees' },
			{ name: 'Priority' },
			{ name: 'End time' },
			{ name: '' }
		],
		RowComponent: TaskRow,
		RowsData: Tasks
	};
</script>
