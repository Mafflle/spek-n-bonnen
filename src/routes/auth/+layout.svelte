<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { currentUser, userLoading } from '$lib/stores/user';

	$: {
		if ($currentUser && !$userLoading && browser) {
			goto('/');
		}
	}
</script>

<div class="bg-background flex min-h-screen w-screen flex-col items-center justify-center px-10">
	<div class="rounded-[12px] bg-white p-10 shadow md:w-[500px]">
		<slot />
	</div>
</div>
