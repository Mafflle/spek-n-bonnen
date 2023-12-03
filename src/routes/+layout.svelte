<script lang="ts">
	import { showToast } from '$lib/utils';
	import { onMount } from 'svelte';
	import '../app.postcss';
	import { Toaster } from 'svelte-french-toast';
	import 'iconify-icon';
	import { currentUser, setCurrentUser } from '$lib/user';

	export let data;

	setCurrentUser(data.user);
</script>

<svelte:head>
	<title>Spek-N-Boonen</title>
	<link href="https://fonts.cdnfonts.com/css/inter" rel="stylesheet" />
	<link href="https://fonts.cdnfonts.com/css/satoshi" rel="stylesheet" />
</svelte:head>

<Toaster />
<slot />
