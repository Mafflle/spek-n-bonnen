<script lang="ts">
	import { page } from '$app/stores';
	import { showToast } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';

	import MediaManager from './MediaManager.svelte';
	import * as Avatar from './ui/avatar';
	import { mediaState } from '../stores';

	page;

	let images: FileList | undefined = undefined;
	export let files: any[] = [];
	let previewImage: any | undefined = undefined;

	export let error: string | undefined = '';
	export let small: boolean = false;
	export let defaultValue:
		| { id: number; title: string; image: string; updated_at: Date; created_at: Date }
		| null
		| number = null;
	export let smallText: string = '';
	export let maximumImages: number = 10;
	export let inputName: string = 'images';
	export let allowMultiple: boolean = false;
	export let isFileInput: boolean = false;

	const setPreview = (image) => {
		if (isFileInput) {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(image);
			fileReader.addEventListener('load', function () {
				previewImage = this.result;
			});
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
				console.log(images[0]);

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
						showToast('Images must be less than 5MB', 'error');
						images = undefined;
						previewImage = undefined;
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

	let showMediaManager: boolean = false;

	const dispatch = createEventDispatcher();

	let fileInputName = isFileInput ? inputName : 'preview-image';
</script>

<div
	class=" {small ? 'h-[90px] w-[90px] ' : 'min-h-[200px] h-full w-full '} {previewImage &&
		'w-[90px]'}"
>
	<div
		class=" relative w-full h-full flex p-auto md:px-auto flex-col items-start gap-3 self-stretch hover:bg-primary-softPink-100 {small
			? 'border-primary-softPink-50 border-2 rounded-full justify-center '
			: 'border-grey-300 border-2  '} hover:border-primary-red border-dashed"
	>
		{#if isFileInput}
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
						dispatch('click');
					}
				}}
				name={fileInputName}
				type="file"
				id={inputName}
				multiple={maximumImages > 1}
				accept="image/*"
				class="w-full cursor-pointer h-full absolute top-0 left-0 opacity-0 z-10"
			/>
		{/if}
		<div
			on:click={() => mediaState.update((e) => (e = { state: true, type: 'default' }))}
			class="upload-box-info h-[200px] w-full flex {small
				? 'flex-row items-center justify-center '
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
								class="w-full h-full object-cover pointer-events-none {small && 'rounded-full'}"
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
			{#if !previewImage}
				<div class="{small ? 'w-14 h-14' : ' w-7 h-7'} flex justify-center items-center">
					<img
						class="w-full h-full"
						src="/icons/{small ? 'image-upload-2' : 'image-upload-vector'}.svg"
						alt="file upload icon"
					/>
				</div>
			{/if}
			{#if !small}
				<span
					class="w-fit
					max-w-[70%] text-grey-100 text-xs {previewImage
						? 'hidden'
						: 'block'} font-satoshi text-center text-clip"
				>
					Drop your image here or click here to upload
				</span>
			{/if}
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
<MediaManager images={$page.data.images.results} on:selected={(e) => (files = e.detail)} />
