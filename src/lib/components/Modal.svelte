<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Sheet from './ui/sheet';
	import * as Drawer from './ui/drawer';
	import { mediaQuery } from 'svelte-legos';
	export let showModal: boolean = false;
	export let mode: 'sheet' | 'dialog' = 'dialog';
	export let lock: boolean = false;
	const dispatch = createEventDispatcher();

	const isDesktop = mediaQuery('(min-width: 768px)');
	// $: console.log(isDesktop);
</script>

{#if $isDesktop}
	{#if mode === 'dialog'}
		<Dialog.Root bind:open={showModal} onOpenChange={() => dispatch('close')}>
			<Dialog.Content class="md:p-0 md:min-w-max w-full absolute z-[5000] ">
				<slot name="modal-content" class="w-full" />
			</Dialog.Content>
		</Dialog.Root>
	{:else if mode === 'sheet'}
		<Sheet.Root
			bind:open={showModal}
			closeOnOutsideClick={!lock}
			closeOnEscape={!lock}
			onOpenChange={() => dispatch('close')}
		>
			<Sheet.Content class="p-0">
				<slot name="modal-content" class="w-full" />
			</Sheet.Content>
		</Sheet.Root>
	{/if}
{:else}
	<Drawer.Root
		bind:open={showModal}
		onOpenChange={() => {
			showModal = false;
			dispatch('close');
		}}
	>
		<Drawer.Content class="max-h-[80vh]">
			<slot name="modal-content" class="w-full" />
		</Drawer.Content>
	</Drawer.Root>
{/if}
