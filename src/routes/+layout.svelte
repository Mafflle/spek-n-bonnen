<script lang="ts">
	import '../app.pcss';
	import { Toaster } from 'svelte-french-toast';
	import 'iconify-icon';
	import { navigating } from '$app/stores';
	import PageLoader from '$lib/components/PageLoader.svelte';

	export let data;
	let showModal = Boolean($navigating);
</script>

<svelte:head>
	<title>Spek-N-Boonen</title>
	<link href="https://fonts.cdnfonts.com/css/inter" rel="stylesheet" />
	<link href="https://fonts.cdnfonts.com/css/satoshi" rel="stylesheet" />
</svelte:head>

{#if $navigating}
	<PageLoader />
{/if}

<Toaster />
<slot />
