<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';

	import Separator from './ui/separator/separator.svelte';

	import TipTap from './TipTap.svelte';
	export let frPlaceholder: string = "Entrez le nom de l'élément en français";
	export let enPlaceholder: string = 'Enter item name';
	export let duPlaceholder: string = 'Voer de naam van het item in het Nederlands in';
	export let locales = [
		{
			name: 'Eng',
			label: 'en',
			placeholder: enPlaceholder,
			flag: 'united-kingdom-flag-icon.svg',
			value: ''
		},
		{
			name: 'Ned',
			label: 'nl',
			placeholder: duPlaceholder,
			flag: 'netherlands-flag-icon.svg',
			value: ''
		},
		{
			name: 'Fra',
			label: 'fr',
			placeholder: frPlaceholder,
			flag: 'france-flag-icon.svg',
			value: ''
		}
	];
	export let inputName: string = '';

	let activeLocale = locales[0];

	const setActiveLocale = (locale: {
		name: string;
		flag: string;
		placeholder: string;
		value: string;
	}) => {
		activeLocale = locale;
		options.placeholder = locale.placeholder;
		options.content = locale.value;
		activeLocale.value = ''; // Clear the value when changing tabs
	};

	$: currentPlaceholder = activeLocale.placeholder;

	export let textarea = false;
	export let placeholder = 'Enter translation';

	const options = {
		theme: 'snow',
		textarea: true,
		placeholder: currentPlaceholder,
		content: activeLocale.value,
		modules: {
			toolbar: [
				['bold', 'italic', 'underline'],
				[{ list: 'ordered' }, { list: 'bullet' }],
				[{ align: [] }],
				['link'],
				['clean'],
				[{ header: [1, 2, 3, 4, 5, 6, false] }]
			]
		}
	};

	function onTextChange(event) {
		// console.log(event.detail);
		// console.log(locales);
		const index = locales.findIndex((locale) => locale.name === activeLocale.name);
		if (index !== -1) {
			locales[index].value = event.detail.html;
		}
	}

	let content = '';

	const setContent = (locale) => {
		console.log(locale);
		content = locale;
	};
	let index = 0;

	$: {
		// check the locales and match the one with the activeLocale and set the content to the locale value
		index = locales.findIndex((locale) => locale.name === activeLocale.name);
		if (index !== -1) {
			content = locales[index].value;
		}

		content = locales[index].value;
	}
	let conf = {
		toolbar: 'undo redo italic bold',
		menubar: false
	};
</script>

<svelte:head>
	<!-- Quill theme -->
	<link rel="preconnect" href="https://cdn.quilljs.com" />
	<link rel="stylesheet" href="https://cdn.quilljs.com/1.3.7/quill.snow.css" />
</svelte:head>

<div class="w-full">
	<Tabs.Root value={activeLocale.label} class="w-full border border-grey-300 p-3 rounded-xl">
		<Tabs.List class="bg-white mb-1.5">
			{#each locales as locale}
				<Tabs.Trigger
					value={locale.label}
					on:click={() => {
						setActiveLocale(locale);
						setContent(locales[index].value);
					}}
					class="flex gap-2 items-center data-[state=active]:font-bold data-[state=active]:text-black-100 data-[state=active]:border-2 data-[state=active]:border-b-0 rounded-none shadow-none"
				>
					<img src={`/icons/${locale.flag}`} class="h-4 w-4" alt={locale.name} />
					<span>{locale.name}</span>
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
		<Separator />
		<div>
			{#each locales as locale}
				<Tabs.Content value={locale.label}>
					<div class="flex flex-col gap-3">
						{#if textarea}
							<textarea
								class="border-2 rounded-lg p-2"
								rows="8"
								bind:value={locale.value}
								name={`${inputName}_${locale.label}`}
							></textarea>
						{:else}
							<input
								name={`${inputName}_${locale.label}`}
								bind:value={locale.value}
								placeholder={locale.placeholder}
								class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
							/>
						{/if}
					</div>
				</Tabs.Content>
			{/each}
		</div>
	</Tabs.Root>
</div>

<style>
	.ql-toolbar {
		position: sticky;
	}
</style>
