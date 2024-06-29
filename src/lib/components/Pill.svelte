<script lang="ts">
	import { container, type Permission, type Role } from '$lib/stores';
	import type { User } from '$lib/user';
	import { debounce, isEqual, type Option } from '$lib/utils';
	import { createEventDispatcher, onMount } from 'svelte';

	export let option: Permission | Role | User;

	export let selected: boolean = false;
	export let mute: boolean = false;
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
	// console.log(option);sx

	onMount(() => {
		// container.subscribe((items) => {
		// 	if (items.some((item) => isEqual(option, item))) {
		// 		selected = true;
		// 	}
		// });
	});
</script>

<button
	disabled={mute}
	type="button"
	on:click={debounce(toggle, 100)}
	on:blur={() => (selected = selected)}
>
	{#if selected}
		<div
			class:active={selected}
			class="py-2.5 px-4 rounded-2xl text-xs text-center flex text-grey-100 items-center gap-0.5 hover:bg-primary-light hover:text-primary-red bg-pGrey"
		>
			<span
				>{#if option?.codename}
					{option?.codename}
				{:else if option.staff_profile}
					{option.staff_profile?.first_name} {option.staff_profile?.last_name}
				{:else if option.name}
					{option.name}
				{:else if option.email}
					{option.email}
				{/if}
			</span>
		</div>
	{:else}
		<div
			class="py-2.5 px-4 rounded-2xl text-xs text-center flex text-grey-100 items-center gap-0.5 hover:bg-primary-light hover:text-primary-red bg-pGrey"
		>
			<span
				>{#if option?.codename}
					{option?.codename}
				{:else if option.staff_profile}
					{option.staff_profile.first_name} {option.staff_profile.last_name}
				{:else if option.name}
					{option.name}
				{:else if option.email}
					{option.email}
				{/if}
			</span>
		</div>
	{/if}
</button>
