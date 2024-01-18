<script lang="ts">
	import { isEqual, type Option } from '$lib/utils';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import Pill from './Pill.svelte';
	import { container, updateSelectedOptions } from '$lib/stores';
	export let options: Option[];
	export let disableOptions: boolean = false;
	let selectedArray: Option[] = [];

	const dispatch = createEventDispatcher();
	const onSelected = (option: Option) => {
		if (selectedArray.includes(option)) {
			selectedArray = selectedArray.filter((item) => {
				return item.value !== option.value;
			});
			updateSelectedOptions(option);

			dispatch('selected', selectedArray);
		} else {
			selectedArray = [...selectedArray, option];
			updateSelectedOptions(option);

			dispatch('selected', selectedArray);
		}
	};
	onMount(() => {
		container.subscribe((items) => {
			if (items.length > 0) {
				selectedArray = items;

				for (const item of items) {
					if (options.some((option) => isEqual(option, item)) === false) {
						options = [...options, item];
					}
				}

				dispatch('selected', items);
			}
		});
	});
	const unsubscribe = container.subscribe((items) => (selectedArray = items));
	onDestroy(() => {
		options = [];
	});
</script>

<div class="user-role flex flex-col justify-center items-start gap-[1.25rem] max-w-full w-full">
	<div class="roles flex items-start gap-[0.625rem] w-full max-w-full flex-wrap">
		{#each options as option, i (i)}
			<Pill {disableOptions} {option} on:selected={(e) => onSelected(e.detail)} />
		{/each}
	</div>
</div>
