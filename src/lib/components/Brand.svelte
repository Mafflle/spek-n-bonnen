<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button } from './ui/button';
	import * as Popover from './ui/popover';
	import { Brands } from '$lib/stores';
	import { showToast } from '$lib/utils';
	import { enhance } from '$app/forms';

	export let name: string;
	export let date: string;
	export let grid: boolean;
	export let id: number;
	let loading: boolean = false;

	const deleteBrand: SubmitFunction = () => {
		loading = true;
		return async ({ result, update }) => {
			try {
				if (result.status == 200) {
					Brands.update((brands) => brands.filter((brand) => brand.id !== id));
					showToast('Brand deleted successfully', 'success');
				} else {
					showToast('Ooops something went wrong', 'error');
				}
			} finally {
				loading = false;
				update();
			}
		};
	};
</script>

{#if grid}
	<div
		class="w-full brand flex flex-col items-start gap-3 pb-2 rounded-t-xl border-[0.5px] border-grey-300"
	>
		<div class="brand-image h-32 self-stretch rounded-t-xl bg-[#f9f9f9]"></div>
		<div class="brand-info flex w-full py-2 px-3 flex-col items-start gap-2 flex-[1 0 0]">
			<div class="brand-name text-base font-medium">
				{name}
			</div>
			<div class="date-added flex items-center gap-2 self-stretch">
				<div class="date-icon">
					<img src="/icons/clock.svg" alt="clock icon" />
				</div>
				<div class="date text-xs flex-[1 0 0]">
					Added {date} months ago
				</div>
			</div>
		</div>
	</div>
{:else}
	<tr class="border-b border-[#D9D9D9]">
		<td>
			<div class="   justify-start items-center gap-3 inline-flex">
				<div class="w-[38px] h-[38px] bg-neutral-100 rounded-full"></div>
				<span class="grow shrink basis-0 text-[#6B6B6B] text-sm font-medium">
					{name}
				</span>
			</div>
		</td>
		<td class="text-[#9C9C9C]">{date}</td>
		<td>
			<Popover.Root>
				<!-- <button class=" px-1.5 flex justify-center items-center">
				<iconify-icon icon="pepicons-pencil:dots-y" style="color: #6b6b6b;" width="30"></iconify-icon>
			</button> -->

				<Popover.Trigger asChild let:builder>
					<Button builders={[builder]} class=" px-1.5 flex justify-center items-center">
						<iconify-icon icon="pepicons-pencil:dots-y" style="color: #6b6b6b;" width="30"
						></iconify-icon></Button
					>
				</Popover.Trigger>
				<Popover.Content>
					<div class="grid gap-6">
						<div class="space-y-2">
							<h4 class="font-medium leading-none">Actions</h4>
							<!-- <p class="text-sm text-muted-foreground">Update, </p> -->
						</div>
						<div class="grid grid-cols-2 gap-3">
							<form class="grid items-center gap-4">
								<Button variant="secondary">Edit</Button>
							</form>
							<form
								action="?/delete"
								method="post"
								use:enhance={deleteBrand}
								class="grid items-center gap-4"
							>
								<input type="text" class="hidden" bind:value={id} name="id" />
								<Button variant="destructive" type="submit"
									>{#if loading}
										<iconify-icon width="20" icon="eos-icons:three-dots-loading"></iconify-icon>
									{:else}
										<span class="button-text">Delete </span>
									{/if}</Button
								>
							</form>
						</div>
					</div>
				</Popover.Content>
			</Popover.Root>
		</td>
	</tr>
{/if}
