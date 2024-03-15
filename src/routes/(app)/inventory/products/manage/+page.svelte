<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Carcass from '$lib/components/Carcass.svelte';
	import LocaleInput from '$lib/components/LocaleInput.svelte';
	import PageLoader from '$lib/components/PageLoader.svelte';
	import * as Select from '$lib/components/ui/select';
	import UploadBox from '$lib/components/UploadBox.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Carcasses } from '$lib/stores/carcass.stores';
	import { showToast, type CarcassErrors } from '$lib/utils.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	import { slide } from 'svelte/transition';
	import Selector from '$lib/components/Selector.svelte';

	import { cut_categories } from '$lib/stores/cuts.stores.js';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { Textarea } from '$lib/components/ui/textarea';

	export let data;

	const { tags, primals, groups } = data;

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

	let status = [
		{ value: 'Available', label: 'Available' },
		{ value: 'Discontinued', label: 'Discontinued' },
		{ value: 'Limited', label: 'Limited' }
	];

	let weight_units = [
		{ value: 'g', label: 'gram' },
		{ value: 'kg', label: 'kilogram' },
		{ value: 'lbs', label: 'pound' }
	];

	// const { brands, slaughterHouses, vendors, butcherShops, farms, manufacturers, carcassToEdit } =
	// 	data;

	let currCarcassId = $page.url.searchParams.get('editing');
	let validationErrors: CarcassErrors;
	const allTabs = ['physical-info', 'nutrition', 'traceability', 'finance'];
	let currentTab: string = 'physical-info';
	let currentTabInfo;

	let loading: boolean = false;
	let today = new Date();
	let dd = today.getDate();
	let mm = today.getMonth() + 1;
	let year = today.getFullYear();

	if (dd < 10) {
		dd = '0' + dd;
	}

	if (mm < 10) {
		mm = '0' + mm;
	}
	let maxDate = year + '-' + mm + '-' + dd;

	const switchTabs = (direction: string) => {
		const currTab = allTabs.findIndex((item) => item === currentTab);
		if (direction === 'previous') {
			return (currentTab = allTabs[currTab - 1]);
		} else if (direction === 'next') {
			return (currentTab = allTabs[currTab + 1]);
		}
	};

	const manageCarcass: SubmitFunction = async ({ formData }) => {
		loading = true;
		if (carcassToEdit && currCarcassId) {
			formData.append('currCarcassId', `${currCarcassId}`);
		}
		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					if (result.data.edited) {
						const editedCarcass = result.data.editedCarcass;
						Carcasses.update((carcasses) => {
							const updatedCarcasses = carcasses.map((carcass) => {
								if (carcass.id === editedCarcass.id) {
									carcass = editedCarcass;
								}
								return carcass;
							});
							return updatedCarcasses;
						});
						showToast('Carcass edited successfully', 'success');
					} else {
						const newCarcass = result.data.newCarcass;
						showToast('Carcass added successfully', 'success');
						Carcasses.update((items) => [newCarcass, ...items]);
					}
					await goto('/inventory/carcass');
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
	const checkIfFormFilled = () => {
		// let tabs = currentTabInfo?.children[1].children;
		// let buttons = currentTabInfo?.children[0].children[0].children;
		// if (tabs) {
		// 	for (let i = 0; i < tabs.length; i++) {
		// 		if (tabs[i].attributes[1]?.value === currentTab) {
		// 			const requiredInputs = tabs[i].querySelectorAll('input[required]');
		// 			for (const button of buttons) {
		// 				if (button.attributes['data-value']?.value !== currentTab) {
		// 					// console.log(validateInputs(requiredInputs));
		// 					if (validateInputs(requiredInputs)) {
		// 						button.removeAttribute('disabled');
		// 					} else {
		// 						button.setAttribute('disabled', 'disabled');
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// }
	};

	onMount(() => {
		// let tabs = currentTabInfo?.children[1].children;
		// if (tabs) {
		// 	for (let i = 0; i < tabs.length; i++) {
		// 		if (tabs[i].attributes[1]?.value === currentTab) {
		// 			const inputs = tabs[i].querySelectorAll('input[required]');
		// 			inputs.forEach((input) => {
		// 				input.addEventListener('input', checkIfFormFilled());
		// 			});
		// 		}
		// 	}
		// }
	});

	let action_shot: number;
	let background_shot: number;
	let closeup_shot: number;
	let lifestyle_shot: number;

	let sexCategoryOptions = [
		{ value: 'A', label: 'Young bull' },
		{ value: 'B', label: 'Bull' },
		{ value: 'C', label: 'Steer' },
		{ value: 'E', label: 'Heifer' }
	];
	let ageing_duration = [
		{ value: 'one_week_dry_aged', label: 'One week' },
		{ value: 'two_weeks_dry_aged', label: 'Two weeks' },
		{ value: 'three_weeks_dry_agedd', label: 'Three weeks' },
		{ value: 'four_weeks_dry_aged', label: 'Four weeks' },
		{ value: 'three_days_dry_aged', label: 'Three days' }
	];
	let sellingTax = [
		{ value: '0', label: '0%' },
		{ value: '6', label: '6%' },
		{ value: '12', label: '12%' },
		{ value: '21', label: '21%' }
	];

	let checked = false;
</script>

<svelte:head>
	<title>Manage product - Spek-N-Boonen</title>
</svelte:head>

{#if loading}
	<PageLoader />
{/if}
<div class="">
	<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<h2 class="text-3xl font-semibold">
				{currCarcassId ? `Edit product #${currCarcassId}` : 'Add product'}
			</h2>
			<sub class="text-[#6B6B6B] text-sm"> Inventory / Product / Manage</sub>
		</div>
	</div>
	<Separator class="my-8 md:block hidden" />
	<form action="?/manage-carcass" method="post" use:enhance={manageCarcass} class="w-full">
		<section class="w-full my-5 flex items-center justify-end">
			<button
				disabled={loading}
				type="submit"
				class=" px-3 py-2 bg-primary-100 text-sm text-white rounded-md flex items-center gap-1 max-xsm:hidden"
			>
				{#if loading}
					<iconify-icon icon="line-md:loading-twotone-loop" width="20"></iconify-icon>
				{:else}
					<img src="/icons/plus.svg" alt="Plus icon to represent adding" />
					<span> {carcassToEdit ? 'Edit' : 'Add'} product</span>
				{/if}
			</button>
		</section>
		<section
			class="  flex flex-col md:flex-row md:justify-between items-start md:h-[680px] min-h-auto sticky top-0 justify-center text-sm w-full lg:gap-8"
		>
			<!-- Providers -->
			<section class="flex-auto h-full overflow-y-scroll no-scrollbar w-full sticky top-3">
				<div class="pb-3 sticky top-0 w-full bg-white z-10 px-2">
					<h3 class="text-sm font-satoshi font-medium text-grey-200 capitalize mb-5">
						PRIMARY INFORMATION
					</h3>
				</div>
				<div class="mb-8 flex flex-col gap-9 w-full">
					<div class="flex flex-col gap-3 2xl:grid xl:grid-cols-2 xl:space-x-3.5">
						<div class="action-shot">
							<label for="action_shot" class="mb-4 text-sm font-medium font-satoshi"
								>Action Shot</label
							>
							<UploadBox
								on:imageSelected={(e) => (action_shot = e.detail.imageId)}
								error={imageValidationError}
								inputName="action_shot"
							/>
						</div>
						<div class="background-shot">
							<label for="background_shot" class="mb-4 text-sm font-medium font-satoshi"
								>Background Shot</label
							>
							<UploadBox
								on:imageSelected={(e) => (background_shot = e.detail.imageId)}
								error={imageValidationError}
								inputName="background_shot"
							/>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<div class="w-1/2">
							<label for="closeup_shot" class="mb-4 text-sm font-medium font-satoshi"
								>Close Up Shot</label
							>
							<UploadBox
								on:imageSelected={(e) => (closeup_shot = e.detail.imageId)}
								error={imageValidationError}
								inputName="closeup_shot"
							/>
						</div>
						<div class="w-1/2">
							<label for="lifestyle_shot" class="mb-4 text-sm font-medium font-satoshi"
								>Lifestyle Shot</label
							>
							<UploadBox
								on:imageSelected={(e) => (lifestyle_shot = e.detail.imageId)}
								error={imageValidationError}
								inputName="lifestyle_shot"
							/>
						</div>
					</div>

					<div class="item-name">
						<p class="mb-4 text-sm font-medium font-satoshi">Item name</p>
						<LocaleInput />
					</div>

					<div class="status w-full flex flex-col">
						<label class="mb-4 text-sm font-medium font-satoshi" for="status">Status</label>
						<!-- <Select.Root>
							<Select.Trigger class=" max-w-full w-11/12 flex">
								<Select.Value placeholder="Select status" class="placeholder:text-grey-200" />
							</Select.Trigger>
							<Select.Content>
								{#each status as s}
									<Select.Item value={s}>Light</Select.Item>
								{/each}
							</Select.Content>
							<Select.Input name="status" id="status" />
						</Select.Root> -->

						<Selector placeholder="Select status" options={status} inputName="status" />
					</div>

					<div class="slug flex flex-col">
						<label class="mb-2 text-sm font-medium font-satoshi" for="slug">Slug </label>
						<input
							placeholder="Enter slug"
							class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
							id="slug"
							name="slug"
						/>
					</div>

					<div class="short-desc flex flex-col">
						<label for="short_desc" class="mb-4 text-sm font-medium font-satoshi"
							>Short description</label
						>
						<LocaleInput
							enPlaceholder="Enter short description"
							frPlaceholder="Entrez une brève description"
							duPlaceholder="Voer een korte beschrijving in"
						/>
					</div>

					<div class="long-desc flex flex-col">
						<p class="mb-4 text-sm font-medium font-satoshi">Long description</p>
						<LocaleInput
							duPlaceholder="Voer een lange beschrijving in"
							frPlaceholder="Entrez une longue description"
							enPlaceholder="Enter long description"
							textarea={true}
						/>
					</div>

					<div class="abhd-desc flex flex-col">
						<p class="mb-4 text-sm font-medium font-satoshi">ABHD description</p>
						<LocaleInput
							enPlaceholder="Enter ABHD description"
							frPlaceholder="Entrez la description ABHD"
							duPlaceholder="Voer de ABHD-beschrijving in"
							textarea={true}
						/>
					</div>

					<div class="flex flex-col items-start w-full">
						<div class="pb-3 sticky top-0 w-full bg-white flex flex-col">
							<h3 class="text-sm font-satoshi text-grey-200 font-medium capitalize mb-2">
								MARKETING
							</h3>
						</div>

						<div class="seo flex flex-col w-full">
							<label for="seo" class="mb-2 text-sm font-medium font-satoshi">SEO</label>

							<input
								placeholder="Enter SEO"
								class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
								id="seo"
								name="seo"
							/>
						</div>
					</div>
				</div>
			</section>
			<!-- Providers -->

			<!-- More Details -->
			<!-- Separator -->
			<Separator orientation="vertical" class="" />
			<!-- Separator -->
			<section class="md:px-2 flex-auto flex flex-col items-start h-full w-full">
				<h3 class="text-sm font-satoshi text-grey-200 capitalize mb-5">MORE DETAILS</h3>

				<!-- Tabs -->
				<Tabs.Root
					onValueChange={(e) => {
						e = 'physical-info';
						return e;
					}}
					bind:value={currentTab}
					bind:el={currentTabInfo}
					class="relative w-full h-full overflow-y-scroll no-scrollbar"
				>
					<!-- Tabs trigger -->
					<section
						class="md:sticky top-0 md:px-1 py-4 w-full bg-white overflow-x-scroll no-scrollbar z-10"
					>
						<Tabs.List class=" bg-[#F7F7F7] py-2.5 px-1 w-full ">
							<Tabs.Trigger
								class="md:w-full data-[state=active]:font-bold  data-[state=active]:bg-background data-[state=active]:text-grey-100 data-[state=active]:shadow "
								value="physical-info">Physical information</Tabs.Trigger
							>

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
						<!-- Physical info -->
						<Tabs.Content class="px-4 h-full mb-8  w-full" value="physical-info">
							<div
								on:change={(e) => {
									checkIfFormFilled();
								}}
								class="flex flex-col gap-8"
							>
								<div class="form-group">
									<label for="weight_unit" class="form-label mb-4">Weight unit</label>

									<Selector placeholder="Select weight unit" options={weight_units} />
								</div>
								<div class="form-group">
									<label for="quantity_unit" class="form-label mb-4">Quantity unit</label>
									<input
										name="quantity_unit"
										type="number"
										placeholder="Enter quantity unit eg - (kg, g)"
										class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="form-group">
									<label for="marbling" class="form-label mb-4">Marbling</label>
									<input
										name="marbling"
										type="text"
										placeholder="Enter marbling"
										class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>

								<div class="form-group">
									<label for="sex" class="form-label">Sex</label>
									<Selector
										on:selected={() => checkIfFormFilled()}
										prop={sexCategoryOptions[
											sexCategoryOptions.findIndex(
												(option) => option.value == carcassToEdit?.sex_category
											)
										]}
										required={true}
										inputName="sex"
										placeholder="Select sex"
										options={sexCategoryOptions}
									/>
									{#if validationErrors?.sex_category}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.sex_category}</sub
										>
									{/if}
								</div>

								<div class="form-group">
									<label for="age" class="form-label">Age</label>
									<input
										name="age"
										type="number"
										placeholder="Enter age"
										class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="form-group">
									<label for="livestock_breed" class="form-label mb-4">Livestock breed</label>
									<input
										name="livestock_breed"
										type="text"
										placeholder="Enter livestock breed"
										class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>

								<div class="form-group">
									<label for="cut_type" class="form-label">Cut type</label>
									<Selector
										on:selected={() => checkIfFormFilled()}
										required={true}
										inputName="cut_type"
										placeholder="Select cut type"
										options={[
											{ label: 'Basic', value: 'basic' },
											{ label: 'Advanced', value: 'advanced' }
										]}
									/>
									{#if validationErrors?.sex_category}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.sex_category}</sub
										>
									{/if}
								</div>
								<div class="form-group">
									<label for="cut_category" class="form-label">Cut category</label>
									<Selector
										on:selected={() => checkIfFormFilled()}
										required={true}
										inputName="cut_category"
										placeholder="Select cut category"
										options={cut_categories}
									/>
									{#if validationErrors?.sex_category}
										<sub
											transition:slide={{ delay: 250, duration: 300 }}
											class="text-rose-500 text-xs tracking-[-0.0075rem]"
											>{validationErrors.sex_category}</sub
										>
									{/if}
								</div>

								<div class="form-group">
									<label for="color" class="form-label mb-4">Color</label>
									<input
										name="color"
										type="text"
										placeholder="Enter color"
										class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="form-group">
									<label for="texture" class="form-label mb-4">Texture</label>
									<input
										name="texture"
										type="text"
										placeholder="Enter texture"
										class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="form-group">
									<label for="tenderness" class="form-label mb-4">Tenderness</label>
									<input
										name="tenderness"
										type="text"
										placeholder="Enter tenderness"
										class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="flex gap-3">
									<label for="qualifies_for_return" class="form-label mb-4"
										>Qualifies for return:</label
									>
									<!-- <input
										name="qualifies_for_return"
										type="text"
										placeholder="Enter livestock breed"
										class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/> -->
									<Checkbox id="qualifies_for_return" class="w-5 h-5" bind:checked />
								</div>
							</div></Tabs.Content
						>
						<!-- Nutrition -->
						<Tabs.Content class="px-4 h-full mb-8  w-full " value="nutrition">
							<div class="flex flex-col gap-8">
								<div class="form-group">
									<label for="storage_requirements" class="form-label">Storage requirements</label>
									<Textarea
										placeholder="Enter storage requirements"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="form-group">
									<label for="allergens" class="mb-4 text-sm font-medium font-satoshi"
										>Allergens</label
									>
									<LocaleInput
										enPlaceholder="Enter allergens"
										frPlaceholder="Entrez les allergènes"
										duPlaceholder="Voer allergenen in"
										textarea={true}
									/>
								</div>
								<div class="form-group">
									<label for="ingredients" class="mb-4 text-sm font-medium font-satoshi"
										>Ingredients</label
									>
									<LocaleInput
										enPlaceholder="Enter ingredients"
										frPlaceholder="Entrez les ingrédients"
										duPlaceholder="Voer ingrediënten in"
										textarea={true}
									/>
								</div>

								<div class="form-group">
									<label for="nutritional_information" class="form-label"
										>Nutritional informarion</label
									>
									<Textarea
										placeholder="Enter nutritional information"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="form-group">
									<label for="pairing_suggestion" class="form-label">Pairing suggestions</label>
									<Textarea
										placeholder="Enter pairing suggesting"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="form-group">
									<label for="dry-ageing_duration" class="form-label">Dry ageing duration</label>
									<Selector
										placeholder="Select dry ageing duration"
										options={ageing_duration}
										inputName="dry-ageing-duration"
									/>
								</div>
								<div class="form-group">
									<label for="flavour" class="form-label">Flavour</label>
									<input
										name="flavour"
										placeholder="Describe flavour"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="form-group">
									<label for="fat_content" class="form-label">Fat content</label>
									<input
										name="fat_content"
										placeholder="Enter fat content"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="form-group">
									<label for="moisture" class="form-label">Moisture content</label>
									<input
										name="moisture"
										placeholder="Enter moisture content"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="form-group">
									<label for="bone_content" class="form-label">Bone content</label>
									<input
										name="bone_content"
										placeholder="Enter bone content"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>

								<div class="form-group">
									<label for="dry-ageing_duration" class="form-label">Dry ageing duration</label>
									<Selector
										placeholder="Select dry ageing duration"
										options={ageing_duration}
										inputName="dry-ageing-duration"
									/>
								</div>
							</div>
						</Tabs.Content>

						<!-- Traceability -->
						<Tabs.Content class="px-4 h-full mb-8  w-full " value="traceability">
							<div class="flex flex-col gap-8">
								<div class="form-group">
									<label for="plu" class="form-label">PLU</label>
									<input
										name="plu"
										type="text"
										placeholder="Enter PLU"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="form-group">
									<label for="sku" class="form-label">SKU</label>
									<input
										name="sku"
										type="text"
										placeholder="Enter SKU"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="form-group">
									<label for="tag" class="form-label">Tag</label>
									<input
										name="tag"
										type="text"
										placeholder="Create and choose tag"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
							</div>
						</Tabs.Content>
						<!-- Traceability -->

						<!-- FInance -->
						<Tabs.Content class="px-4 h-full mb-8  w-full " value="finance">
							<div class="flex flex-col gap-8">
								<div class="form-group">
									<label for="q_factor" class="form-label">Q factor</label>
									<input
										name="q_factor"
										type="text"
										placeholder="Enter q factor"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="form-group">
									<label for="selling_tax" class="form-label mb-4">Selling tax(%)</label>
									<Selector
										inputName="selling_tax"
										options={sellingTax}
										placeholder="Select selling tax"
									/>
								</div>

								<div class="form-group">
									<label for="shop_selling_price" class="form-label">Shop selling price</label>
									<input
										name="shop_selling_price"
										type="text"
										placeholder="Enter shop selling price eg - ($100)"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>

								<div class="form-group">
									<label for="ecommerce_selling_price_b2b" class="form-label"
										>E-commerce selling price B2B</label
									>
									<input
										name="ecommerce_selling_price_b2b"
										type="text"
										placeholder="Enter e-commerce selling price B2B"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="form-group">
									<label for="ecommerce_selling_price_b2c" class="form-label"
										>E-commerce selling price B2C</label
									>
									<input
										name="ecommerce_selling_price_b2c"
										type="text"
										placeholder="Enter e-commerce selling price B2C"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="form-group">
									<label for="selling_unit" class="form-label">Selling unit</label>
									<input
										name="selling_unit"
										type="text"
										placeholder="Enter selling unit"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="form-group">
									<label for="discount_percentage_b2b" class="form-label"
										>Discount percentage B2B</label
									>
									<input
										name="discount_percentage_b2b"
										type="text"
										placeholder="Enter discount percentage B2B"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
								<div class="form-group">
									<label for="discount_percentage_b2c" class="form-label"
										>Discount percentage B2C</label
									>
									<input
										name="discount_percentage_b2c"
										type="text"
										placeholder="Enter discount percentage B2C"
										class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
								</div>
							</div>
						</Tabs.Content>

						<div class="w-full self flex items-center justify-between mt-4 px-4">
							{#if allTabs.indexOf(currentTab) > 0}
								<Button
									on:click={() => switchTabs('previous')}
									variant="secondary"
									class=" flex gap-1 items-center hover:bg-primary-50 hover:text-white "
									><iconify-icon rotate="180deg" icon="grommet-icons:form-next"></iconify-icon>
									<span class="hidden md:block">Previous </span>
								</Button>
							{/if}
							{#if allTabs.indexOf(currentTab) + 1 < allTabs.length}
								<Button
									on:click={() => switchTabs('next')}
									variant="secondary"
									class=" flex gap-1  items-center hover:bg-primary-50 hover:text-white "
								>
									<span class="hidden md:block">Next </span>
									<iconify-icon icon="grommet-icons:form-next"></iconify-icon></Button
								>
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
