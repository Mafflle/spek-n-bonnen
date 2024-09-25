<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { adminExists, userLoading } from '$lib/stores/user';
	import { Toaster } from 'svelte-sonner';
	import '../app.css';
	import 'iconify-icon';
	import { initializeUserStore } from '$lib/stores/user';
	import { onMount } from 'svelte';

	$: {
		if (!$userLoading && !$adminExists && browser) {
			goto('/auth/setup-admin');
		}
	}

	onMount(async () => {
		if (browser) {
			await initializeUserStore();
		}
	});
</script>

<Toaster richColors />
<slot></slot>
