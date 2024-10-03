<script lang="ts">
	export let open = false;

	function toggleDropdown() {
		open = !open;
	}

	let dropdownTriggerClass = '';
	let importedClass = '';
	export { dropdownTriggerClass as tiggerStyle, importedClass as class };
</script>

<div class="dropdown {importedClass}">
	<li class="dropdown-trigger flex w-full rounded {dropdownTriggerClass}">
		<button class=" flex w-full items-center gap-2" on:click={toggleDropdown}>
			<slot name="dropdown-trigger" />
			<span class="flex h-7 w-7" class:rotate={open}>
				<img src="/icons/caret-down.svg" class="h-full w-full" alt="Caret down icon" />
			</span>
		</button>
	</li>

	<slot name="dropdown-content" />
</div>

<style>
	.rotate {
		transform: rotate(180deg);
	}
</style>
