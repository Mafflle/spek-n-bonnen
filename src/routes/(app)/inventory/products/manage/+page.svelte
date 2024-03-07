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

	export let data;

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

	let status = ['active', 'inactive'];

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
			class="  flex flex-col md:flex-row md:justify-between items-start md:h-[680px] min-h-auto sticky top-0 justify-center text-sm w-full lg:gap-10"
		>
			<!-- Providers -->
			<section class="flex-auto px-2 h-full overflow-y-scroll no-scrollbar w-full sticky top-3">
				<div class="pb-3 sticky top-0 w-full bg-white px-2">
					<h3 class="text-sm font-satoshi text-grey-200 capitalize mb-5">PROVIDERS</h3>
				</div>
				<div class="mb-8 flex flex-col gap-6">
					<div class="action-shot">
						<p class="mb-2 text-sm">Action Shot</p>
						<UploadBox error={imageValidationError} inputName="image" />
					</div>
					<div class="background-shot">
						<p class="mb-2 text-sm">Background Shot</p>
						<UploadBox error={imageValidationError} inputName="image" />
					</div>
					<div class="flex items-center gap-3">
						<div class="w-1/2">
							<p class="mb-2 text-sm">Close Up Shot</p>
							<UploadBox error={imageValidationError} inputName="image" />
						</div>
						<div class="w-1/2">
							<p class="mb-2 text-sm">Lifestyle Shot</p>
							<UploadBox error={imageValidationError} inputName="image" />
						</div>
					</div>

					<div class="item-name">
						<p class="mb-2 text-sm">Item name</p>
						<LocaleInput />
					</div>

					<div class="status">
						<label class="mb-2 text-sm" for="status" />
						<Select.Root>
							<Select.Trigger class="w-full">
								<Select.Value placeholder="Theme" />
							</Select.Trigger>
							<Select.Content>
								{#each status as s}
									<Select.Item value={s}>Light</Select.Item>
								{/each}
							</Select.Content>
							<Select.Input name="status" id="status" />
						</Select.Root>
					</div>

					<div class="slug">
						<p class="mb-2 text-sm">Slug</p>

						<label class="mb-2 text-sm" for="slug" />
						<input
							placeholder="Enter slug"
							class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
							id="slug"
							name="slug"
						/>
					</div>

					<div class="short-desc">
						<p class="mb-2 text-sm">Short description</p>
						<LocaleInput />
					</div>

					<div class="long-desc">
						<p class="mb-2 text-sm">Long description</p>
						<LocaleInput textarea={true} />
					</div>

					<div class="abhd-desc">
						<p class="mb-2 text-sm">ABHD description</p>
						<LocaleInput textarea={true} />
					</div>

					<div class="pb-3 sticky top-0 w-full bg-white px-2">
						<h3 class="text-sm font-satoshi text-grey-200 capitalize mb-5">MARKETING</h3>
					</div>

					<div class="seo">
						<p class="mb-2 text-sm">SEO</p>

						<label class="mb-2 text-sm" for="seo" />
						<input
							placeholder="Enter SEO"
							class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
							id="seo"
							name="seo"
						/>
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
							<Tabs.Trigger class="md:w-full data-[state=active]:font-bold  " value="physical-info"
								>Physical information</Tabs.Trigger
							>

							<Tabs.Trigger class="md:w-full data-[state=active]:font-bold  " value="nutrition"
								>Nutrition</Tabs.Trigger
							>

							<Tabs.Trigger class="w-full data-[state=active]:font-bold" value="traceability"
								>Traceability</Tabs.Trigger
							>
							<Tabs.Trigger class="w-full data-[state=active]:font-bold" value="finance"
								>Finance</Tabs.Trigger
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
								class="flex flex-col gap-[1.28rem]"
							>
								p
							</div></Tabs.Content
						>
						<!-- Nutirion -->
						<Tabs.Content class="px-4 h-full mb-8  w-full " value="nutrition">n</Tabs.Content>

						<!-- Traceability -->
						<Tabs.Content class="px-4 h-full mb-8  w-full " value="traceability">t</Tabs.Content>
						<!-- Traceability -->

						<!-- FInance -->
						<Tabs.Content class="px-4 h-full mb-8  w-full " value="finance">f</Tabs.Content>

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
