<script lang="ts">
	import { Button } from './ui/button';
	import * as DropdownMenu from './ui/dropdown-menu';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { User } from '$lib/user';
	import dayjs from 'dayjs';

	export let user: User;

	let loading: boolean = false;
</script>

<Table.Row class="border-b border-[#D9D9D9]">
	<Table.Cell>
		<div class="   justify-start items-center gap-3 inline-flex">
			<span class="grow shrink basis-0 text-[#6B6B6B] text-sm font-medium line-clamp-1">
				{user?.staff_profile.first_name}
				{user?.staff_profile.last_name}
			</span>
		</div>
	</Table.Cell>
	<Table.Cell class="text-[#9C9C9C]">{user.email}</Table.Cell>
	<Table.Cell>
		<div
			class="w-[124px] h-6 px-1 bg-stone-50 rounded-[20px] justify-start items-center gap-2.5 inline-flex"
		>
			<span
				class="grow shrink basis-0 text-center {user?.groups[0]?.name ??
					'italic text-grey-200'} text-[#6B6B6B] text-[13px] font-medium"
			>
				{user?.groups[0]?.name ?? 'No roles assigned'}
			</span>
		</div>
	</Table.Cell>
	<Table.Cell class="text-[#9C9C9C]">
		<span class="min-w-max">
			{dayjs(user.date_joined).format('DD MMM YYYY')}
		</span>
	</Table.Cell>
	<Table.Cell class="text-[#9C9C9C]">
		<span
			class="font-satoshi font-medium {user.is_active ? 'text-active-green' : 'text-primary-50'}"
		>
			{user.is_active ? 'Active' : 'Inactive'}
		</span>
	</Table.Cell>
	<Table.Cell>
		<DropdownMenu.Root>
			<!-- <button class=" px-1.5 flex justify-center items-center">
					<iconify-icon icon="pepicons-pencil:dots-y" style="color: #6b6b6b;" width="30"></iconify-icon>
				</button> -->

			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} class=" p-0 flex justify-center items-center">
					<iconify-icon icon="pepicons-pencil:dots-y" style="color: #6b6b6b;" width="30"
					></iconify-icon></Button
				>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="py-3 px-1 flex flex-col justify-start	">
				<DropdownMenu.Item>
					<Button
						href="staffs/{user?.id}"
						class="text-xs font-satoshi text-grey-100 -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
					>
						<iconify-icon width="17" icon="ph:eye-light"></iconify-icon>
						<span class="text-grey-100">View</span>
					</Button>
				</DropdownMenu.Item>
				<!-- <input type="text" class="hidden" bind:value={id} name="id" /> -->
				<DropdownMenu.Item>
					<form action="?/delete" method="post" class="">
						<Button
							class="text-xs font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
							type="submit"
							>{#if loading}
								<iconify-icon
									class="text-primary-red"
									width="20"
									icon="eos-icons:three-dots-loading"
								></iconify-icon>
							{:else}
								<img src="/icons/trash.svg" alt="trash icon" />
								<span class="button-text text-primary-red">Delete </span>
							{/if}</Button
						>
					</form>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Table.Cell>
</Table.Row>
