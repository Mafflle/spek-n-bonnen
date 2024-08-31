<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import Separator from '../ui/separator/separator.svelte';

	export let frInput: string | undefined;
	export let enInput: string | undefined;
	export let duInput: string | undefined;

    export let title: string;
	
	export let locales = [
	  {
		name: 'Eng',
		label: 'en',
		input: enInput,
		flag: 'united-kingdom-flag-icon.svg',
		value: ''
	  },
	  {
		name: 'Ned',
		label: 'nl',
		input: duInput,
		flag: 'netherlands-flag-icon.svg',
		value: ''
	  },
	  {
		name: 'Fra',
		label: 'fr',
		input: frInput,
		flag: 'france-flag-icon.svg',
		value: ''
	  }
	];
	
	export let inputName: string = '';
	export let textarea = false;
  
	let activeLocale = locales[0];
	
	const setActiveLocale = (locale: {
	  name: string;
	  flag: string;
	  input: string;
	  value: string;
	}) => {
	  activeLocale = locale;
	  options.placeholder = locale.placeholder;
	  options.content = locale.value; // Set the content to the locale value
	};
	
	$: currentPlaceholder = activeLocale.placeholder;
	
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
  
  
	let content = '';
  
	$: {
	  // check the locales and match the one with the activeLocale and set the content to the locale value
	  const index = locales.findIndex((locale) => locale.name === activeLocale.name);
	  if (index !== -1) {
		content = locales[index].value;
	  }
	}
  
  </script>
  <div class="flex flex-col gap-7 text-sm font-medium">
    <p>{title}</p>
  <div class="w-full">
	<Tabs.Root value={activeLocale.label} class="w-full border border-grey-300 p-3 rounded-xl">
	  <Tabs.List class="bg-white mb-1.5">
		{#each locales as locale}
		  <Tabs.Trigger
			value={locale.label}
			on:click={() => setActiveLocale(locale)}
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
				  bind:value={locale.input}
				  name={`${inputName}_${locale.label}`}
                  disabled
				></textarea>
			  {:else}
				<input
				  name={`${inputName}_${locale.label}`}
				  bind:value={locale.input}
				  class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
                  disabled
				/>
			  {/if}
			</div>
		  </Tabs.Content>
		{/each}
	  </div>
	</Tabs.Root>
  </div>
  </div>