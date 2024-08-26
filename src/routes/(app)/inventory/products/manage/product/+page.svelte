<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LocaleInput from '$lib/components/LocaleInput.svelte';
	import PageLoader from '$lib/components/PageLoader.svelte';
	import UploadBox from '$lib/components/UploadBox.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tabs from '$lib/components/ui/tabs';
	import type { SubmitFunction } from '@sveltejs/kit';

	import { slide } from 'svelte/transition';
	import Selector from '$lib/components/Selector.svelte';

	import Modal from '$lib/components/Modal.svelte';
	import { showToast, type CarcassErrors } from '$lib/utils.js';
	import DeleteModal from '$lib/components/DeleteModal.svelte';

	export let data;

	let { types, allSupplier } = data;

	if (types.results?.length > 0) {
		types = types.results.map((type) => {
			return (type = { label: type.name, value: type.id });
		});
	}

	if (allSupplier.results?.length > 0) {
		allSupplier = allSupplier.results.map((supplier) => {
			return (supplier = { label: supplier.company_name, value: supplier.id });
		});
	}

	// temp for UI
	let carcassToEdit: {
		weight: any;
		cold_weight: any;
		sex_category: string;
		fat_score: string;
		conformation: string;
		lot_number: any;
		carcass_number: any;
		ahdb_code: any;
		ear_tag: any;
		slaughter_house: any;
		date_of_slaughter: any;
		date_received: any;
		lairage_number: any;
		vendor: any;
		vendor_code: any;
		vendor_moq: any;
		vendor_moq_unit: any;
		vendor_item_name: any;
		origin_and_terroir: any;
		country_of_origin: any;
		farm: any;
	};

	let imageValidationError: string;

	let currCarcassId = $page.url.searchParams.get('editing');
	let validationErrors: CarcassErrors;
	const allTabs = ['nutrition', 'traceability', 'finance'];
	let currentTab: string = 'nutrition';
	let currentTabInfo;
	let currTagName: string | undefined;
	let currTag: string | undefined;

	let loading: boolean = false;
	let isProcessingTag: boolean = false;
	let checked: boolean = false;
	let showTagsModal: boolean = false;

	const toggle = () => {
		showTagsModal = !showTagsModal;
	};

	const toggleEditModal = (tagName?, slug?) => {
		if (tagName) {
			currTagName = tagName;
		}

		if (slug) {
			currTag = slug;
		}
		toggle();
	};

	const switchTabs = (direction: string) => {
		const currTab = allTabs.findIndex((item) => item === currentTab);
		if (direction === 'previous') {
			return (currentTab = allTabs[currTab - 1]);
		} else if (direction === 'next') {
			return (currentTab = allTabs[currTab + 1]);
		}
	};

	const manageProduct: SubmitFunction = async ({ formData }) => {
		loading = true;

		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					console.log(result.data);

					if (result.data.edited) {
						const editedProduct = result.data.editedProduct;
						showToast('Product edited successfully', 'success');
					} else {
						const newProduct = result.data.newProduct;
						console.log(newProduct);

						showToast('Product added successfully', 'success');
					}
					await goto('/inventory/products/');
				} else if (result.status === 400) {
					validationErrors = result.data.errors;

					console.log(validationErrors);
				}
			} finally {
				await update({ reset: false });
				loading = false;
			}
		};
	};
	const manageTag: SubmitFunction = async ({ formData }) => {
		isProcessingTag = true;

		if (currTag) {
			formData.append('slug', `${currTag}`);
		}

		return async ({ update, result }) => {
			try {
				if (result.status === 200 && result.data) {
					if (result.data.edited) {
						let editedTag = result.data.editedTag;
						console.log(editedTag);

						const updatedTags = tags.map((tag) => {
							if (tag.value === editedTag.id) {
								tag.label = editedTag.name;
							}
							return tag;
						});

						tags = updatedTags;
						showToast('Tag edited successfully', 'success');
					} else {
						const newTag = result.data.newTag;
						tags = [newTag, ...tags];
						showToast('Tag created successfully', 'success');
					}
					currTag = undefined;
					currTagName = undefined;
					toggle();
				} else if (result.status === 400) {
					validationErrors = result.data.errors;
					showToast('Validation error', 'error');
				} else if (result.status === 500) {
					showToast(`${result.data.errors.server[0]}`, 'error');
				}
			} finally {
				update();
				isProcessingTag = false;
			}
		};
	};

	const validateInputs = (inputs: any[]) => {
		function isValidDate(dateString: string) {
			const regex = /^\d{4}-\d{2}-\d{2}$/;
			return regex.test(dateString);
		}

		console.log(inputs);
		for (const input of inputs) {
			if (!input.value.trim()) {
				return false; // Return false if any required input is empty
			}
			if (input.type === 'date' && !isValidDate(input.value)) {
				return false;
			}
			if (input.type === 'number' && isNaN(input.value)) {
				return false;
			}
		}
		return true;
	};

	let action_shot: number;
	let background_shot: number;
	let closeup_shot: number;
	let lifestyle_shot: number;

	let showDeleteModal: boolean = false;
	let isDeleting: boolean = false;
	let itemId;
	function toggleDelete() {
		showDeleteModal = !showDeleteModal;
	}
	const deleteTag: SubmitFunction = ({ formData }) => {
		isDeleting = true;

		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					tags = tags.filter((tag) => tag.slug !== itemId);
					itemId = undefined;
					showToast('Tag deleted successfully', 'success');
					toggleDelete();
				} else {
					showToast('Ooops something went wrong', 'error');
				}
			} finally {
				isDeleting = false;
				update();
			}
		};
	};

	function toggleDeleteModal(id) {
		itemId = id;
		toggleDelete();
	}
