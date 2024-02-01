<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import SearchInput from './SearchInput.svelte';
	import { string } from 'zod';
	import * as Select from './ui/select';
	import { Group } from 'lucide-svelte';

	const dispatch = createEventDispatcher();
	let open = false;

	export let name: string;
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

	let loading: boolean = false;

	function toggle() {
		open = !open;
	}

	type Option = {
		value: string;
		label: string;
	};

	let selected: any;
	let selectedArray: any = [];

	function onSelected(option: any) {
		dispatch('selected', option);
		if (option !== '') {
			selected = option;

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
	}
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
			selected = prop;
			// console.log(selected);
			selectedArray = selected;
		}
	});
	let selectedValue = selected?.value;
</script>

<Select.Root>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- <input type="text" {name} class="hidden" bind:value={selectedValue} /> -->
	<Select.Trigger class="max-w-full w-full flex hover:border-primary-100 ">
		<Select.Value {placeholder} />
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
						<svg
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
						>
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
						value={option.value}
						label={option.label}
						class="p-2 text-[14px] hover:bg-primary-100 cursor-pointer hover:text-white w-full flex
				{option.label === selected?.label ||
							(selectedArray.includes(option.label) && 'bg-primary-100 text-white')} {!option.label
							.toLowerCase()
							.startsWith(search.toLowerCase()) && 'hidden'}"
					>
						{option.label}
					</Select.Item>
				{/each}
			{/if}
		</Select.Group>
	</Select.Content>
	<Select.Input {name} />
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
