<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { createEventDispatcher } from 'svelte';

	export let showAlert: boolean = false;
	const dispatch = createEventDispatcher();
</script>

<AlertDialog.Root bind:open={showAlert} onOpenChange={() => dispatch('close')}>
	<AlertDialog.Content class=" md:min-w-max ">
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete the selected item.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				class="bg-red-600 text-white hover:bg-red-700"
				on:click={() => dispatch('delete')}
			>
				Delete
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
