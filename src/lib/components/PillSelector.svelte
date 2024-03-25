<script lang="ts">
	import { isEqual, type Option } from '$lib/utils';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import Pill from './Pill.svelte';
	import { container, updateSelectedOptions, type Permission } from '$lib/stores';
	export let options: Permission[];
	export let disableOptions: boolean = false;
	let selectedArray: Permission[] = [];

	const dispatch = createEventDispatcher();
	const onSelected = (option) => {
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
	class="user-role flex flex-col justify-center items-start gap-[1.25rem] max-w-full w-full max-h-[300px] overflow-y-scroll no-scrollbar h-full"
>
	<div
		class="roles flex items-start gap-[0.625rem] w-full max-w-full overflow-x-scroll no-scrollbar mb-5 flex-wrap"
	>
		{#each options as option, i (i)}
			<Pill selected={checkSelected(option)} {option} on:selected={(e) => onSelected(e.detail)} />
		{/each}
	</div>
</div>
