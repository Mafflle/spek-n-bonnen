<script lang="ts">
	import { fly, slide } from 'svelte/transition';

	export let tab: { title: string; id: string };
	export let selectedTab: string;
</script>

{#if tab.id === selectedTab}
	<div
		in:fly={{ x: -300 }}
		out:fly={{ x: 500 }}
		role="tabpanel"
		aria-labelledby={`tab-${tab.id}`}
		id={`tabpanel-${tab.id}`}
		class="tab-panel w-full"
	>
		<slot />
	</div>
{/if}
