<script lang="ts">
	import SidenavLink from './SidenavLink.svelte';

	export let routes: any[];
	export let title: string;

	let importedClass = '';
	export { importedClass as class };
</script>

<div class="flex flex-col gap-4 border-b border-border-black px-3 pb-5 {importedClass}">
	<span class="font-inter text-[10px] font-medium uppercase text-grey-100">{title}</span>
	<ul class="grid grid-cols-1 gap-1">
		{#each routes as route}
			<SidenavLink {route} />
		{/each}
	</ul>
</div>
