<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	export let showModal: boolean = false;
	const dispatch = createEventDispatcher();
</script>

<Dialog.Root bind:open={showModal} onOpenChange={() => dispatch('close')}>
	<Dialog.Content class="md:p-0 ">
		<slot name="modal-content" />
	</Dialog.Content>
</Dialog.Root>
