<script lang="ts">
	import { container } from '$lib/stores';
	import { isEqual, type Option } from '$lib/utils';
	import { createEventDispatcher, onMount } from 'svelte';

	export let option: Option;
	export let disableOptions: boolean = false;

	let selected = false;
	const dispatch = createEventDispatcher();

	const toggle = () => {
		selected = !selected;
		dispatch('selected', option);
	};
	let hovering: boolean = false;

	onMount(() => {
		// console.log('pill', $options);

		container.subscribe((items) => {
			items.map((item) => {
				if (isEqual(option, item)) {
					selected = true;
				}
			});
		});
	});
</script>

<button
	type="button"
	disabled={disableOptions}
	on:mouseenter={() => (hovering = true)}
	on:mouseleave={() => {
		if (!selected) hovering = false;
	}}
	class={`py-2.5 px-4 rounded-2xl text-xs text-center flex items-center gap-0.5 hover:bg-primary-light hover:text-primary-red ${
		selected ? 'bg-primary-light text-primary-red' : 'bg-[#f0f0f0] text-grey-100'
	}`}
	on:click={toggle}
>
	{option.label}
	{#if hovering || selected}
		<span
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
		</span>
	{/if}
</button>
