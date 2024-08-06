<script lang="ts">
	import { debounce } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	export let loading: boolean;
	export let token: string;
	export let endpoint: string;
	export let searchEndpoint: string;
	export let placeholder: string = 'Search...';
	export let className: string = '';
	export let query: string = '';

	let searching = false;
	const dispatch = createEventDispatcher();

	const search = debounce(async (search: string) => {
		searching = true;
		dispatch('searching', searching);
		try {
			const res = await fetch(`${endpoint}?search=${search}`, {
				headers: { access: `${token}`, to: searchEndpoint, ...(query && { query }) }
			});

			if (res.ok) {
				const searchResult = await res.json();

				dispatch('searched', searchResult);
			} else {
				const body = await res.json();

				return [];
			}
		} finally {
			searching = false;
			dispatch('searching', searching);
		}
	}, 700);

	let validationErrors: { search: string };
</script>

<div class=" w-full {!className && 'mb-5'}">
	<input
		type="text"
		name="search"
		id="search"
		{placeholder}
		on:input={(e) => search(e?.target?.value)}
		disabled={loading}
		class={!className
			? 'w-full px-2 focus:border-primary-100 focus:outline-none border-[#D9D9D9] border-b'
			: className}
	/>
	{#if validationErrors?.search}
		<sub transition:slide={{ delay: 250, duration: 300 }} class="text-rose-500 text-xs"
			>{validationErrors.search}</sub
		>
	{/if}
</div>
