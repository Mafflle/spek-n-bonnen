<script lang="ts">
	import { page } from '$app/stores';
	import { showToast } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import Modal from './Modal.svelte';
	import MediaManager from './MediaManager.svelte';
	import * as Avatar from './ui/avatar';

	let images: FileList | undefined = undefined;
	export let files: any[] = [];
	let previewImage: any | undefined = undefined;

	export let error: string | undefined = '';
	export let small: boolean = false;
	export let defaultValue:
		| { id: number; title: string; image: string; updated_at: Date; created_at: Date }
		| undefined
		| number;
	export let smallText: string = '';
	export let maximumImages: number = 10;
	export let inputName: string = 'images';
	export let allowMultiple: boolean = false;
	export let isFileInput: boolean = false;
	const setPreview = (image) => {
		if (isFileInput) {
			previewImage = URL.createObjectURL(image);
		} else {
			previewImage = image.image;
		}
	};

	if (defaultValue) {
		previewImage = defaultValue.image;
	}
	$: {
		if (files.length > 0) {
			previewImage = files[0].image;
		}
		if (isFileInput) {
			// Check if the number of images is greater than the maximum allowed

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
	}

	// $: console.log(defaultValue);

	let showMediaManager: boolean = false;

	const dispatch = createEventDispatcher();

	let fileInputName = isFileInput ? inputName : 'preview-image';
</script>

<div
	class=" {small ? 'h-[85px] ' : ' min-h-[200px] min-w-full '} {previewImage
		? 'w-[85px] '
		: 'w-[230px]'}"
>
	<div
		class=" relative w-full h-full {small ?? 'justify-center '} {previewImage && small
			? ' px-1 justify-center rounded-full '
			: 'rounded-2xl'} flex p-auto md:px-auto flex-col items-start gap-3 self-stretch hover:bg-primary-softPink-100 {small
			? 'border-primary-softPink-50 border-2'
			: 'border-grey-300 border-2'} hover:border-primary-red border-dashed"
	>
		<input
			bind:files={images}
			on:drop={(e) => {
				if (!isFileInput) {
					e.preventDefault();
					showMediaManager = true;
				} else {
					e.preventDefault();
					images = e.dataTransfer?.files;
				}
			}}
			on:click={(e) => {
				if (!isFileInput) {
					e.preventDefault();
					showMediaManager = true;
				} else {
					images = e.dataTransfer?.files;
				}
			}}
			name={fileInputName}
			type="file"
			id={inputName}
			multiple={maximumImages > 1}
			accept="image/*"
			class="w-full cursor-pointer h-full absolute top-0 left-0 opacity-0 z-10"
		/>
		<div
			class="upload-box-info h-full w-full flex {small
				? 'flex-row items-center '
				: 'flex-col justify-center'} {previewImage ? 'px-0' : 'px-3'}  items-center gap-2"
		>
			{#if previewImage}
				<section
					class="w-full h-full absolute {small
						? 'flex items-center justify-center top-0 left-0'
						: ''}"
				>
					{#if small}
						<Avatar.Root class="w-14 h-14">
							<Avatar.Image src={previewImage} class="w-full h-full object-cover"></Avatar.Image>

							<Avatar.Fallback>IM</Avatar.Fallback>
						</Avatar.Root>
					{:else}
						<div class=" h-full w-full relative top-0">
							<img
								src={previewImage}
								alt=""
								style="aspect-ratio: 1/1"
								class="w-full h-full object-fit pointer-events-none rounded-xl"
							/>
							{#if allowMultiple && files.length > 1}
								<section
									class="w-full z-30 bg-[#818080a6] absolute bottom-0 py-1 px-3 flex gap-2 items-center"
								>
									{#each files as image}
										<button type="button" class="h-10 w-12" on:click={() => setPreview(image)}>
											<img src={image.image} alt="" class="h-full w-full object-cover" />
										</button>
									{/each}
								</section>
							{/if}
						</div>
					{/if}
				</section>
			{/if}
			<div
				class="{small ? 'w-14 h-14' : ' w-7 h-7'} rounded-full {previewImage
					? 'hidden'
					: 'flex'} justify-center items-center"
			>
				<img
					class="w-full h-full"
					src="/icons/{small ? 'image-upload-2' : 'image-upload-vector'}.svg"
					alt="file upload icon"
				/>
			</div>
			<span
				class="w-fit {small
					? 'text-black-100 text-sm'
					: 'max-w-[70%] text-grey-100 text-xs'}  {previewImage
					? 'hidden'
					: 'block'} font-satoshi text-center text-clip"
			>
				{#if small}
					{smallText}
				{:else}
					Drop your image here or click here to upload
				{/if}
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

	{#each files as file}
		<input type="text" class="hidden" bind:value={file.id} name={inputName} />
	{/each}
</div>

<!-- media manager -->
<Modal showModal={showMediaManager} on:close={() => (showMediaManager = false)}>
	<MediaManager
		multiple={allowMultiple}
		slot="modal-content"
		images={$page.data.images.results}
		on:selected={(e) => {
			files = e.detail;
			showMediaManager = false;
			dispatch('imageSelected', { imageId: e.detail.id });
		}}
	/>
</Modal>
