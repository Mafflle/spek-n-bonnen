<script lang="ts">
	import { enhance } from '$app/forms';
	import { showToast } from '$lib/utils';
	import type { SubmitFunction } from '@sveltejs/kit';
	import dayjs from 'dayjs';
	import { slide } from 'svelte/transition';
	import UploadBox from '$lib/components/UploadBox.svelte';
	import { Button } from '$lib/components/ui/button';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import { currentSupplier, Suppliers } from '$lib/stores/suppliers.stores';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let isProcessingProvider = false;
	let validationErrors: {
		company_name?: [string];
		contact_person?: [string];
		email?: [string];
		address?: [string];
		phone?: [string];
		logo_id?: string;
	};
	let currProviderName: string = '';
	let currentSupplierAddress: string = '';
	let currProviderNumber: string = '';
	let currSupplierContact: string = '';
	let currSupplierEmail = '';

	$: if ($currentSupplier) {
		currProviderName = $currentSupplier.company_name;
		currentSupplierAddress = $currentSupplier.address;
		currSupplierContact = $currentSupplier.contact_person;
		currSupplierEmail = $currentSupplier.email;
		currProviderNumber = $currentSupplier.phone;
	}

	const submit: SubmitFunction = async ({ formData }) => {
		isProcessingProvider = true;

		if ($currentSupplier?.id) {
			formData.append('id', `${$currentSupplier.id}`);
			formData.append('logo', `${$currentSupplier.logo?.id}`);
		}

		return async ({ update, result }) => {
			try {
				if (result.status === 200) {
					if (result.data.edited) {
						const editedProvider = result.data.editedProvider;
						$Suppliers = $Suppliers.map((provider) => {
							if (provider.id === editedProvider.id) {
								provider = editedProvider;
							}
							return provider;
						});
						showToast('Provider edited successfully', 'success');
					} else {
						const newProvider = result.data.newProvider;
						$Suppliers = [newProvider, ...$Suppliers];
						showToast('Provider added successfully', 'success');
					}
					dispatch('close');
				} else if (result.status === 400) {
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

<form
	enctype="multipart/form-data"
	use:enhance={submit}
	method="post"
	action="?/manage-providers"
	class="flex flex-col gap-8 pb-6 justify-between md:pb-4 w-full h-full overflow-y-scroll no-scrollbar rounded-2xl items-center"
>
	<section class="w-full">
		<div class="flex md:sticky top-0 z-10 items-center justify-between mb-5">
			<Sheet.Header class="flex flex-col w-full gap-2 md:sticky pt-4 top-0 bg-white z-30">
				<div class="w-full px-3 flex flex-row justify-between items-center">
					<Sheet.Title
						class="flex items-center gap-2 text-primary-50 font-poppins font-semibold text-lg mr-auto"
					>
						<img src="/icons/UserWithEclipse.svg" alt="user icon" />
						<span>{$currentSupplier ? 'Edit' : 'Add'} Supplier</span>
					</Sheet.Title>
					<button
						type="button"
						on:click={() => dispatch('close')}
						class="bg-[#F2F2F2] border border-[#E0E0E0] flex items-center rounded-full p-0.5"
					>
						<img src="/icons/close.svg" alt="close icon" />
					</button>
				</div>
				<Separator />
			</Sheet.Header>
		</div>
		<div class="w-full items-start flex flex-col px-3 mt-8 gap-8 mb-8">
			<span class="font-satoshi text-sm"
				>Kindly fill the form below with the appropriate information</span
			>

			<div class="flex flex-col gap-4 px-4 w-full">
				<div class="form-group w-full">
					<label for="logo" class="font-satoshi text-sm font-medium mb-5">Add logo</label>

					<UploadBox
						defaultValue={$currentSupplier?.logo}
						inputName="logo"
						error={validationErrors?.logo}
						small={true}
						smallText="Upload provider img"
					/>
				</div>

				<div class="form-group w-full">
					<label for="company_name" class="font-satoshi text-sm font-medium mb-1"
						>Company name</label
					>
					<input
						type="text"
						name="company_name"
						id="company_name"
						value={currProviderName}
						placeholder="Enter name"
						class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.company_name}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]"
							>{validationErrors.company_name}</sub
						>
					{/if}
				</div>
				<div class="form-group w-full">
					<label for="contact_person" class="font-satoshi text-sm font-medium mb-1"
						>Contact name</label
					>
					<input
						type="text"
						name="contact_person"
						id="contact_person"
						value={currSupplierContact}
						placeholder="Enter contact name"
						class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.contact_person}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]"
							>{validationErrors.contact_person}</sub
						>
					{/if}
				</div>
				<div class="form-group w-full">
					<label for="email" class="font-satoshi text-sm font-medium mb-1">Email</label>
					<input
						type="text"
						name="email"
						id="email"
						value={currSupplierEmail}
						placeholder="Enter email"
						class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.email}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
						>
					{/if}
				</div>
				<div class="form-group w-full">
					<label for="address" class="font-satoshi text-sm font-medium mb-1">Address</label>
					<input
						type="text"
						name="address"
						id="address"
						value={currentSupplierAddress}
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
					<label for="phone" class="font-satoshi text-sm font-medium mb-1">Phone</label>
					<input
						type="text"
						name="phone"
						id="phone"
						value={currProviderNumber}
						placeholder="Enter phone number"
						class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.phone}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.phone}</sub
						>
					{/if}
				</div>

				{#if $currentSupplier}
					<div class="form-group w-full">
						<span class="font-satoshi text-sm font-medium mb-2">Date Added</span>
						<p>{dayjs($currentSupplier?.created_at).format('DD/MM/YYYY')}</p>
					</div>
				{/if}
			</div>
		</div>
		<Sheet.Footer class="w-full px-3 self-end ">
			<div class="w-full px-4">
				<Button
					disabled={isProcessingProvider}
					type="submit"
					class="flex w-full bg-primary-red gap-2 items-center font-satoshi text-sm font-bold text-white py-2.5 px-3 rounded-md hover:bg-primary-100"
				>
					{#if isProcessingProvider}
						<iconify-icon width="25" icon="eos-icons:three-dots-loading"></iconify-icon>
					{:else if $currentSupplier}
						<span>Update</span>
					{:else}
						<span> Proceed </span>

						<iconify-icon icon="ep:right" width="15"></iconify-icon>
					{/if}
				</Button>
			</div>
		</Sheet.Footer>
	</section>
</form>
