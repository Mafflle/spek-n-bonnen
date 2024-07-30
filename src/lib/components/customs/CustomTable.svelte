<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { createEventDispatcher, type SvelteComponent } from 'svelte';
	const dispatch = createEventDispatcher();
	export let props: {
		columns: { name: string }[];
		RowComponent: SvelteComponent;
		RowsData: any[];
	};
</script>

<Table.Root class="w-full">
	<Table.Caption></Table.Caption>
	<Table.Header class="sticky top-0 w-full">
		<Table.Row class="h-[55px] bg-[#F9F9F9] font-satoshi font-medium ">
			{#each props.columns as column}
				<Table.Head class=" text-grey-200 ">{column.name}</Table.Head>
			{/each}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each props.RowsData as rowData}
			<svelte:component
				this={props.RowComponent}
				data={rowData}
				on:toggleEdit={(event) => dispatch('toggleEdit', event.detail)}
			/>
		{/each}
	</Table.Body>
</Table.Root>
