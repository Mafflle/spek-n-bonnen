<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { slide } from 'svelte/transition';

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
</script>

<div class="selector max-w-full relative">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="bg-white border h-12 px-4 py-3 focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem] {open &&
			'border-primary-50'} hover:border-primary-50 transition-all relative text-base max-w-full p-1 flex items-center justify-between cursor-pointer"
		on:click={toggle}
	>
		<div class="max-w-[400px]">
			{#if selectMultiple}
				{#if selected && selectedArray.length > 0}
					<div class="flex gap-1 flex-wrap max-w-full">
						{#each selectedArray as selectedArrayElement, index}
							<p class="p-1 bg-primary-100 text-white rounded">
								{selectedArrayElement}
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<iconify-icon icon="iconoir:cancel" on:click={() => removeSelected(index)} />
							</p>
						{/each}
					</div>
				{:else}
					<p class="text-secondary-50">
						{placeholder}
					</p>
				{/if}
			{:else if selected}
				{#if selected.label}
					{selected.label.length > 30 ? selected.label.slice(0, 30) + '...' : selected.label}
				{:else}
					{selected.length > 30 ? selected.slice(0, 30) + '...' : selected}
				{/if}
			{:else}
				<p class="text-secondary-50">
					{placeholder}
				</p>
			{/if}
		</div>

		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-4 h-4 text-grey-200"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
			</svg>
		</div>
	</div>
	{#if open}
		<ul
			in:slide={{ duration: 200 }}
			out:slide={{ duration: 200 }}
			class="bg-white max-h-60 z-10 absolute w-full overflow-y-auto shadow-md text-[14px] text-[#454545] rounded-[5px] mt-2 mb-2 py-3"
		>
			<!-- <div class="flex items-center px-2 sticky top-0 bg-white">
				<div class="text-secondary">
					<svg
						width="24"
						height="24"
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
				</div>

				<div class="flex w-full items-center">
					<input bind:value={search} type="text" {placeholder} class=" p-2 outline-none w-full" />
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
			</div> -->
			{#each options as option}
				<li
					class="p-2 text-[14px] hover:bg-primary-100 cursor-pointer hover:text-white
					{option.label === selected?.label ||
						(selectedArray.includes(option.label) && 'bg-primary-100 text-white')} {option.label
						.toLowerCase()
						.startsWith(search.toLowerCase())
						? 'block'
						: 'hidden'}"
					on:click={() => onSelected(option)}
					on:keyup={() => onSelected(option)}
				>
					{option.label}
				</li>
			{/each}
		</ul>
	{/if}
</div>

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
