<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import { Textarea } from '$lib/components/ui/textarea';

	import Separator from './ui/separator/separator.svelte';

	export let frPlaceholder: string = "Entrez le nom de l'élément en français";
	export let enPlaceholder: string = 'Enter item name';
	export let duPlaceholder: string = 'Voer de naam van het item in het Nederlands in';
	export let locales = [
		{
			name: 'Eng',
			placeholder: enPlaceholder,
			flag: 'united-kingdom-flag-icon.svg',
			value: ''
		},
		{
			name: 'Dut',
			placeholder: duPlaceholder,
			flag: 'netherlands-flag-icon.svg',
			value: ''
		},
		{
			name: 'Fr',
			placeholder: frPlaceholder,
			flag: 'france-flag-icon.svg',
			value: ''
		}
	];

	let activeLocale = locales[0];

	function setActiveLocale(locale: any) {
		activeLocale = locale;
	}

	// $: {
	// 	console.log(locales);
	// 	console.log(activeLocale);
	// }

	export let textarea: boolean = false;
</script>

<div class="w-full">
	<Tabs.Root value={activeLocale.name} class="w-full border border-grey-300 p-3 rounded-xl">
		<Tabs.List class="bg-white mb-1.5">
			{#each locales as locale}
				<Tabs.Trigger
					value={locale.name}
					on:click={() => setActiveLocale(locale)}
					class="flex gap-2  items-center data-[state=active]:font-bold data-[state=active]:text-black-100 data-[state=active]:border-2 data-[state=active]:border-b-0 rounded-none  shadow-none"
				>
					<img src={`/icons/${locale.flag}`} class="h-4 w-4" alt={locale.name} />
					<span>{locale.name}</span>
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
		<Separator />

		<Tabs.Content value={activeLocale.name} class="flex flex-col gap-3 ">
			{#if textarea}
				<Textarea
					bind:value={activeLocale.value}
					placeholder={activeLocale.placeholder}
					class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
			{:else}
				<input
					bind:value={activeLocale.value}
					placeholder={activeLocale.placeholder}
					class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
				<!-- 
				<div class="text-actions flex ">

				</div> -->
			{/if}
		</Tabs.Content>
	</Tabs.Root>
</div>
