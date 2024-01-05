<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import UploadBox from '$lib/components/UploadBox.svelte';
	let showModal = false;
	function toggleModal() {
		showModal = !showModal;
	}
</script>

<Modal {showModal} on:close={toggleModal}>
	<div slot="modal-content">
		<!-- Your modal content goes here -->
		<div class="w-[460px] flex flex-col items-center p-6 gap-8 bg-white rounded-md">
			<div class="modal-title flex items-center gap-3 self-stretch">
				<div class="title-text flex-[1 0 0] text-lg font-medium tracking-[-0.18px] w-11/12">
					Add brand
				</div>
				<div class="close-button flex justify-center items-center w-1/12">
					<img src="/icons/close.svg" alt="close icon" />
				</div>
			</div>
			<UploadBox />
		</div>
	</div>
</Modal>
<div class="page h-full w-full">
	<!-- render if page is empty -->
	<div class="empty h-full w-full flex justify-center items-center">
		<div class="empty-indicator flex flex-col justify-center items-center gap-5 w-[277px]">
			<div class="icon">
				<img src="/icons/empty-Illustration.svg" alt="empty illustration " />
			</div>
			<div class="content">
				<div class="text flex flex-col gap-3 justify-center items-center text-grey-300">
					<h3 class="title text-3xl font-medium tracking-[-0.64px]">No brand added</h3>
					<div class="info text-center text-sm font-medium leading-5 tracking-[-0.13px]">
						You currently don’t have any brand saved, click the button below to create one
					</div>
				</div>
			</div>
			<div class="button">
				<button
					class=" px-2.5 py-2.5 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
                hover:bg-[#C7453C]
                focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
					on:click={toggleModal}
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/plus.svg" alt="user-plus" />
					</div>
					<p class="text-white text-sm font-bold">Add brand</p>
				</button>
			</div>
		</div>
	</div>
</div>
