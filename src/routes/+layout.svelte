<script lang="ts">
	import '../app.pcss';
	import { Toaster } from 'svelte-sonner';
	import 'iconify-icon';
	import { navigating } from '$app/stores';
	import { browser } from '$app/environment';
	import PageLoader from '$lib/components/PageLoader.svelte';
</script>

<svelte:head>
	<title>Spek-N-Boonen</title>
	<link href="https://fonts.cdnfonts.com/css/inter" rel="stylesheet" />
	<link href="https://fonts.cdnfonts.com/css/satoshi" rel="stylesheet" />
	<link href="https://fonts.cdnfonts.com/css/poppins" rel="stylesheet" />
</svelte:head>

<Toaster richColors closeButton />

{#if browser && $navigating}
	<PageLoader />
{/if}

<slot />
