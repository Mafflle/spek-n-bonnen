<script lang="ts">
	import { showToast } from '$lib/utils';

	let images: FileList | undefined = undefined;
	export let displayImages: FileList[] | string | undefined = undefined;
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
</script>

<div
	class="w-full relative rounded-xl flex py-8 px-24 flex-col items-start gap-3 self-stretch border border-primary-50 border-dashed bg-[#FFF4F3]"
>
	<input
		bind:files={images}
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
		<div
			class="text text-center text-sm leading-5 tracking-[-0.13px] text-black-100 flex flex-col items-center gap-3"
		>
			<div>Drag and drop file</div>
			<div>or</div>
		</div>
		<button
			class="bg-primary-50 py-[0.88rem] px-[0.63rem] w-52
		hover:bg-[#C7453C] hover:rounded-[0.625rem]
		focus:shadow-custom text-white font-bold text-sm max-h-12 flex items-center justify-center
		rounded-3xl
		"
			type="submit"
		>
			<span class="button-text">Import from computer </span>
		</button>
	</div>
</div>
