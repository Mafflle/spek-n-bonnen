<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button } from './ui/button';
	import * as DropdownMenu from './ui/dropdown-menu';
	import { Brands, type Brand } from '$lib/stores';
	import { showToast } from '$lib/utils';
	import { enhance } from '$app/forms';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { createEventDispatcher, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import PageLoader from './PageLoader.svelte';
	dayjs.extend(relativeTime);

	export let grid: boolean;
	export let id: number;
	export let brand: Brand;
	let loading: boolean = false;

	const deleteBrand: SubmitFunction = async ({ formData }) => {
		loading = true;
		formData.append('id', `${id}`);
		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					Brands.update((brands) => brands.filter((brand) => brand.id !== id));
					showToast('Brand deleted successfully', 'success');
				} else {
					showToast('Ooops something went wrong', 'error');
				}
			} finally {
				update();
				loading = false;
			}
		};
	};

	const dispatch = createEventDispatcher();
	const editBrand = (brand: Brand) => {
		dispatch('edit', brand);
	};

	onMount(() => {
		const storedGridPreference = localStorage.getItem('gridPreference');
		grid = storedGridPreference ? JSON.parse(storedGridPreference) : false;
	});
</script>

{#if loading}
	<PageLoader />
{/if}

{#if grid}
	<div
		class="w-full brand flex flex-col items-start gap-3 pb-2 rounded-t-xl border-[0.5px] border-grey-300"
	>
		<div class="brand-image h-36 w-full bg-[#f9f9f9]">
			<img
				src={brand.logo.image}
				class="w-full h-full object-cover rounded-t-md"
				alt={brand.logo.title}
			/>
		</div>
		<div class="brand-info flex w-full py-2 px-3 flex-col items-start gap-2 flex-[1 0 0]">
			<div class="brand-name text-base font-medium line-clamp-1">
				{brand.name}
			</div>
			<section class="flex w-full items-center justify-between">
				<div class="date-added flex items-center gap-2 self-stretch">
					<div class="date-icon">
						<img src="/icons/clock.svg" alt="clock icon" />
					</div>
					<div class="date text-xs text-wrap line-clamp-1">
						Added {dayjs(brand.updated_at).fromNow()}
					</div>
				</div>
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
								on:click={() => editBrand(brand)}
								class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
							>
								<img src="/icons/edit.svg" alt="edit icon" />
								<span class="text-grey-100">Edit</span>
							</Button>
						</DropdownMenu.Item>
						<form action="?/delete" method="post" use:enhance={deleteBrand} class="">
							<!-- <input type="text" class="hidden" bind:value={id} name="id" /> -->
							<DropdownMenu.Item>
								<Button
									class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
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
							</DropdownMenu.Item>
						</form>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</section>
		</div>
	</div>
{:else}
	<tr class="border-b border-[#D9D9D9]">
		<td>
			<div class="   justify-start items-center gap-3 inline-flex">
				<div class="w-[38px] h-[38px] bg-neutral-100 rounded-full">
					<img
						src={brand.logo.image}
						class="w-full h-full object-cover rounded-full"
						alt={brand.logo.title}
					/>
				</div>
				<span class="grow shrink basis-0 text-[#6B6B6B] text-sm font-medium line-clamp-1">
					{brand.name}
				</span>
			</div>
		</td>
		<td class="text-[#9C9C9C]"
			><span class="line-clamp-1">{dayjs(brand.updated_at).fromNow()}</span></td
		>
		<td class="table-cell">
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
							on:click={() => editBrand(brand)}
							class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
						>
							<img src="/icons/edit.svg" alt="edit icon" />
							<span class="text-grey-100">Edit</span>
						</Button>
					</DropdownMenu.Item>
					<form action="?/delete" method="post" use:enhance={deleteBrand} class="">
						<!-- <input type="text" class="hidden" bind:value={id} name="id" /> -->
						<DropdownMenu.Item>
							<Button
								class="text-sm font-satoshi -tracking-[0.14px]  flex items-center justify-start py-1 h-auto rounded gap-2"
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
						</DropdownMenu.Item>
					</form>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</td>
	</tr>
{/if}
