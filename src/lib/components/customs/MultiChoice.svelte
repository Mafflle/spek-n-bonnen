<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let value: string | any = '';
	export let showAddChoiceButton = false;
	export let index: number;
	export let lastIndex = true;

	function handleDelete() {
		console.log('delete');

		dispatch('deleteChoice', index);
	}
	function handleAddChoice() {
		dispatch('addChoice', value.trim());
	}
</script>

<div class=" multiple-choice flex items-center text-grey-300 gap-2 w-full">
	<iconify-icon width="20" icon="akar-icons:radio" />

	<input
		type="text w-full"
		placeholder="Enter option"
		bind:value
		class="focus:outline-none text-sm w-full py-2 text-black-100"
	/>
	<!-- {#if isFocused} -->
	<button
		type="button"
		disabled={!value}
		class="flex items-center w-fit h-full"
		on:click={handleDelete}
	>
		<iconify-icon width="22" icon="hugeicons:cancel-01" />
	</button>
	<!-- {/if} -->
</div>
{#if showAddChoiceButton && lastIndex}
	<button
		type="button"
		on:click={handleAddChoice}
		class="w-fit mt-2 text-grey-100 italic text-xs flex gap-1 items-center block"
	>
		<span> "Add Choice" </span>
	</button>
{/if}

<style>
	.multiple-choice {
		border-width: 0px;
	}

	.multiple-choice:has(> input:focus) {
		border-color: #d9d9d9;
		border-bottom-width: 2px;
	}
</style>
