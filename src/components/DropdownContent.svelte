<script>
	export let isOpen = false;

	let importedClass = '';
	export { importedClass as class };

	console.log(importedClass);
</script>

{#if isOpen}
	<div class="dropdown-content flex flex-col pl-11 {importedClass}">
		<slot name="dropdown-items" />
	</div>
{/if}
