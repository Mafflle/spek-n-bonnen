<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { clickOutsideAction } from 'svelte-legos';

	export let showIcon = true;
	export let handleClickOutside = false;

	export let open = false;
	let mouseOver = false;
	const dispatch = createEventDispatcher();

	const toggleDropdown = () => {
		open = !open;
		dispatch('toggledDropdown', open);
	};
	const toggleMouseOver = () => {
		mouseOver = !mouseOver;
		dispatch('toggledMouseOver', mouseOver);
	};

	let dropdownTriggerClass = '';
	let importedClass = '';
	export { dropdownTriggerClass as tiggerStyle, importedClass as class };
</script>

<div
	use:clickOutsideAction
	on:clickoutside={() => handleClickOutside && (open = false)}
	class="dropdown {importedClass}"
>
	<button
		class=" flex w-full items-center gap-2"
		on:mouseenter={toggleMouseOver}
		on:mouseleave={toggleMouseOver}
		on:click={toggleDropdown}
	>
		<slot name="dropdown-trigger" />
	</button>

	<slot name="dropdown-content" />
</div>

<style>
</style>
