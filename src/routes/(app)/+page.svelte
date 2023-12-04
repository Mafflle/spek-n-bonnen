<script lang="ts">
	import { client } from '$lib/utils';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { currentUser, getCurrentUser } from '$lib/user';

	export let data;

	console.log(data);

	const next = `${$page.route.id}`;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
