<script lang="ts">
	import MediaManager from '$lib/components/MediaManager.svelte';
	import Modal from '$lib/components/Modal.svelte';
	let showModal = false;
	function toggleModal() {
		showModal = !showModal;
	}
</script>

<Modal {showModal} on:close={toggleModal}>
	<div slot="modal-content">
		<MediaManager />
	</div>
</Modal>
<button
	on:click={toggleModal}
	class="w-auto h-9 px-2.5 py-2 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
                    hover:bg-[#C7453C]
                    focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
>
	<div class="w-5 h-5 relative">
		<img src="/icons/plus.svg" alt="brand-plus" />
	</div>
	<div class="text-white text-sm font-bold font-['Satoshi']">toggle dialog (for testing)</div>
</button>
