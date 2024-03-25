<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import ProviderCard from '$lib/components/ProviderCard.svelte';
	import Selector from '$lib/components/Selector.svelte';
	import UploadBox from '$lib/components/UploadBox.svelte';
	import { Button } from '$lib/components/ui/button';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import {
		ProviderType,
		Providers,
		currentProvider,
		type Provider
	} from '$lib/stores/providers.stores';
	import { showToast } from '$lib/utils';
	import type { SubmitFunction } from '@sveltejs/kit';
	import dayjs from 'dayjs';
	import { slide } from 'svelte/transition';
	export let data;

	let { allProviders } = data;
	$Providers = allProviders.results;

	$: console.log($Providers);

	const providerTypes = [
		{ value: ProviderType.Brand, label: 'Brand' },
		{ value: ProviderType.Vendor, label: 'Vendor' },
		{ value: ProviderType.ButcherShop, label: 'ButcherShop' },
		{ value: ProviderType.Farm, label: 'Farm' },
		{ value: ProviderType.Manufacturer, label: 'Manufacturer' },
		{ value: ProviderType.SlaughterHouse, label: 'SlaughterHouse' }
	];
	let showProviderModal = false;
	let isProcessingProvider = false;
	let validationErrors: {
		name?: [string];
		type?: [string];
		address?: [string];
		phone_number?: [string];
		image_id?: string;
	};
	let currProviderName: string = '';
	let currentProviderAddress: string = '';
	let currProviderNumber: string = '';

	function toggleEditModal(param?: Provider) {
		if (param) {
			$currentProvider = param;
			currProviderName = $currentProvider.name;
			currProviderNumber = $currentProvider.phone_number;
			currentProviderAddress = $currentProvider.address;
		} else {
			$currentProvider = null;
			currProviderName = '';
			currProviderNumber = '';
			currentProviderAddress = '';
		}

		toggleModal();
	}
	function toggleModal() {
		showProviderModal = !showProviderModal;
	}
	const submit: SubmitFunction = async ({ formData }) => {
		isProcessingProvider = true;

		if ($currentProvider?.slug) {
			formData.append('slug', `${$currentProvider.slug}`);
			formData.append('image', `${$currentProvider.image}`);
		}

		return async ({ update, result }) => {
			try {
				if (result.status === 200) {
					if (result.data.edited) {
						const editedProvider = result.data.editedProvider;
						$Providers = $Providers.map((provider) => {
							if (provider.id === editedProvider.id) {
								provider = editedProvider;
							}
							return provider;
						});
						showToast('Provider edited successfully', 'success');
					} else {
						const newProvider = result.data.newProvider;
						$Providers = [newProvider, ...$Providers];
						showToast('Provider added successfully', 'success');
					}
					toggleEditModal();
				} else if (result.status === 400) {
					console.log(result.data);

					validationErrors = result.data.errors;
					showToast('Validation errors', 'error');
				}
			} finally {
				update();
				isProcessingProvider = false;
			}
		};
	};
</script>

<svelte:head>
	<title>{$currentProvider ? `Edit ${$currentProvider.slug}` : 'Provider'} - Spek-n-Boonen</title>
</svelte:head>

