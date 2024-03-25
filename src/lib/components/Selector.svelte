<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import SearchInput from './SearchInput.svelte';
	import * as Select from './ui/select';
	import Button from './ui/button/button.svelte';
	import { Tags } from '$lib/stores';
	import { Item } from './ui/accordion';
	import Label from './ui/label/label.svelte';

	const dispatch = createEventDispatcher();
	let open = false;

	export let inputName: string = '';
	export let selectMultiple: boolean = false;
	export let maxSelectable: number = 5;
	export let addUnavailable: boolean = false;
	export let placeholder: string;
	export let options: Option[];
	export let prop: any | undefined = undefined;
	export let makeAbsolute: boolean = true;
	export let searchEndpoint: string = '';
	export let endpoint: string = '';
	export let token: string = '';
	export let searching: boolean = false;
	export let required: boolean = false;

	let loading: boolean = false;

	function toggle() {
		open = !open;
	}
	$: $Tags = options;
	type Option = {
		value: string | number | any;
		label: string;
		slug?: string;
	};

	$: {
		if (selected && selected.length > 0) {
			dispatch('selected', { selected });
		}
	}
	let selected: any;
	let selectedArray: any = [];

	function onSelected(option: any) {
		if (option !== '') {
			selected = option;
			selectedValue = option.value;

			if (selected !== '') {
				if (selectedArray.length >= 1) {
					if (selectedArray.length < maxSelectable) {
						if (selectedArray.includes(selected.label || selected) === false) {
							selectedArray = [...selectedArray, selected.label || selected];
						}
					}
				} else selectedArray = [selected.label || selected.trim()];
			}
		} else return;

		toggle();
		search = '';
		dispatch('selected', option);
	}
	const addOption = (name: string) => {
		dispatch('addoption', { name });
	};
	const editOption = (name: string, slug: string) => {
		dispatch('editOption', { name, slug });
	};
	const deleteOption = (id: number | string) => {
		dispatch('deleteOption', { itemId: id });
	};

	const removeSelected = (itemIndex: number) => {
		selectedArray = selectedArray.filter((element: string, index: number) => {
			return selected.indexOf(element) !== itemIndex;
		});
		// console.log(selectedArray);

		dispatch('remove', itemIndex);
		return;
	};

	let search = '';

	onMount(() => {
		if (prop !== undefined && selected === undefined) {
			if (!prop.value) {
				const editedProp = { value: prop.id, label: prop.name };
				selected = editedProp;
			} else selected = prop;
			// console.log(selected);
		}
	});

	$: {
		if (!selectMultiple) {
			if (selected && selected.value) {
				options.map((option) => {
					if (option.value === selected.value && selected.label !== option.label) {
						selected.label = option.label;
					}
				});
			}
		} else if (selectMultiple && selected) {
			for (const item of selected) {
				let sameOption = options.find(
					(option) => option.value === item.value && option.label !== item.label
				);
				if (sameOption) {
					item.label = sameOption.label;
				}
			}
		}
	}
	// $: console.log(selected);

	let selectedValue: string | number = selected?.value;
</script>

<Select.Root bind:selected multiple={selectMultiple}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- <input type="text" {name} class="hidden" bind:value={selectedValue} /> -->
	<Select.Trigger class="max-w-full w-full flex hover:border-primary-100 ">
		<Select.Value {placeholder} class="text-base placeholder-shown:text-grey-200" />
	</Select.Trigger>

	<Select.Content class="w-full max-w-full">
		<Select.Group>
			<div class="flex items-center px-2 sticky top-0 bg-white gap-2">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
						stroke="#A9A9A9"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M21 20.9999L16.65 16.6499"
						stroke="#A9A9A9"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>

				<div class="flex w-full items-center">
					{#if endpoint && searchEndpoint}
						<SearchInput
							className="w-full py-2 border-none focus:outline-none"
							{searchEndpoint}
							placeholder="Search...."
							{endpoint}
							{loading}
							{token}
							on:searched={(e) => (options = e.detail.results)}
							on:searching={(e) => (searching = e.detail)}
						/>
					{:else}
						<input bind:value={search} type="text" {placeholder} class=" p-2 outline-none w-full" />
					{/if}
					{#if addUnavailable}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- <svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							class="cursor-pointer"
							viewBox="0 0 24 24"
							on:click={() => onSelected(search)}
							><path
								fill="#a52921"
								d="M11 17h2v-4h4v-2h-4V7h-2v4H7v2h4v4Zm1 5q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm0-8Z"
							/></svg
						> -->
					{/if}
				</div>
			</div>

			{#if searching}
				<div class="flex item-center justify-center min-w-full text-primary-100 py-5">
					<iconify-icon icon="line-md:loading-twotone-loop" width="30"></iconify-icon>
				</div>
			{:else}
				{#each options as option}
					<Select.Item
						on:click={() => onSelected(option)}
						value={option.value}
						label={option.label}
						class="p-2 text-[14px] hover:bg-primary-100 cursor-pointer hover:text-white w-full items-center justify-between flex
				{option.label === selected?.label ||
							(selected?.includes(option.label) && 'bg-primary-100 text-white')} {!option.label
							.toLowerCase()
							.startsWith(search.toLowerCase()) && 'hidden'}"
					>
						<span class="mr-auto text-base font-medium">
							{option.label}
						</span>
						{#if addUnavailable}
							<div class="flex items-center gap-1 relative z-30">
								<button
									on:click={() => editOption(option.label, option.slug)}
									class="text-sm font-satoshi -tracking-[0.14px] w-7 h-7 flex items-center justify-start py-1 rounded gap-2"
								>
									<img src="/icons/edit.svg" alt="edit icon" class="w-full h-full" />
									<span class="text-grey-100 hidden">Edit details</span>
								</button>

								<button
									on:click={() => deleteOption(option.slug)}
									class="text-sm font-satoshi -tracking-[0.14px] w-7 h-7 flex items-center justify-start py-1 rounded gap-2"
								>
									<img src="/icons/trash.svg" class="w-full h-full" alt="trash icon" />
									<span class="button-text text-primary-red hidden">Delete </span>
								</button>
							</div>
						{/if}
					</Select.Item>
				{/each}
			{/if}
		</Select.Group>
	</Select.Content>
	<!-- <input
		type="text"
		class=" absolute"
		on:change={(e) => console.log('changed')}
		name={inputName}
		{required}
		bind:value={selectedValue}
	/> -->
	<Select.Input {required} name={inputName} on:change={() => console.log('voila')} />
</Select.Root>

<!-- <style>
	.selector {
		max-width: 100%;
	}

	@media (max-width: 1200px) {
		.selector {
			max-width: 100%;
		}
	}

	@media (max-width: 768px) {
		.selector {
			max-width: 100%;
		}
	}
</style> -->
