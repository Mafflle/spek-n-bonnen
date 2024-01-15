<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button } from './ui/button';
	import { Input } from './ui/input';
	import { Label } from './ui/label';
	import * as Popover from './ui/popover';
	import { showToast } from '$lib/utils';
	import { enhance } from '$app/forms';
	import { Roles } from '$lib/stores';

	export let name: string;
	export let id: number;
	export let permissions: { codename: string; content_type: number; id: number; name: string }[];

	let loading: boolean = false;

	const deleteRole: SubmitFunction = () => {
		loading = true;
		return async ({ result, update }) => {
			try {
				if (result.status == 200) {
					Roles.update((roles) => roles.filter((role) => role.id !== id));
					showToast('Role deleted successfully', 'success');
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

<tr class="border-b border-[#D9D9D9] table-row">
	<td class="table-cell">
		<div class="  flex">
			<span class=" text-[#6B6B6B] text-sm font-medium">
				{id}
			</span>
		</div>
	</td>
	<td class="table-cell">
		<!-- <div class=" px-2 py-1 bg-stone-50 rounded-[20px] flex items-center justify-center w-full"> -->
		<span class=" text-right text-[#6B6B6B] text-[13px] font-medium">
			{name}
		</span>
		<!-- </div> -->
	</td>
	<td class="text-[#9C9C9C] flex gap-1 items-center">
		{#each permissions.slice(0, 2) as permission}
			<div class="px-2 py-1 bg-stone-50 rounded-[20px] justify-start items-center text-[#6B6B6B]">
				{permission.codename}
			</div>
		{/each}
		<p
			class="w-7 h-7 text-black-100 rounded-full bg-secondary-50 {permissions.length - 2 !== 0
				? 'flex'
				: 'hidden'}  justify-center items-center"
		>
			<span>+</span> <span>{permissions.length - 2}</span>
		</p>
	</td>
	<td class="table-cell">
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
							use:enhance={deleteRole}
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
