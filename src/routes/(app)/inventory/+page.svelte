<script lang="ts">
	export let data;
	let inventory = JSON.stringify(data.props);
</script>

<svelte:head>
	<title>Inventory - Spek-n-Boonen</title>
</svelte:head>
<h1>Inventory</h1>
{inventory}
