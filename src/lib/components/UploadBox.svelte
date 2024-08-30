<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { uploadState, mediaState } from '../stores';
	import { showToast } from '../utils';
	import * as Avatar from './ui/avatar';
	import { set } from 'zod';

	export let isFileInput = false;
	export let small = false;
	export let multiple = false;
	export let maximumImages = 5;
	export let inputName = 'image';
	export let files: File[] = [];
	export let fileInputName = 'image';
	export let defaultValue = {};

	const dispatch = createEventDispatcher();

	const setPreview = (image: string | ArrayBuffer) => {
		uploadState.update((state) => {
			state.previewImage = image as string;
			return state;
		});
	};
	if (defaultValue) {
		setPreview(defaultValue.image);
	}
	function validateFiles(files: FileList) {
		if (files.length > maximumImages) {
			showToast(`You can only upload up to ${maximumImages} images`, 'error');
			return false;
		}
		for (let file of files) {
			if (file.size > 5 * 1024 * 1024) {
				showToast('Images must be less than 5MB', 'error');
				return false;
			}
			if (!file.type.startsWith('image')) {
				showToast('Only images are allowed', 'error');
				return false;
			}
		}
		return true;
	}

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const selectedFiles = input.files;

		console.log(input, selectedFiles);

		if (selectedFiles && validateFiles(selectedFiles)) {
			const newFiles = Array.from(selectedFiles);
			if (!multiple) {
				newFiles.length = 1;
			}
			files = newFiles;
			dispatch('filesUpdated', newFiles);
			setPreview(URL.createObjectURL(newFiles[0]));
		} else {
			files = [];
			setPreview('');
		}
	}

	const unsubscribeMedia = mediaState.subscribe((state) => (state = state));
	const unsubscribeUpload = uploadState.subscribe((state) => (state = state));

	onDestroy(() => {
		unsubscribeMedia();
		unsubscribeUpload();
	});
</script>

<div
	class=" {small
		? 'h-[90px] w-[90px] '
		: 'min-h-[200px] h-full w-full'} {$uploadState.previewImage && 'w-[90px]'}"
>
	<div
		class=" relative w-full h-full flex p-auto md:px-auto flex-col items-start gap-3 self-stretch hover:bg-primary-softPink-100 {small
			? 'border-primary-softPink-50 border-2 rounded-full justify-center '
			: 'border-grey-300 border-2  '} hover:border-primary-red border-dashed"
	>
		{#if isFileInput}
			<input
				bind:files={$uploadState.images}
				on:change={handleFileChange}
				name={fileInputName}
				type="file"
				id={inputName}
				{multiple}
				accept="image/*"
				class="w-full cursor-pointer h-full absolute top-0 left-0 opacity-0 z-10"
			/>
		{/if}
		<div
			on:click={() => mediaState.update((state) => ({ ...state, isOpen: true }))}
			class="upload-box-info h-[200px] w-full flex {small
				? 'flex-row items-center justify-center '
				: 'flex-col justify-center'} {$uploadState.previewImage
				? 'px-0'
				: 'px-3'}  items-center gap-2"
		>
			{#if $uploadState.previewImage}
				<section
					class="w-full h-full absolute {small
						? 'flex items-center justify-center top-0 left-0'
						: ''}"
				>
					{#if small}
						<Avatar.Root class="w-14 h-14">
							<Avatar.Image src={$uploadState.previewImage} class="w-full h-full object-cover"
							></Avatar.Image>

							<Avatar.Fallback>IM</Avatar.Fallback>
						</Avatar.Root>
					{:else}
						<div class=" h-full w-full relative top-0">
							<img
								src={$uploadState.previewImage}
								alt=""
								style="aspect-ratio: 1/1"
								class="w-full h-full object-cover pointer-events-none {small && 'rounded-full'}"
							/>
							<!-- {#if multiple && files.length > 1}
								<section
									class="w-full z-30 bg-[#818080a6] absolute bottom-0 py-1 px-3 flex gap-2 items-center"
								>
									{#each files as image}
										<button type="button" class="h-10 w-12" on:click={() => setPreview(image)}>
											<img src={image.image} alt="" class="h-full w-full object-cover" />
										</button>
									{/each}
								</section>
							{/if} -->
						</div>
					{/if}
				</section>
			{/if}
			{#if !$uploadState.previewImage}
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
					max-w-[70%] text-grey-100 text-xs {$uploadState.previewImage
						? 'hidden'
						: 'block'} font-satoshi text-center text-clip"
				>
					Drop your image here or click here to upload
				</span>
			{/if}
		</div>
	</div>

	<!-- {#if error}
		<sub
			transition:slide={{ delay: 250, duration: 300 }}
			class="text-rose-500 text-xs tracking-[-0.0075rem]">{error}</sub
		>
	{/if} -->

	{#each $uploadState.files as file}
		<input type="text" class="hidden" bind:value={file.id} name={inputName} />
	{/each}
</div>
