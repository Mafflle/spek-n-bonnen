<script>
	let importedClass = '';
	export let isOpen = false;
	export { importedClass as class };
</script>

{#if isOpen}
	<div class="dropdown-content flex flex-col pl-11 {importedClass}">
		<slot name="dropdown-items" />
	</div>
{/if}
