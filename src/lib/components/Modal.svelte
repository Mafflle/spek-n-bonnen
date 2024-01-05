<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let showModal: boolean = false;
	const dispatch = createEventDispatcher();
</script>

{#if showModal}
	<div
		role="dialog"
		class="w-screen h-screen fixed flex top-0 left-0 items-center justify-center z-50"
	>
		<button on:click={() => dispatch('close')} class="bg-[#000000CC] w-full h-full"> </button>
		<section class="absolute">
			<slot name="modal-content" />
		</section>
	</div>
{/if}
