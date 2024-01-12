<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { enhance } from '$app/forms';
	import { showToast } from '$lib/utils';
	import { fly, slide } from 'svelte/transition';
	import Modal from './Modal.svelte';
	import UploadBox from './UploadBox.svelte';
	import { createEventDispatcher } from 'svelte';

	export let images: any[];
	dayjs.extend(relativeTime);

	// console.log(images);

	let showModal: boolean = false;
	let showDeleteModal: boolean = false;
	let loading: boolean = false;
	let validationErrors: { name?: [string]; logo?: [string] };
	let imageValidationError: string;
	let selectedImage;
	const dispatch = createEventDispatcher();

	const toggleModal = () => {
		showModal = !showModal;
	};
	const toggleDeleteModal = (currImage) => {
		selectedImage = currImage;
		showDeleteModal = !showDeleteModal;
	};

	const selectMedia = (image) => {
		selectedImage = image;

		dispatch('selected', selectedImage);
		showToast('Image selected successfully', 'info');
	};
</script>

<div class="max-w-full w-[930px] bg-white rounded flex flex-col h-auto items-start">
	<section class="flex gap-2 px-3 py-4 items-center w-full shadow">
		<h5 class="text-lg font-satoshi font-bold">Media manager</h5>
	</section>

	<div class="flex-1 flex flex-col gap-8 py-10 px-8 w-full">
		<div class="flex flex-col gap-4 w-full">
			<p>Gallery</p>
			<section class=" flex justify-between w-full">
				<div
					class="flex items-center w-[18em] border gap-2 rounded-md border-[#D9D9D9] text-[#232222] px-2"
				>
					<span>
						<svg
							width="20x"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
								stroke="#A9A9A9"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M21 20.9999L16.65 16.6499"
								stroke="#A9A9A9"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
					<input
						type="text"
						placeholder="Type here"
						class=" py-0.5 flex-auto outline-none placeholder:text-xs"
					/>
				</div>

				<button
					on:click={toggleModal}
					class="bg-primary-100 py-2 px-2.5 flex items-center gap-1 text-sm rounded-3xl text-white"
				>
					<span>
						<img src="/icons/plus.svg" alt="plus" />
					</span>
					<span>Upload media</span>
				</button>
			</section>
		</div>
		<div class="grid grid-cols-3 gap-10 overflow-scroll no-scrollbar max-h-[300px]">
			{#each images as image}
				<div
					on:click={() => selectMedia(image)}
					class="w-full brand-image-card flex flex-col gap-1 items-start rounded-t-xl border-grey-300"
				>
					<div class="brand-image overflow-hidden relative h-32 self-stretch bg-[#f9f9f9]">
						<img
							class="h-full w-full object-cover rounded-lg"
							src={image.image}
							alt={image.title}
						/>

						<div
							in:fly={{ y: -100 }}
							out:fly={{ y: 100 }}
							class="absolute hidden h-full w-full text-primary-50 bg-grey-100/40 z-10 top-0 translate-y-[-100%] transition-all duration-500 items-center gap-2 justify-center"
						>
							<button class="bg-white text-black-100 flex items-center py-0.5 px-3 rounded-md"
								><iconify-icon width="20" icon="mdi:eye"></iconify-icon></button
							>
							<button
								on:click={() => toggleDeleteModal(image)}
								class="bg-white hover:bg-white/60 hover:text-red-500 transition-all delay-200 text-black-100 flex items-center py-0.5 px-3 rounded-md"
								><iconify-icon width="20" icon="mdi:trash"></iconify-icon></button
							>
						</div>
					</div>
					<div class="media-info flex w-full flex-col items-start gap-2 flex-[1 0 0]">
						<div class="media-name text-base font-medium">{image.title}</div>
						<div class="date-added flex items-center gap-2 self-stretch">
							<div class="date-icon">
								<img src="/icons/clock.svg" alt="clock icon" />
							</div>
							<div class="date text-xs text-grey-100 flex-[1 0 0]">
								Added {dayjs(image.updated_at).fromNow()}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- create image modal -->
<Modal {showModal} on:close={() => (showModal = false)}>
	<form
		action="/?/upload"
		method="post"
		use:enhance={() => {
			loading = true;

			return async ({ update, result }) => {
				try {
					if (result.status === 200) {
						showToast('New media uploaded successfully', 'success');
						toggleModal();
					} else if (result.status === 400) {
						validationErrors = result.data.errors;
						if (validationErrors && validationErrors.logo) {
							imageValidationError = validationErrors.logo[0];
						}
					} else {
						showToast('Ooops something went wrong!!', 'error');
					}
				} finally {
					loading = false;
					update();
				}
			};
		}}
		enctype="multipart/form-data"
		slot="modal-content"
		class="max-w-md w-full px-6 py-8 flex flex-col gap-5 rounded-md bg-white"
	>
		<UploadBox error={imageValidationError} inputName="image" />
		<div class="modal-input">
			<input
				type="text"
				name="image-title"
				id="image-title"
				placeholder="Media name"
				class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
			/>
			{#if validationErrors?.name}
				<sub
					transition:slide={{ delay: 250, duration: 300 }}
					class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.name}</sub
				>
			{/if}
		</div>
		<div class="modal-submit">
			<button
				class="bg-primary-50 py-[0.88rem] px-[0.63rem] rounded-[8px] w-full md:w-[25rem]
					hover:bg-[#C7453C] hover:rounded-[0.625rem]
					focus:shadow-custom text-white font-bold text-sm max-h-12 flex items-center justify-center
					"
				type="submit"
			>
				{#if loading}
					<iconify-icon width="35" icon="eos-icons:three-dots-loading"></iconify-icon>
				{:else}
					<span class="button-text">Upload media</span>
				{/if}
			</button>
		</div>
	</form>
</Modal>

<!-- delete image modal -->
<Modal showModal={showDeleteModal} on:close={() => (showDeleteModal = false)}>
	<form
		slot="modal-content"
		action="/?/delete-media"
		use:enhance={async () => {
			loading = true;
			return async ({ result, update }) => {
				try {
					if (result.status == 200) {
						showToast('Image deleted successfully', 'success');
						console.log(images);

						images = images.filter((image) => image.id !== selectedImage.id);
						console.log(images);
						showDeleteModal = false;
					} else {
						showToast('Ooops something went wrong', 'error');
					}
				} finally {
					loading = false;
					update();
				}
			};
		}}
		method="post"
		class="w-[350px] bg-white rounded-md py-5 px-8 flex flex-col items-center justify-center"
	>
		<input type="text" bind:value={selectedImage.id} name="image-id" class="hidden" />
		<h5 class="font-medium mb-5">Do you want to delete {selectedImage.title}?</h5>
		<div class="  w-full text-primary-50 flex items-center gap-2 justify-center">
			<button
				type="submit"
				class="bg-green-300 text-white flex items-center py-0.5 px-4 rounded-md"
			>
				{#if loading}
					<iconify-icon width="20" icon="eos-icons:three-dots-loading"></iconify-icon>
				{:else}
					<span class="button-text">Yes </span>
				{/if}
			</button>
			<button
				type="button"
				on:click={() => (showDeleteModal = false)}
				class="bg-rose-500 text-white transition-all delay-200 flex items-center py-0.5 px-4 rounded-md"
				>No</button
			>
		</div>
	</form>
</Modal>

<style>
	.brand-image-card:hover .brand-image div {
		display: flex;
		text-align: center;
		animation-name: translateImage;
		animation-duration: 500ms;
		animation-direction: normal;
		animation-timing-function: linear;
		animation-fill-mode: forwards;
	}

	@keyframes translateImage {
		/* 0% {
			transform: translateY(-100%);
			-ms-transform: translateY(100%);
		}
		50% {
			transform: translateY(-50%);
			-ms-transform: translateY(50%);
		}
		100% {
			transform: translateY(0%);
			-ms-transform: translateY(0%);
		} */
		from {
			opacity: 0;
			transform: translateY(-100%);
			-ms-transform: translateY(-100%);
		}
		to {
			transform: translateY(0%);
			-ms-transform: translateY(0%);
			opacity: 1;
		}
	}
</style>
