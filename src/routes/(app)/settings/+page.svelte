<script lang="ts">
	import MediaManager from '$lib/components/MediaManager.svelte';
	import Modal from '$lib/components/Modal.svelte';
	let showModal = true;
	function toggleModal() {
		showModal = !showModal;
	}
</script>

<Modal {showModal} on:close={toggleModal}>
	<div slot="modal-content">
		<MediaManager />
	</div>
</Modal>
