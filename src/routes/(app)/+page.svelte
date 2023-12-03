<script lang="ts">
	import { client } from '$lib/utils';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/user';

	const logout = async () => {
		const request = client.post('auth/logout');
		currentUser.set(null);
		await goto('auth/login');
	};
	const next = `${$page.route.id}`;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#if $currentUser}
	<button on:click={logout}>Logout</button>
{/if}
