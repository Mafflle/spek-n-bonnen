<script lang="ts">
	import { isEqual, type Option } from '$lib/utils';
	import { onDestroy, onMount } from 'svelte';
	import Pill from './Pill.svelte';
	import { selectedPerms, updateSelectedPerms } from '$lib/stores';
	export let options: Option[];

	let selectedArray: Option[] = [];

	const onSelected = (option: Option) => {
		if (!selectedArray.includes(option)) {
			selectedArray = [...selectedArray, option];
			updateSelectedPerms(option);
		}
	};
	onMount(() => {
		if ($selectedPerms.length > 0) {
			for (const item of $selectedPerms) {
				if (!options.some((option) => isEqual(option, item))) options = [...options, item];
			}
		}
	});
	onDestroy(() => {
		options = [];
		selectedArray = [];
	});
</script>

<div class="user-role flex flex-col justify-center items-start gap-[1.25rem] max-w-full w-full">
	<div class="roles flex items-start gap-[0.625rem] w-full max-w-full flex-wrap">
		{#each options as option, i (i)}
			<Pill {option} on:selected={(e) => onSelected(e.detail)} />
		{/each}
	</div>
</div>
