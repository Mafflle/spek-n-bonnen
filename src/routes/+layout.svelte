<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	import { adminExists, currentUser, initializeUserStore, userLoading } from '$lib/stores/user';
	import { Toaster } from 'svelte-sonner';
	import '../app.css';
	import 'iconify-icon';
	import PageLoader from '$components/PageLoader.svelte';
	import { navigating, page } from '$app/stores';
	import { goto } from '$app/navigation';

	$: console.log($adminExists);

	if (browser && !$adminExists) {
		goto('/auth/setup-admin');
	}
	onMount(async () => {
		if (browser) {
			await initializeUserStore();
		}
	});
</script>

<svelte:head>
	<title>Spek-n-Boonen</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>
<Toaster richColors />
{#if (!$currentUser && $userLoading) || $navigating}
	<PageLoader />
{/if}
<slot />
