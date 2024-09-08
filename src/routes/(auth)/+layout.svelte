<script lang="ts">
	import { page } from '$app/stores';
	import { currentUser } from '$lib/user';
	import { getToastType, showToast } from '$lib/utils';

	let message: string | null = $page.url.searchParams.get('message');
	let type: string | null = $page.url.searchParams.get('type');
	if (message && type) {
		let errorType = getToastType(type);

		showToast(message, errorType);
	}

	$currentUser = null;
</script>

<slot />