</script>

<svelte:head>
	<title>Manage product - Spek-N-Boonen</title>
</svelte:head>

{#if loading}
	<PageLoader />
{/if}
<div class="max-w-full w-full">
	<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<h2 class="text-3xl font-semibold">
				{currCarcassId ? `Edit product #${currCarcassId}` : 'Add product'}
			</h2>
			<sub class="text-[#6B6B6B] text-sm"> Inventory / Product / Manage</sub>
		</div>
	</div>
	<Separator class="my-8 md:block hidden" />
	<form
		action="?/manage-product"
		enctype="multipart/form-data"
		method="post"
		use:enhance={manageProduct}
		class="w-full"
	>
		<section
			class="  flex flex-col md:flex-row md:justify-between items-start md:h-[680px] xl:h-[800px] min-h-auto sticky top-0 justify-center text-sm w-full lg:gap-4 xl:gap-10"
		>
			<!-- Providers -->
			<section class="flex-auto h-full overflow-y-scroll no-scrollbar w-full sticky top-3">
				<div class="pb-3 sticky top-0 w-full bg-white z-10 px-2">
					<h3 class="text-sm font-satoshi font-medium text-grey-200 capitalize mb-5">
						PRIMARY INFORMATION
					</h3>
				</div>
				<div class="mb-8 flex flex-col px-3 gap-6 w-full">
					<div class="flex flex-col gap-4 2xl:grid xl:grid-cols-2 2xl:gap-3">
						<div class="action-shot flex flex-col">
							<label for="action_shot" class="mb-1 text-sm font-medium font-satoshi"
								>Featured image</label
							>
							<div class="h-[200px]">
								<UploadBox
									on:imageSelected={(e) => (action_shot = e.detail.imageId)}
									error={imageValidationError}
									inputName="featured_img"
								/>
							</div>
						</div>
						<div class="background-shot flex flex-col">
							<label for="background_shot" class="mb-1 text-sm font-medium font-satoshi"
								>Background Shot</label
							>
							<div class="h-[200px]">
								<UploadBox
									on:imageSelected={(e) => (background_shot = e.detail.imageId)}
									error={imageValidationError}
									inputName="image"
								/>
							</div>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-2">
						<div class="w-full flex flex-col">
							<label for="closeup_shot" class="mb-1 text-sm font-medium font-satoshi"
								>Close Up Shots</label
							>

							<UploadBox
								on:imageSelected={(e) => (closeup_shot = e.detail.imageId)}
								error={imageValidationError}
								inputName="image"
							/>
						</div>
						<div class="w-full flex flex-col">
							<label for="lifestyle_shot" class="mb-1 text-sm font-medium font-satoshi"
								>Lifestyle Shots</label
							>
							<UploadBox
								on:imageSelected={(e) => (lifestyle_shot = e.detail.imageId)}
								error={imageValidationError}
								inputName="image"
							/>
						</div>
					</div>

					<div class="status w-full flex flex-col">
						<label class="mb-4 text-sm font-medium font-satoshi" for="status">Product type</label>

						<Selector
							placeholder="Select product type"
							options={types}
							inputName="product_type"
							required={true}
						/>
					</div>

					<div class="item-name">
						<p class="mb-4 text-sm font-medium font-satoshi">Name</p>
						<LocaleInput inputName="name" />
					</div>

					<div class="form-group">
						<label for="preferred_vendor" class="form-label">Preffered Supplier</label>
						<Selector
							inputName="preferred_vendor"
							options={allSupplier}
							placeholder="Select preffered vendor"
						/>
					</div>

					<div class="flex flex-col">
						<label
							for="short_customer_facing_description"
							class="mb-4 text-sm font-medium font-satoshi">Short customer facing description</label
						>
						<LocaleInput
							inputName="short_customer_facing_description"
							enPlaceholder="Enter short description"
							frPlaceholder="Entrez une brève description"
							duPlaceholder="Voer een korte beschrijving in"
						/>
					</div>

					<div class="flex flex-col">
						<label
							for="long_customer_facing_description"
							class="mb-4 text-sm font-medium font-satoshi">Long customer facing description</label
						>
						<LocaleInput
							inputName="long_customer_facing_description"
							duPlaceholder="Voer een lange beschrijving in"
							frPlaceholder="Entrez une longue description"
							enPlaceholder="Enter long customer facing description"
							textarea={true}
						/>
					</div>

					<div class=" flex flex-col">
						<p class="mb-4 text-sm font-medium font-satoshi">Short internal use description</p>
						<LocaleInput
							inputName="short_internal_use_description"
							enPlaceholder="Enter short internal use description"
							frPlaceholder="Entrez la description AHDB"
							duPlaceholder="Voer de AHDB-beschrijving in"
							textarea={true}
						/>
					</div>
					<div class=" flex flex-col">
						<p class="mb-4 text-sm font-medium font-satoshi">Long internal use description</p>
						<LocaleInput
							inputName="long_internal_use_description"
							enPlaceholder="Enter long internal use description"
							frPlaceholder="Entrez la description AHDB"
							duPlaceholder="Voer de AHDB-beschrijving in"
							textarea={true}
						/>
					</div>
				</div>
			</section>
			<!-- Providers -->

			<!-- More Details -->
			<!-- Separator -->
			<Separator orientation="vertical" class=" " />
			<!-- Separator -->
			<section class=" flex-auto flex flex-col items-start h-full w-full">
				<div class="pb-3 sticky top-0 w-full bg-white z-10 px-2">
					<h3 class="text-sm font-satoshi text-grey-200 capitalize mb-5">MORE DETAILS</h3>
				</div>

				<!-- Tabs -->
				<Tabs.Root
					onValueChange={(e) => {
						e = 'physical-info';
						return e;
					}}
					bind:value={currentTab}
					bind:el={currentTabInfo}
					class="relative w-full px-3  h-full overflow-y-scroll no-scrollbar"
				>
					<!-- Tabs trigger -->
					<section class="md:sticky top-0 py-4 w-full bg-white overflow-x-scroll no-scrollbar z-10">
						<Tabs.List class=" bg-[#F7F7F7] py-2.5 px-1 w-full ">
							<!-- <Tabs.Trigger
								class="md:w-full data-[state=active]:font-bold  data-[state=active]:bg-background data-[state=active]:text-grey-100 data-[state=active]:shadow "
								value="physical-info">Physical information</Tabs.Trigger
							> -->

							<Tabs.Trigger
								class="md:w-full data-[state=active]:font-bold  data-[state=active]:bg-background data-[state=active]:text-grey-100 data-[state=active]:shadow "
								value="nutrition">Nutrition</Tabs.Trigger
							>

							<Tabs.Trigger
								class="w-full data-[state=active]:font-bold data-[state=active]:bg-background data-[state=active]:text-grey-100 data-[state=active]:shadow "
								value="traceability">Traceability</Tabs.Trigger
							>
							<Tabs.Trigger
								class="w-full data-[state=active]:font-bold data-[state=active]:bg-background data-[state=active]:text-grey-100 data-[state=active]:shadow "
								value="finance">Finance</Tabs.Trigger
							>
						</Tabs.List>
					</section>
					<!-- Tabs trigger -->

					<section class="w-full">
						<!-- Nutrition -->
						<Tabs.Content class="h-full mb-8  w-full " value="nutrition">
							<div class="flex flex-col gap-8">
								<div class="form-group">
									<label for="ingredients" class="mb-4 text-sm font-medium font-satoshi"
										>Ingredients</label
									>
									<LocaleInput
										inputName="ingredients"
										enPlaceholder="Enter ingredients"
										frPlaceholder="Entrez les ingrédients"
										duPlaceholder="Voer ingrediënten in"
										textarea={true}
									/>
								</div>

								<div class="form-group">
									<label for="allergens" class="mb-4 text-sm font-medium font-satoshi"
										>Allergens</label
									>
									<LocaleInput
										inputName="allergens"
										enPlaceholder="Enter allergens"
										frPlaceholder="Entrez les allergènes"
										duPlaceholder="Voer allergenen in"
										textarea={true}
									/>
								</div>

								<div class="form-group">
									<label for="storage_requirement" class="form-label">Storage requirements</label>
									<LocaleInput
										inputName="storage_requirement"
										enPlaceholder="Enter storage requirements"
										frPlaceholder="Entrez les allergènes"
										duPlaceholder="Voer allergenen in"
										textarea={true}
									/>
								</div>

								<div class="form-group">
									<label for="nutritional_information" class="form-label"
										>Nutritional information</label
									>
									<LocaleInput
										inputName="nutritional_information"
										enPlaceholder="Enter nutritional information"
										frPlaceholder="Entrez les allergènes"
										duPlaceholder="Voer allergenen in"
										textarea={true}
									/>
								</div>
								<div class="form-group">
									<label for="nutritional_claims" class="form-label">Nutritional claims</label>
									<LocaleInput
										inputName="nutritional_claims"
										enPlaceholder="Enter nutritional claims"
										frPlaceholder="Entrez les allergènes"
										duPlaceholder="Voer allergenen in"
										textarea={true}
									/>
								</div>

								<div class="form-group">
									<label for="health_claims" class="form-label">Health claims</label>
									<LocaleInput
										inputName="health_claims"
										enPlaceholder="Enter health claims"
										frPlaceholder="Entrez les allergènes"
										duPlaceholder="Voer allergenen in"
										textarea={true}
									/>
								</div>
							</div>
						</Tabs.Content>

						<!-- Traceability -->
						<Tabs.Content class="h-full mb-8  w-full " value="traceability">
							<div class="flex flex-col gap-8">
								<div class="form-group">
									<label for="sku" class="form-label">SKU</label>
									<input
										name="sku"
										type="text"
										required
										placeholder="Enter SKU"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
							</div>
						</Tabs.Content>

						<Tabs.Content class="h-full mb-8  w-full " value="finance">
							<div class="flex flex-col gap-8">
								<div class="form-group">
									<label for="selling_tax_percentage" class="form-label mb-4">Selling tax (%)</label
									>
									<input
										name="selling_tax_percentage"
										required
										type="text"
										placeholder="€0.00"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>

								<div class="form-group">
									<label for="shop_selling_price_vat_incl_b2b" class="form-label"
										>Shop selling price vat incl (B2B)</label
									>
									<input
										name="shop_selling_price_vat_incl_b2b"
										required
										type="text"
										placeholder="€0.00"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>

								<div class="form-group">
									<label for="shop_selling_price_vat_incl_b2c" class="form-label"
										>Shop selling price vat incl (B2C)</label
									>
									<input
										name="shop_selling_price_vat_incl_b2c"
										required
										type="text"
										placeholder="€0.00"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>

								<div class="form-group">
									<label for="ecommerce_selling_price_vat_excl_b2b" class="form-label"
										>E-commerce selling price vat excl (B2B)</label
									>
									<input
										name="ecommerce_selling_price_vat_excl_b2b"
										type="text"
										required
										placeholder="€0.00"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="form-group">
									<label for="ecommerce_selling_price_vat_excl_b2c" class="form-label"
										>E-commerce selling price vat excl (B2C)</label
									>
									<input
										name="ecommerce_selling_price_vat_excl_b2c"
										type="text"
										required
										placeholder="€0.00"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
							</div>
						</Tabs.Content>

						<div class="w-full self flex items-center justify-between mt-4 px-4">
							{#if allTabs.indexOf(currentTab) === allTabs.length - 1}
								<section class="w-full my-5 flex items-center justify-end">
									<button
										disabled={loading}
										type="submit"
										class=" px-3 py-2 bg-primary-100 text-sm text-white rounded-md flex items-center gap-1 max-xsm:hidden"
									>
										{#if loading}
											<iconify-icon icon="line-md:loading-twotone-loop" width="20"></iconify-icon>
										{:else}
											<span> {carcassToEdit ? 'Edit' : 'Add'} product</span>
										{/if}
									</button>
								</section>
							{/if}
						</div>
					</section>
				</Tabs.Root>
				<!-- Tabs -->
			</section>
			<!-- More Details -->
		</section>
	</form>
</div>

<Modal showModal={showTagsModal} on:close={toggleEditModal}>
	<div slot="modal-content" class="w-full">
		<!-- Your modal content goes here -->
		<form
			use:enhance={manageTag}
			action="?/manage-tag"
			method="post"
			class="md:max-w-2xl w-full md:w-[450px] flex flex-col items-center px-4 py-8 md:p-6 gap-8 bg-white rounded-md"
		>
			<div class="modal-title flex items-center gap-3 self-stretch">
				<div class="title-text flex-[1 0 0] text-lg font-medium tracking-[-0.18px] w-11/12">
					{currTag ? 'Edit tag' : 'Add tag'}
				</div>
				<button
					type="button"
					class="close-button flex justify-center items-center w-1/12"
					on:click={toggleEditModal}
				>
					<img src="/icons/close.svg" alt="close icon" />
				</button>
			</div>

			<div class="modal-input w-full">
				<!-- <input type="text" class="hidden" bind:value={imageId} name="manufacturer-logo" /> -->
				<input
					type="text"
					name="name"
					id="name"
					placeholder="Enter tag name"
					bind:value={currTagName}
					class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
				{#if validationErrors?.name}
					<sub
						transition:slide={{ delay: 250, duration: 300 }}
						class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.name}</sub
					>
				{/if}
			</div>
			<div class="modal-submit">
				<button
					class="bg-primary-50 py-1.5 md:py-2.5 px-4 rounded-[8px] w-full md:w-[25rem]
					hover:bg-[#C7453C] hover:rounded-[0.625rem]
					focus:shadow-custom text-white font-bold flex items-center justify-center
					"
					type="submit"
					disabled={isProcessingTag}
				>
					{#if isProcessingTag}
						<iconify-icon width="35" icon="eos-icons:three-dots-loading"></iconify-icon>
					{:else}
						<span class="button-text">{currTag ? 'Edit tag' : 'Add tag'} </span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</Modal>
<DeleteModal
	{toggleDelete}
	{showDeleteModal}
	deleteItem={deleteTag}
	id={itemId}
	endPoint="delete-tag"
	{isDeleting}
	mainNameForHeader="Tag"
	mainNameForSub="tag"
/>
