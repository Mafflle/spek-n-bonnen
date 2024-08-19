<script lang="ts">
	import { page } from '$app/stores';
	import TasksCalendar from '$lib/components/customs/TasksCalendar.svelte';
	import { currentUser } from '$lib/user';

	export let data;

	let { tasks } = data;
	console.log(tasks.results);
</script>

<div class=" lg:p-0 md:p-4 w-full grid">
	<!-- <TasksCalendar tasks={tasks.results} /> -->
</div>
