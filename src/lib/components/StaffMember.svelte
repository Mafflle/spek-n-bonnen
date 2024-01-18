<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button } from './ui/button';
	import * as Popover from './ui/popover';
	import { showToast } from '$lib/utils';
	import { Users } from '$lib/stores';

	export let name: string;
	export let role: string;
	export let email: string;
	export let permissions: string;
	export let id: number;

	let loading: boolean = false;

	const deleteBrand: SubmitFunction = () => {
		loading = true;
		return async ({ result, update }) => {
			try {
				if (result.status == 200) {
					Users.update((users) => users.filter((user) => user.id !== id));
					showToast('User deleted successfully', 'success');
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

<tr class="border-b border-[#D9D9D9]">
	<td>
		<div class="   justify-start items-center gap-3 inline-flex">
			<div class="w-[38px] h-[38px] bg-neutral-100 rounded-full"></div>
			<span class="grow shrink basis-0 text-[#6B6B6B] text-sm font-medium">
				{name}
			</span>
		</div>
	</td>
	<td>
		<div
			class="w-[124px] h-6 px-1 bg-stone-50 rounded-[20px] justify-start items-center gap-2.5 inline-flex"
		>
			<span class="grow shrink basis-0 text-center text-[#6B6B6B] text-[13px] font-medium">
				{role}
			</span>
		</div>
	</td>
	<td class="text-[#9C9C9C]">{email}</td>
	<td class="text-[#9C9C9C]">{permissions}</td>
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
							<Button disabled variant="destructive" type="submit"
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
