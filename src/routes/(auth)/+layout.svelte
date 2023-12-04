<script lang="ts">
	import { page } from '$app/stores';
	import { getToastType, showToast } from '$lib/utils';
	// console.log($page);

	let message: string | null = $page.url.searchParams.get('message');
	let type: string | null = $page.url.searchParams.get('type');
	if (message && type) {
		let errorType = getToastType(type);

		showToast(message, errorType);
	}
</script>

<slot />
