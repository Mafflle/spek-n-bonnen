<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Drawer from '$lib/components/ui/drawer';
	import { mediaQuery } from 'svelte-legos';

	export let showModal: boolean = false;
	export let mode: string = 'dialog';
	const dispatch = createEventDispatcher();

	const isDesktop = mediaQuery('(min-width: 768px)');
	// $: console.log(isDesktop);
</script>

{#if $isDesktop}
	{#if mode === 'dialog'}
		<Dialog.Root bind:open={showModal} onOpenChange={() => dispatch('close')}>
			<Dialog.Content class="md:p-0 md:min-w-max ">
				<slot name="modal-content" class="  " />
			</Dialog.Content>
		</Dialog.Root>
	{:else if mode === 'sheet'}
		<Sheet.Root
			onOutsideClick={() => dispatch('close')}
			bind:open={showModal}
			onOpenChange={() => dispatch('close')}
		>
			<Sheet.Content class="">
				<slot name="modal-content" class="  " />
			</Sheet.Content>
		</Sheet.Root>
	{/if}
{:else}
	<Drawer.Root
		onOutsideClick={() => dispatch('close')}
		bind:open={showModal}
		onOpenChange={() => dispatch('close')}
	>
		<Drawer.Content class="max-h-[50vh]">
			<slot name="modal-content" class="" />
		</Drawer.Content>
	</Drawer.Root>
{/if}
