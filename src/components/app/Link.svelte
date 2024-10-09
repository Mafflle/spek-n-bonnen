<script lang="ts">
	import { page } from '$app/stores';

	export let route: { link: string; name: string; icon?: string; activeIcon?: string };

	$: active = $page.url.pathname === route.link;
</script>

<a
	class="flex h-full w-full items-center gap-2 rounded px-2 py-1 text-grey-100 hover:bg-black {active &&
		'bg-black text-white '}"
	href={route.link}
>
	{#if route.icon}
		<span class="h-5 w-5">
			<img src={active ? route.activeIcon : route.icon} class="h-full w-full" alt="" />
		</span>
	{/if}

	<span class=" font-medium">{route.name}</span>
</a>
