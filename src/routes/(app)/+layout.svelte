<script lang="ts">
	import { page } from '$app/stores';
	import SideNav from '$lib/components/SideNav.svelte';
	import { currentUser } from '$lib/user.js';
	import { showToast, type ToastType } from '$lib/utils.js';
	import { onDestroy, onMount } from 'svelte';
	export let data;
	const { permissions, user } = data;

	let message = $page.url.searchParams.get('message') as string;
	let messageType = $page.url.searchParams.get('type') as ToastType;

	// console.log('user profile', user);

	onMount(() => {
		if (message && messageType) {
			showToast(message, messageType);
			$page.url.searchParams.delete('message');
			$page.url.searchParams.delete('type');
		}
	});
	currentUser.set(user);

	const unsubscribe = currentUser.subscribe((currUser) => currUser);

	onDestroy(() => {
		unsubscribe();
	});
</script>

<div class="max-w-screen flex bg-[#F9F9F9]">
	<SideNav />

	<div class="w-full min-h-screen lg:m-4 md:rounded-lg pt-10 md:p-8 px-5 max-xsm:mb-16 bg-white">
		<slot />
	</div>
</div>
