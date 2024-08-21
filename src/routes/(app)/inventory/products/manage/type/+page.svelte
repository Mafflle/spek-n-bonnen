<script lang="ts">
	import { enhance } from '$app/forms';
	import DataType from '$lib/components/customs/DataTypeInput.svelte';
	import InfoModal from '$lib/components/InfoModal.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { BatchAttr } from '$lib/stores/product.stores';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { slide } from 'svelte/transition';

	const submit: SubmitFunction = ({ formData }) => {
		loading = true;
		let batch_attributes = formData.get('batch_attributes');

		if (typeof batch_attributes === 'string') {
			// Parse the JSON string back into an array of BatchAttr objects
			batch_attributes = JSON.parse(batch_attributes);

			// Filter out empty attributes
			batch_attributes = (batch_attributes as BatchAttr[]).filter(
				(attr) => attr.name.trim() !== '' && attr.data_type !== null
			);

			// Update the form data with the filtered attributes
			formData.set('batch_attributes', JSON.stringify(batch_attributes));
		}

		console.log(batchAttributes);

		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					showInfo = true;
					batchAttributes = {
						1: {
							name: '',
							is_required: false,
							data_type: 'text'
						}
					};
				} else if (result.status === 400) {
					// console.log(result);

					validationErrors = result.data;
				}
			} finally {
				update();
				loading = false;
			}
		};
	};

	let nextAttributeId = 1;
	let loading: boolean = false;
	let showInfo = false;
	let batchAttributes: { [key: string | number]: BatchAttr } = {
		1: {
			id: 1,
			name: '',
			is_required: false,
			data_type: 'text'
		}
	};
	let validationErrors: { name?: [string]; batch_attributes?: [string] };

	function handleCreateNew(event: CustomEvent<BatchAttr>) {
		const { id, ...rest } = event.detail;

		batchAttributes = {
			...batchAttributes,
			[id]: rest
		};

		nextAttributeId++;
		const lastAttribute =
			batchAttributes[Object.keys(batchAttributes)[Object.keys(batchAttributes).length - 1]];

		if (lastAttribute.name && lastAttribute.data_type) {
			batchAttributes[nextAttributeId] = {
				name: '',
				is_required: false,
				data_type: 'text'
			};
		}
	}

	function handleUpdateAttribute(event: CustomEvent<{ id: string | number } & BatchAttr>) {
		const { id, ...rest } = event.detail;
		batchAttributes[id] = rest;
		batchAttributes = { ...batchAttributes };
	}

	function handleDeleteAttribute(event: CustomEvent<string | number>) {
		const attributeIdToDelete = event.detail;
		delete batchAttributes[attributeIdToDelete];
		batchAttributes = { ...batchAttributes }; // Trigger re-render
	}
</script>

<div class="w-full grid gap-6">
	<div class="headers flex flex-col items-start gap-[0.25rem] mb-10">
		<h2 class="text-[2em] tracking-[2] font-satoshi font-bold">Create products type</h2>
		<sub class="text-[#6B6B6B] text-sm font-medium">
			Inventory / Products / Create product type</sub
		>
		<Separator class="absolute max-w-full left-0 top-32" />
	</div>

	<form
		use:enhance={submit}
		action="?/manage_type"
		method="post"
		class="relative flex h-full items-center w-full flex-col gap-16 justify-center"
	>
		<section class="flex items-center w-full flex-col gap-4">
			<h4 class="w-full text-start text-2xl font-medium">Product Type Name</h4>
			<div class="form-group max-w-lg w-full">
				<label for="name" class="font-satoshi text-sm font-medium mb-1">Name</label>
				<input
					type="text"
					name="name"
					id="name"
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
		</section>
		<section class="flex items-center w-full flex-col gap-2">
			<h4 class="w-full text-start text-2xl font-medium">Attributes</h4>
			<div class="flex items-center w-full flex-col gap-4">
				{#each Object.entries(batchAttributes) as [attributeId, batchAttribute]}
					<DataType
						on:createNew={(e) => handleCreateNew(e)}
						on:delete={handleDeleteAttribute}
						on:updateAttribute={handleUpdateAttribute}
						{attributeId}
						bind:data={batchAttribute}
						showCreate={attributeId ===
							Object.keys(batchAttributes)[Object.keys(batchAttributes).length - 1]}
						deleteEnabled={Object.keys(batchAttributes).length > 1}
					/>
				{/each}
				<input
					type="hidden"
					name="batch_attributes"
					value={JSON.stringify(Object.values(batchAttributes))}
				/>
			</div>
		</section>
		<section class="flex justify-end w-full bg-white">
			<Button
				type="submit"
				class="flex  bg-primary-red gap-2 items-center font-satoshi text-sm font-bold text-white py-2.5 px-3 rounded-md hover:bg-primary-100"
			>
				{#if loading}
					<iconify-icon width="35" icon="eos-icons:three-dots-loading"></iconify-icon>
				{:else}
					<span class="button-text">Create product type </span>
				{/if}
			</Button>
		</section>
	</form>
</div>

<InfoModal
	href="/inventory/products"
	image="/icons/Success.svg"
	{showInfo}
	title="Product type has been created successfully"
	description={`You can now proceed to add your product to the inventory. Click "Create Product" to continue`}
/>
