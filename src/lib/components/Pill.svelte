<script lang="ts">
	import { container, type Permission, type Role } from '$lib/stores';
	import { debounce, isEqual, type Option } from '$lib/utils';
	import { createEventDispatcher, onMount } from 'svelte';

	export let option: Permission | Role;

	export let selected: boolean = false;
	const dispatch = createEventDispatcher();

	const toggle = () => {
		container.update((items) => {
			if (items.some((item) => isEqual(item, option))) {
				const updatedItems = items.filter((item) => {
					return item.id !== option.id;
				});
				return updatedItems;
			} else return [option, ...items];
		});
		dispatch('selected', option);
		selected = !selected;
		// console.log(selected);
	};
	let hovering: boolean = false;

	onMount(() => {
		// container.subscribe((items) => {
		// 	if (items.some((item) => isEqual(option, item))) {
		// 		selected = true;
		// 	}
		// });
	});
</script>

<button type="button" on:click={debounce(toggle, 100)} on:blur={() => (selected = selected)}>
	{#if selected}
		<div
			class:active={selected}
			class="py-2.5 px-4 rounded-2xl text-xs text-center flex text-grey-100 items-center gap-0.5 hover:bg-primary-light hover:text-primary-red bg-pGrey"
		>
			<span>{option.codename ? option.codename : option.name}</span>
			<!-- <button on:click={() => (selected = false)} type="button"
				><svg
					width="15"
					height="15"
					viewBox="0 0 15 15"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M11.25 3.75L3.75 11.25"
						stroke="#DC5950"
						stroke-width="1.25"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M3.75 3.75L11.25 11.25"
						stroke="#DC5950"
						stroke-width="1.25"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button> -->
		</div>
	{:else}
		<div
			class="py-2.5 px-4 rounded-2xl text-xs text-center flex text-grey-100 items-center gap-0.5 hover:bg-primary-light hover:text-primary-red bg-pGrey"
		>
			<span>{option.codename ? option.codename : option.name}</span>
		</div>
	{/if}
</button>
