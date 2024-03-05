<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';

	import Separator from './ui/separator/separator.svelte';

	export let locales = [
		{
			name: 'eng',
			flag: 'united-kingdom-flag-icon.svg',
			value: ''
		},
		{
			name: 'fr',
			flag: 'france-flag-icon.svg',
			value: ''
		},
		{
			name: 'du',
			flag: 'netherlands-flag-icon.svg',
			value: ''
		}
	];

	let activeLocale = locales[0];

	function setActiveLocale(locale: any) {
		activeLocale = locale;
	}

	$: {
		console.log(locales);
		console.log(activeLocale);
	}
</script>

<div class="w-full">
	<Tabs.Root value={activeLocale.name} class="w-full border border-grey-300 p-3 rounded-xl">
		<Tabs.List class="bg-white">
			{#each locales as locale}
				<Tabs.Trigger
					value={locale.name}
					on:click={() => setActiveLocale(locale)}
					class="flex gap-2 items-center"
				>
					<img src={`/icons/${locale.flag}`} class="h-4 w-4" alt={locale.name} />
					<span>{locale.name}</span>
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
		<Separator />

		<Tabs.Content value={activeLocale.name}>
			<input
				bind:value={activeLocale.value}
				placeholder={`Enter ${activeLocale.name} translation`}
				class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
			/>
		</Tabs.Content>
	</Tabs.Root>
</div>
