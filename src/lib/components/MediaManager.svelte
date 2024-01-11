<script lang="ts">
	import Modal from './Modal.svelte';
	import UploadBox from './UploadBox.svelte';
</script>

<div class="max-w-2xl w-[650px] bg-white rounded flex flex-col items-start">
	<section class="flex gap-2 px-3 py-4 items-center w-full shadow">
		<h5 class="text-lg font-satoshi font-bold">Media manager</h5>
	</section>
	<div class="flex">
		<aside class=" bg-grey-300 h-[440px] w-[120px] py-7">
			<ul class="py-4 flex items-center px-4">
				<li class="text-sm text-center"><button class="flex">Gallery</button></li>
			</ul>
		</aside>
		<div class="flex-1 pt-10 pb-4 px-4 flex flex-col gap-8">
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
				<input type="text" placeholder="Type here" class=" py-0.5 flex-auto outline-none" />
			</div>
			<UploadBox allowMultiple={false} inputName="media-editor-image" />
		</div>
	</div>
</div>
