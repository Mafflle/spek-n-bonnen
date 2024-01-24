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
		// let updatedArray: Option[] = [];
		// if (selectedArray.some((item) => isEqual(item, option))) {
		// 	updatedArray = selectedArray.filter((item) => {
		// 		return item.value !== option.value;
		// 	});
		// } else {
		// 	updatedArray = [option, ...selectedArray];
		// }
		// if (updatedArray.length > 0) {
		// 	container.set(updatedArray);
		// 	// console.log($container);

		// }
		dispatch('selected', selectedArray);
	};

	$: {
		$container.map((item) => {
			if (options.some((option) => isEqual(option, item)) === false) {
				options = [...options, item];
			}
			return options;
		});
	}

	// $: console.log(selectedArray);
	onMount(() => {
		// console.log(options);
	});
	const unsubscribe = container.subscribe((items) => (selectedArray = items));
	onDestroy(() => {
		options = [];
		unsubscribe;
	});

	const checkSelected = (option) => {
		if ($container.some((item) => isEqual(item, option))) {
			return true;
		} else {
			return false;
		}
	};
</script>

<div
	class="user-role flex flex-col justify-center items-start gap-[1.25rem] max-w-full w-full h-full max-h-32 mb-3"
>
	<div
		class="roles flex items-start gap-[0.625rem] w-full max-w-full overflow-x-scroll no-scrollbar flex-wrap"
	>
		{#each options as option, i (i)}
			<Pill selected={checkSelected(option)} {option} on:selected={(e) => onSelected(e.detail)} />
		{/each}
	</div>
</div>
