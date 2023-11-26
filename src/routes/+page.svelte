<script lang="ts">
	import { currentUser, getCurrentUser } from '$lib/user';
	import { client } from '$lib/utils';
	import { onMount } from 'svelte';
	import { handleUserActions } from './logic';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const logout = async () => {
		const request = client.post('auth/logout');
		currentUser.set(null);
		await goto('auth/login');
	};
	const next = `${$page.route.id}`;

	onMount(async () => {
		await handleUserActions(next);
		await getCurrentUser();
		console.log($currentUser);
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#if $currentUser}
	<button on:click={logout}>Logout</button>
{/if}