{#if $Providers.length < 1}
	<div class="empty h-full w-full flex justify-center items-center">
		<div class="empty-indicator flex flex-col justify-center items-center gap-5 w-[277px]">
			<div class="icon">
				<img src="/icons/empty-Illustration.svg" alt="empty illustration " />
			</div>
			<div class="content">
				<div class="text flex flex-col gap-3 justify-center items-center text-grey-300">
					<h3 class="title text-3xl font-medium tracking-[-0.64px]">No Provider added</h3>
					<div class="info text-center text-sm font-medium leading-5 tracking-[-0.13px]">
						You currently don’t have any provider saved, click the button below to create one
					</div>
				</div>
			</div>
			<div class="button">
				<button
					on:click={toggleModal}
					class=" px-2.5 py-2.5 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
			hover:bg-[#C7453C]
			focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/plus.svg" alt="user-plus" />
					</div>
					<p class="text-white text-sm font-bold">Add provider</p>
				</button>
			</div>
		</div>
	</div>
{:else}
	<div class="page h-full w-full">
		<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
			<div class="headers flex flex-col items-start gap-[0.25rem]">
				<div class="text-[2rem] tracking-[-0.04rem] font-bold">Providers</div>
				<sub class="text-[#6B6B6B] text-sm"> Inventory / Providers / Manage</sub>
			</div>
			<div class="filters flex items-center w-full justify-between">
				<div
					class="flex items-center md:w-[24em] border gap-2 rounded-md border-[#D9D9D9] text-[#232222] px-2"
				>
					<span>
						<svg
							width="24"
							height="24"
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
					<input type="text" placeholder="Search...." class=" py-2 flex-auto outline-none" />
				</div>
				<button
					on:click={toggleModal}
					class=" px-2.5 py-2.5 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
			hover:bg-[#C7453C]
			focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/plus.svg" alt="user-plus" />
					</div>
					<p class="text-white text-sm font-bold">Add provider</p>
				</button>
			</div>
		</div>
		<!-- render if page is empty -->

		<!-- If grid is true, render the table -->
		<div class="border rounded-xl">
			<table class="table">
				<thead>
					<tr class="font-satoshi font-medium text-grey-200">
						<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">Provider Name</th>
						<th class="bg-[#F9F9F9]">Address</th>

						<th class="bg-[#F9F9F9]">Type</th>
						<th class="bg-[#F9F9F9]">Date</th>
						<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></th>
					</tr>
				</thead>

				<tbody>
					{#each $Providers as provider}
						<ProviderCard on:edit={(e) => toggleEditModal(e.detail)} {provider} />
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}

<Modal showModal={showProviderModal} on:close={() => toggleEditModal()} mode="sheet">
	<form
		use:enhance={submit}
		method="post"
		action="?/manage-providers"
		slot="modal-content"
		class="flex flex-col md:gap-16 justify-between md:pb-4 w-full max-h-full overflow-y-scroll no-scrollbar rounded-2xl items-center"
	>
		<section class="h-screen">
			<Sheet.Header class="flex flex-col w-full gap-2 py-4 sticky top-0 bg-white z-30 ">
				<div class="w-full px-3 flex flex-row justify-between items-center">
					<Sheet.Title
						class="flex items-center gap-2 text-primary-50 font-poppins font-semibold text-lg mr-auto"
					>
						<img src="/icons/UserWithEclipse.svg" alt="user icon " />
						<span>{$currentProvider ? 'Edit' : 'Add'} Provider</span>
					</Sheet.Title>
					<button
						type="button"
						on:click={() => toggleEditModal()}
						class="bg-[#F2F2F2] border border-[#E0E0E0] flex items-center rounded-full p-0.5"
					>
						<img src="/icons/close.svg" alt="close icon" />
					</button>
				</div>
				<Separator />
			</Sheet.Header>
			<div class="w-full items-start flex flex-col px-3 mt-8 gap-8">
				<span class="font-satoshi text-sm"
					>Kindly fill the form below with the appropriate information</span
				>

				<div class="flex flex-col gap-4 px-4 w-full">
					<UploadBox
						defaultValue={$currentProvider?.image}
						inputName="image_id"
						error={validationErrors?.image_id}
						small={true}
						smallText="Upload provider img"
					/>

					<div class="form-group w-full">
						<label for="name" class="font-satoshi text-sm font-medium mb-1">Provider name</label>
						<input
							type="text"
							name="name"
							id="name"
							bind:value={currProviderName}
							placeholder="Enter name"
							class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
						/>
						{#if validationErrors?.name}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.name}</sub
							>
						{/if}
					</div>
					<div class="form-group w-full">
						<label for="address" class="font-satoshi text-sm font-medium mb-1">Address</label>
						<input
							type="text"
							name="address"
							id="address"
							bind:value={currentProviderAddress}
							placeholder="Enter address"
							class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
						/>
						{#if validationErrors?.address}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.address}</sub
							>
						{/if}
					</div>
					<div class="form-group w-full">
						<label for="phone_number" class="font-satoshi text-sm font-medium mb-1"
							>Phone number</label
						>
						<input
							type="text"
							name="phone_number"
							id="phone_number"
							bind:value={currProviderNumber}
							placeholder="Enter phone number"
							class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
						/>
						{#if validationErrors?.phone_number}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]"
								>{validationErrors.phone_number}</sub
							>
						{/if}
					</div>
					<div class="form-group w-full">
						<label for="provider-type" class="font-satoshi text-sm font-medium mb-2"
							>Provider type</label
						>
						<Selector
							prop={providerTypes[
								providerTypes.findIndex((provider) => $currentProvider?.type === provider.value)
							]}
							options={providerTypes}
							placeholder="Select provider type"
							inputName="type"
						/>
						{#if validationErrors?.type}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.type}</sub
							>
						{/if}
					</div>
					{#if $currentProvider}
						<div class="form-group w-full">
							<span class="font-satoshi text-sm font-medium mb-2">Date Added</span>
							<p>{dayjs($currentProvider?.created_at).format('DD/MM/YYYY')}</p>
						</div>
					{/if}
				</div>
			</div>
		</section>
		<Sheet.Footer class="w-full px-3 self-end">
			<div class="w-full px-4">
				<Button
					disabled={isProcessingProvider}
					type="submit"
					class="flex w-full bg-primary-red gap-2 items-center font-satoshi text-sm font-bold text-white py-2.5 px-3 rounded-md hover:bg-primary-100"
				>
					{#if isProcessingProvider}
						<iconify-icon width="25" icon="eos-icons:three-dots-loading"></iconify-icon>
					{:else if $currentProvider}
						<span>Update</span>
					{:else}
						<span> Proceed </span>

						<iconify-icon icon="ep:right" width="15"></iconify-icon>
					{/if}
				</Button>
			</div>
		</Sheet.Footer>
	</form>
</Modal>

<style>
</style>
