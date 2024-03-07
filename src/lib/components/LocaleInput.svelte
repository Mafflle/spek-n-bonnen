<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import { Textarea } from '$lib/components/ui/textarea';
	import Separator from './ui/separator/separator.svelte';

	export let locales = [
		{ name: 'eng', flag: 'united-kingdom-flag-icon.svg', value: '' },
		{ name: 'fr', flag: 'france-flag-icon.svg', value: '' },
		{ name: 'du', flag: 'netherlands-flag-icon.svg', value: '' }
	];

	let activeLocale = locales[0];

	const setActiveLocale = (locale: { name: string; flag: string; value: string }) => {
		activeLocale = locale;
	};

	export let textarea = false;
	export let placeholder = 'Enter translation';
</script>

<div class="w-full">
	<Tabs.Root value={activeLocale.name} class="w-full border border-gray-300 p-3 rounded-xl">
		<Tabs.List class="bg-white flex justify-start">
			{#each locales as locale (locale.name)}
				<Tabs.Trigger
					value={locale.name}
					on:click={() => setActiveLocale(locale)}
					class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
				>
					<img src={`/icons/${locale.flag}`} class="h-4 w-4" alt={locale.name} />
					<span>{locale.name}</span>
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
		<Separator />
		<Tabs.Content value={activeLocale.name} class="flex flex-col gap-3">
			{#if textarea}
				<Textarea
					bind:value={activeLocale.value}
					{placeholder}
					class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
			{:else}
				<input
					bind:value={activeLocale.value}
					{placeholder}
					class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
			{/if}
		</Tabs.Content>
	</Tabs.Root>
</div>
