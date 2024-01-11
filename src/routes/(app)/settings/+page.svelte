<script lang="ts">
	import MediaManager from '$lib/components/MediaManager.svelte';
	import Modal from '$lib/components/Modal.svelte';

	let showModal: boolean = false;
	const toggleModal = () => {
		showModal = !showModal;
	};
</script>

<div class="max-w-full h-full">
	<div class="w-full flex flex-col items-start gap-9">
		<section class="w-full">
			<h1 class="text-3xl">Settings</h1>
		</section>
		<div class="grid grid-cols-3 gap-4 w-full">
			<button on:click={toggleModal} class="bg-sGray rounded w-full h-36 py-2 px-3 flex">
				<section class="flex gap-2 items-center">
					<span class="text-primary-100"
						><iconify-icon icon="material-symbols-light:media-link-outline" width="35"
						></iconify-icon></span
					>
					<h5 class="text-lg font-satoshi">Media manager</h5>
				</section>
			</button>
			{#each { length: 2 } as card}
				<div class="bg-sGray rounded w-full h-36">
					<section></section>
				</div>
			{/each}
		</div>
	</div>
</div>

<Modal on:close={() => (showModal = false)} {showModal}>
	<MediaManager slot="modal-content" />
</Modal>
