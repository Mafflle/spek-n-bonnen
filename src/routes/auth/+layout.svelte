<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/stores/user';

	$: {
		if ($currentUser && browser) {
			goto('/');
		}
	}
</script>

<div class="flex min-h-screen w-screen flex-col items-center justify-center bg-background px-10">
	<slot />
</div>
