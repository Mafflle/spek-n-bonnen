<script lang="ts">
	import { enhance } from '$app/forms';
	import { onDestroy } from 'svelte';
	import { mediaState, uploadState } from '../stores';
	import { showToast } from '../utils';
	import Modal from './Modal.svelte';
	import UploadBox from './UploadBox.svelte';
	import { slide } from 'svelte/transition';

	let validationErrors: { name?: [string]; logo?: [string] };
	let imageValidationError: string;
	let unsubscribe = mediaState.subscribe((state) => (state = state));

	const toggleUpload = () => {
		mediaState.update((state) => ({
			...state,
			showUpload: !state.showUpload,
			showDelete: false
		}));
	};

	const selectMedia = (image) => {
		uploadState.update((state) => ({ ...state, previewImage: image.image, files: [image] }));
		mediaState.update((state) => ({ ...state, isOpen: false }));
	};
	$: imageCount = $mediaState.images.length;

	onDestroy(unsubscribe);
</script>

<Modal
	showModal={$mediaState.isOpen}
	on:close={() => mediaState.update((state) => ({ ...state, isOpen: false }))}
>
	<div slot="modal-content" class="w-full flex h-full">
		{#if !$mediaState.showUpload && !$mediaState.showDelete}
			<div class="max-w-4xl w-full min-w-[500px] bg-white rounded flex flex-col h-auto items-start">
				<section class="flex justify-between gap-2 px-3 py-4 items-center w-full shadow">
					<h5 class="text-lg font-satoshi font-bold">Media manager</h5>
					<!-- {#if multiple}
						<Button
							on:click={dispatchSelectedImages}
							disabled={selectedItems.length < 1}
							variant="secondary">Done</Button
						>
					{/if} -->
				</section>

				<div class="flex-1 flex flex-col gap-2 p-4 md:py-10 md:px-8 w-full">
					<div class="mb-6 flex flex-col gap-4 w-full">
						<p>Gallery ({imageCount})</p>
						<section class=" flex justify-between items-center w-full">
							<div
								class="flex items-center sm:w-[18em] border gap-2 rounded-md border-[#D9D9D9] text-[#232222] px-2"
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
							<div class="flex items-center gap-3">
								<button
									on:click={() => toggleUpload()}
									type="button"
									class="bg-primary-100 py-1.5 px-4 flex items-center gap-1 text-sm rounded-3xl text-white"
								>
									<iconify-icon icon="mingcute:upload-3-fill" width="22"></iconify-icon>

									<span class="hidden sm:block">Upload</span>
								</button>
							</div>
						</section>
					</div>

					{#if $mediaState.images.length > 0}
						<div
							class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 overflow-scroll no-scrollbar max-h-96"
						>
							{#each $mediaState.images as image}
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<div
									on:click={() => selectMedia(image)}
									class="w-full brand-image-card flex flex-col gap-1 items-start rounded-t-xl border-grey-300"
								>
									<div
										class="brand-image overflow-hidden cursor-pointer relative h-32 self-stretch bg-[#f9f9f9]"
									>
										<img
											loading="lazy"
											class="h-full w-full object-cover aspect-[16/9] object-center rounded-lg"
											src={image.image}
											alt={image.title}
										/>

										<!-- {#if multiple && selectedItems.find((item) => item.id === image.id)}
											<div
												class="w-full h-full absolute bg-[#908c8c36] top-0 flex items-end justify-end"
											>
												<span
													class="border-2 border-white rounded-full flex items-center justify-center p-0"
													><iconify-icon
														width="25"
														icon="ri:checkbox-circle-fill"
														class="m-0 text-green-500"
													></iconify-icon></span
												>
											</div>
										{/if} -->
									</div>
									<div class="media-info flex w-full flex-col items-start gap-2 flex-[1 0 0]">
										<div class="media-name text-base font-medium">{image.title}</div>
										<div class="date-added flex items-center gap-2 self-stretch">
											<div class="date-icon">
												<img src="/icons/clock.svg" alt="clock icon" />
											</div>
											<!-- <div class="date text-xs text-grey-100 flex-[1 0 0]">
												Added {dayjs(image.updated_at).fromNow()}
											</div> -->
										</div>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="w-full flex flex-col items-center justify-center h-28">
							<span
								><iconify-icon class="text-grey-300" width="45" icon="solar:gallery-remove-bold"
								></iconify-icon></span
							>
							<h3 class="text-grey-100 font-satoshi">No images added.</h3>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		{#if $mediaState.showUpload}
			<form
				action="/?/upload-media"
				method="post"
				use:enhance={() => {
					$mediaState.loading = true;

					return async ({ update, result }) => {
						try {
							if (result.status === 200) {
								mediaState.update((state) => ({
									...state,
									images: [...state.images, result.data.newMedia]
								}));
								showToast('New media uploaded successfully', 'success');

								toggleUpload();
							} else if (result.status === 400) {
								validationErrors = result.data.errors;
								if (validationErrors && validationErrors?.image) {
									imageValidationError = validationErrors.image[0];
								}
							} else {
								showToast('Ooops something went wrong!!', 'error');
							}
						} finally {
							$mediaState.loading = false;
							update();
						}
					};
				}}
				enctype="multipart/form-data"
				class="max-w-md h-full w-full px-6 py-8 flex flex-col gap-5 rounded-md bg-white"
			>
				<UploadBox isFileInput={true} inputName="image" />
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
						{#if $mediaState.loading}
							<iconify-icon width="35" icon="eos-icons:three-dots-loading"></iconify-icon>
						{:else}
							<span class="button-text">Upload media</span>
						{/if}
					</button>
				</div>
			</form>
		{/if}
		{#if $mediaState.showDelete}
			<!-- <form
				
				action="/?/delete-media"
				method="post"
				class="w-[350px] bg-white rounded-md py-5 px-8 flex flex-col items-center justify-center"
			>
				<input type="text" bind:value={selectedItems.id} name="image-id" class="hidden" />
				<h5 class="font-medium mb-5">Do you want to delete {selectedItems.title}?</h5>
				<div class="  w-full text-primary-50 flex items-center gap-2 justify-center">
					<button
						type="submit"
						class="bg-green-300 text-white flex items-center py-0.5 px-4 rounded-md"
					>
						{#if $mediaState.loading}
							<iconify-icon width="20" icon="eos-icons:three-dots-$mediaState.loading"></iconify-icon>
						{:else}
							<span class="button-text">Yes </span>
						{/if}
					</button>
					<button
						type="button"
						on:click={() => mediaState.update((state) => ({ ...state, showDelete: false }))}
						class="bg-rose-500 text-white transition-all delay-200 flex items-center py-0.5 px-4 rounded-md"
						>No</button
					>
				</div>
			</form> -->
		{/if}
	</div>
</Modal>

<!-- create image modal -->

<!-- delete image modal -->

<style>
	/* .brand-image-card:hover .brand-image div {
		display: flex;
		text-align: center;
		animation-name: translateImage;
		animation-duration: 500ms;
		animation-direction: normal;
		animation-timing-function: linear;
		animation-fill-mode: forwards;
	} */

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
		/* from {
			opacity: 0;
			transform: translateY(-100%);
			-ms-transform: translateY(-100%);
		}
		to {
			transform: translateY(0%);
			-ms-transform: translateY(0%);
			opacity: 1;
		} */
	}
</style>
