<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button } from './ui/button';
	import * as Dialog from './ui/dialog';
	import { Separator } from './ui/separator';
	export let toggleDelete: () => void;
	export let deleteItem: SubmitFunction;
	export let showDeleteModal: boolean = false;
	export let id;
	export let mainNameForHeader: string = 'Item';
	export let mainNameForSub: string = '[Brand, Vendor, etc]';
	export let isDeleting: boolean = false;
	export let endPoint: string;
</script>

<Dialog.Root onOutsideClick={toggleDelete} bind:open={showDeleteModal} onOpenChange={toggleDelete}>
	<Dialog.Content>
		<div class="w-[500px]">
			<Dialog.Header class="py-5">
				<Dialog.Title class="text-sm font-medium px-3 mb-2 flex justify-between items-center">
					<span>Confirm Request</span>
					<button
						on:click={toggleDelete}
						class="rounded-full border-[#E0E0E0] bg-[#F2F2F2] p-0.5 border-2"
					>
						<img src="/icons/close.svg" class="w-full h-full object-cover" alt="Close icon" />
					</button>
				</Dialog.Title>
				<Separator class="my-8 md:block hidden" />

				<Dialog.Description class="pt-8 px-3  gap-3 flex flex-col items-center justify-center">
					<div class="w-full mb-3 flex justify-center">
						<img src="/icons/warning-2.svg" alt="A warning icon" />
					</div>
					<h3 class="text-primary-red text-2xl font-medium font-[poppins]">
						Delete {mainNameForHeader}
					</h3>
					<span class="text-center max-w-[280px] text-clip">
						This action means this {mainNameForSub} will be permanently removed.
					</span>
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer class="pb-6 mt-3">
				<form
					class="w-full flex justify-center"
					action="?/{endPoint}"
					use:enhance={deleteItem}
					method="post"
				>
					<input type="text" class="hidden" bind:value={id} name="id" />

					<Button
						class="bg-primary-red w-full max-w-[70%] border flex items-center gap-2 py-2"
						type="submit"
						disabled={isDeleting}
					>
						{#if isDeleting}
							<iconify-icon width="25" icon="eos-icons:three-dots-loading"></iconify-icon>
						{:else}
							<span> Delete </span>
							<iconify-icon icon="grommet-icons:link-next"></iconify-icon>
						{/if}
					</Button>
				</form>
			</Dialog.Footer>
		</div>
	</Dialog.Content>
</Dialog.Root>
