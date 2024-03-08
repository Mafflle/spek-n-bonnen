<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	export let showModal: boolean = false;
	const dispatch = createEventDispatcher();
</script>

<Dialog.Root bind:open={showModal} onOpenChange={() => dispatch('close')}>
	<Dialog.Content class="md:p-0 md:min-w-max ">
		<slot name="modal-content" class="  " />
	</Dialog.Content>
</Dialog.Root>
