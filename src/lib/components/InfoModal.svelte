<script lang="ts">
	import { Button } from './ui/button';
	import * as Dialog from './ui/dialog';
	import { Separator } from './ui/separator';
</script>

<Dialog.Root open={true}>
	<Dialog.Content>
		<div class="w-[400px] h-fit">
			<Dialog.Header class="py-5">
				<Dialog.Title class="text-sm font-medium px-3 mb-2 flex justify-end items-center">
					<button class="rounded-full border-[#E0E0E0] bg-[#F2F2F2] p-0.5 border-2">
						<img src="/icons/close.svg" class="w-full h-full object-cover" alt="Close icon" />
					</button>
				</Dialog.Title>

				<Dialog.Description class="pt-2 px-3  gap-3 pb-3 flex flex-col items-center justify-center">
					<div class="w-full h-[80px] mb-3.5 flex justify-center">
						<img src="/icons/warning-2.svg" alt="A warning icon" />
					</div>
					<h3 class="text-primary-red text-xl font-medium font-[poppins]">
						No product types available
					</h3>
					<span class="text-center text-sm max-w-[280px] text-[#828282] text-clip">
						Before adding a product to the inventory, you need to create a product type. Click <br
						/>
						"Create" to proceed
					</span>
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer class="pb-6 w-full flex justify-center items-center">
				<div class="flex justify-center items-center w-full">
					<Button
						href="products/manage/type"
						class="bg-primary-red max-w-[85%]  w-full  border flex items-center gap-2 py-2"
					>
						<span>Create </span>
						<iconify-icon icon="ep:right" width="12"></iconify-icon>
					</Button>
				</div>
			</Dialog.Footer>
		</div>
	</Dialog.Content>
</Dialog.Root>
