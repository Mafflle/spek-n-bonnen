<script lang="ts">
	import { showToast } from '$lib/utils';

	let images: FileList | undefined = undefined;
	export let displayImages: File[] | string | undefined = undefined;
	let previewImage: string | undefined = undefined;

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

	$: console.log(images);
</script>

<div
	class="w-full relative rounded-xl flex py-8 px-24 flex-col items-start gap-3 self-stretch bg-primary-softPink-100 border-2 border-primary-red border-dashed"
>
	<input
		bind:files={images}
		on:change={(e) => {
			console.log(e);
		}}
		on:drop={(e) => {
			e.preventDefault();
			images = e.dataTransfer?.files;
		}}
		type="file"
		name={inputName}
		id={inputName}
		multiple={maximumImages > 1}
		accept="image/*"
		class="w-full cursor-pointer h-full absolute opacity-0 z-10"
	/>
	<div class="upload-box-info relative w-full flex flex-col justify-center items-center gap-4">
		{#if previewImage}
			<img
				src={previewImage}
				alt=""
				style="aspect-ratio: 4/3"
				class=" h-full absolute w-full top-0 object-cover"
			/>
		{/if}
		<div
			class="image w-14 h-14 rounded-full flex justify-center items-center border border-primary-softPink"
		>
			<img src="/icons/regular-image.svg" alt="reguar icon" />
		</div>
		<span> Drag and drop file </span>
		<span>or</span>
		<button class="bg-primary-red py-2.5 px-4 text-sm font-medium text-white rounded-[30px]"
			>Import from your computer</button
		>
		<!-- <div class="text text-center text-sm leading-5 tracking-[-0.13px] text-[#CDCDCD]">
			Drag and drop file or click <b class="text-primary-100">upload</b> from your computer
		</div> -->
	</div>
</div>
