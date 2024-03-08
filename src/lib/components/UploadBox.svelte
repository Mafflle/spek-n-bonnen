<script lang="ts">
	import { page } from '$app/stores';
	import { showToast } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import Modal from './Modal.svelte';
	import MediaManager from './MediaManager.svelte';

	console.log($page.data);

	let images: FileList | undefined = undefined;
	export let displayImages: File[] | string | undefined = undefined;
	let previewImage: any | undefined = undefined;

	export let error: string;
	export let maximumImages: number = 10;
	export let inputName: string = 'images';
	export const allowMultiple: boolean = true;
	const setPreview = (image: File) => {
		previewImage = URL.createObjectURL(image);
	};

	$: {
		if (images) {
			setPreview(images[0]);
		}

		// Check if the number of images is greater than the maximum allowed
		if (images && images.length > maximumImages) {
			images = undefined;
			previewImage = undefined;
			showToast(`You can only upload up to ${maximumImages} images`, 'error');
		}

		// Check if the images are too large
		if (images) {
			for (let i = 0; i < images.length; i++) {
				if (images[i].size > 5 * 1024 * 1024) {
					images = undefined;
					previewImage = undefined;
					showToast('Images must be less than 5MB', 'error');
					break;
				}
			}
		}

		// Check if the images are not of the correct type
		if (images) {
			for (let i = 0; i < images.length; i++) {
				if (!images[i].type.startsWith('image')) {
					images = undefined;
					previewImage = undefined;
					showToast('Only images are allowed', 'error');
					break;
				}
			}
		}
	}

	$: {
		if (displayImages && !images?.length) {
			if (displayImages instanceof Array) {
				previewImage = displayImages[0]?.url;
			} else previewImage = displayImages;
		}
	}

	let showMediaManager: boolean = false;

	const dispatch = createEventDispatcher();
</script>

<div class="w-full">
	<div
		class="min-w-full relative rounded-xl h-full flex p-auto md:py-8 md:px-auto flex-col items-start gap-3 self-stretch hover:bg-primary-softPink-100 border-2 border-grey-300 hover:border-primary-red border-dashed"
	>
		<input
			bind:files={images}
			on:drop={(e) => {
				e.preventDefault();
				showMediaManager = true;
			}}
			on:click={(e) => {
				e.preventDefault();
				showMediaManager = true;
			}}
			type="file"
			name={inputName}
			id={inputName}
			multiple={maximumImages > 1}
			accept="image/*"
			class="w-full cursor-pointer h-full absolute top-0 left-0 opacity-0 z-10"
		/>
		<div class="upload-box-info h-full w-full flex flex-col justify-center items-center gap-4">
			{#if previewImage}
				<img
					src={previewImage.image}
					alt=""
					style="aspect-ratio: 1/1"
					class=" h-full absolute w-full top-0 object-fit pointer-events-none rounded-xl"
				/>
			{/if}
			<div class="image w-10 h-10 rounded-full flex justify-center items-center">
				<img src="/icons/regular-image.svg" alt="reguar icon" />
			</div>
			<span class="w-fit text-center text-xs text-grey-100 p-1.5 text-clip">
				Drop your image here or click here to upload
			</span>
			<!-- <span>or</span> -->
			<!-- <button class="bg-primary-red py-2.5 px-4 text-sm font-medium text-white rounded-[30px]"
				>Import from your computer</button
			> -->
		</div>
	</div>

	{#if error}
		<sub
			transition:slide={{ delay: 250, duration: 300 }}
			class="text-rose-500 text-xs tracking-[-0.0075rem]">{error}</sub
		>
	{/if}
</div>

<!-- media manager -->
<Modal showModal={showMediaManager} on:close={() => (showMediaManager = false)}>
	<MediaManager
		slot="modal-content"
		images={$page.data.images.results}
		on:selected={(e) => {
			previewImage = e.detail;
			showMediaManager = false;
			dispatch('imageSelected', { imageId: e.detail.id });
		}}
	/>
</Modal>
