<script lang="ts">
	import Dropzone from 'svelte-file-dropzone/Dropzone.svelte';

	let files = {
		accepted: [],
		rejected: []
	};

	function handleFilesSelect(e) {
		const { acceptedFiles, fileRejections } = e.detail;
		files.accepted = [...files.accepted, ...acceptedFiles];
		files.rejected = [...files.rejected, ...fileRejections];
		console.log(files);
	}

	let inputElement: any; // reference to the input element
</script>

<Dropzone {inputElement} accept="image/*" on:drop={handleFilesSelect}>
	<div
		class="w-full rounded-xl flex py-8 px-24 flex-col items-start gap-3 self-stretch border border-grey-300 border-dashed"
	>
		<div class="upload-box-info w-full flex flex-col justify-center items-center gap-4">
			<div class="image w-14 h-14 rounded-full flex justify-center items-center bg-[#f5f5f5]">
				<img src="/icons/regular-image.svg" alt="reguar icon" />
			</div>
			<div class="text text-center text-sm leading-5 tracking-[-0.13px] text-[#CDCDCD]">
				Drag and drop file or click <b class="text-primary-softPink">upload</b> from your computer
			</div>
		</div>
	</div>
</Dropzone>
