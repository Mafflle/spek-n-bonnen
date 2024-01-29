<script lang="ts">
	import Selector from '$lib/components/Selector.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tabs from '$lib/components/ui/tabs';

	const allTabs = ['physical-info', 'vendor', 'traceability', 'origin'];
	let currentTab: string = 'physical-info';

	const switchTabs = (direction: string) => {
		const currTab = allTabs.findIndex((item) => item === currentTab);
		if (direction === 'previous') {
			return (currentTab = allTabs[currTab - 1]);
		} else if (direction === 'next') {
			return (currentTab = allTabs[currTab + 1]);
		}
	};
</script>

<svelte:head>
	<title>Manage carcass - Spek-N-Boonen</title>
</svelte:head>

<div class="">
	<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<h2 class="text-3xl font-semibold">Add carcass</h2>
			<sub class="text-[#6B6B6B] text-sm"> Carcass / manage</sub>
		</div>
	</div>
	<Separator class="my-8 md:block hidden" />
	<form action="w-full">
		<section
			class="  flex flex-col md:flex-row md:justify-between items-start md:h-[450px] justify-center text-sm w-full lg:gap-10"
		>
			<!-- Providers -->
			<section class="flex-auto px-2 h-full overflow-y-scroll no-scrollbar w-full">
				<div class="pb-3 sticky top-0 w-full bg-white px-2">
					<h3 class="text-sm font-satoshi text-grey-200 capitalize mb-5">PROVIDERS</h3>
				</div>
				<div class="mb-8 flex flex-col gap-[1.28rem]">
					<div class="manufacturer">
						<label for="manufacturer" class="block mb-2 text-sm">Manufacturer</label>
						<input
							type="text"
							name="manufacturers"
							id="email"
							placeholder="Enter manufacturer's name"
							class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
						/>
						<!-- {#if validationErrors?.email}
            <sub
              transition:slide={{ delay: 250, duration: 300 }}
              class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
            >
          {/if} -->
					</div>

					<div>
						<label for="brand" class="block mb-2 text-sm">Brand</label>
						<input
							type="text"
							name="brand"
							id="brand"
							placeholder="Enter brand's name"
							class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
						/>
						<!-- {#if validationErrors?.password}
            <sub
              transition:slide={{ delay: 250, duration: 300 }}
              class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.password}</sub
            >
          {/if} -->
					</div>

					<div class="vendor">
						<label for="vendor" class="block mb-2 text-sm">Vendor</label>
						<input
							type="text"
							name="vendor"
							id="vendor"
							placeholder="Enter vendor's name"
							class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
						/>
						<!-- {#if validationErrors?.email}
            <sub
              transition:slide={{ delay: 250, duration: 300 }}
              class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
            >
          {/if} -->
					</div>
				</div>
				<div class="mb-8">
					<h3 class="text-sm font-satoshi text-grey-200 capitalize mb-5">CERTIFICATIONS</h3>
					<div class=" flex flex-col gap-[1.28rem] w-full">
						<div class="purchase">
							<label for="purchase-price" class="block mb-2 text-sm">Purchase price</label>
							<input
								type="text"
								name="purchase-price"
								id="purchase-price"
								placeholder="Enter purchase price eg - ($100)"
								class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
							/>
							<!-- {#if validationErrors?.email}
              <sub
                transition:slide={{ delay: 250, duration: 300 }}
                class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
              >
            {/if} -->
						</div>
					</div>
				</div>
				<div class="mb-8">
					<h3 class="text-sm font-satoshi text-grey-200 capitalize mb-5">FINANCE</h3>
					<div class=" flex flex-col gap-[1.28rem] w-full">
						<div class="purchase">
							<label for="purchase-price" class="block mb-2 text-sm">Purchase price</label>
							<input
								type="text"
								name="purchase-price"
								id="purchase-price"
								placeholder="Enter purchase price eg - ($100)"
								class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
							/>
							<!-- {#if validationErrors?.email}
              <sub
                transition:slide={{ delay: 250, duration: 300 }}
                class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
              >
            {/if} -->
						</div>
					</div>
				</div>
			</section>
			<!-- Providers -->

			<!-- Separator -->
			<Separator orientation="vertical" class="" />
			<!-- Separator -->

			<!-- More Details -->
			<section class="md:px-2 flex-auto flex flex-col items-start h-full w-full">
				<h3 class="text-sm font-satoshi text-grey-200 capitalize mb-5">MORE DETAILS</h3>

				<!-- Tabs -->
				<Tabs.Root
					value={currentTab}
					class=" relative w-full h-full overflow-y-scroll no-scrollbar"
				>
					<!-- Tabs trigger -->
					<section
						class="md:sticky top-0 md:px-1 py-4 w-full bg-white overflow-x-scroll no-scrollbar"
					>
						<Tabs.List class=" bg-[#F7F7F7] py-2.5 px-1 ">
							<Tabs.Trigger class="md:w-full data-[state=active]:font-bold  " value="physical-info"
								>Physical information</Tabs.Trigger
							>
							<Tabs.Trigger class="w-full data-[state=active]:font-bold  " value="vendor"
								>Vendor</Tabs.Trigger
							>
							<Tabs.Trigger class="w-full data-[state=active]:font-bold  " value="traceability"
								>Traceability</Tabs.Trigger
							>
							<Tabs.Trigger class="w-full data-[state=active]:font-bold  " value="origin"
								>Origin</Tabs.Trigger
							>
						</Tabs.List>
					</section>
					<!-- Tabs trigger -->

					<section>
						<!-- Physical info -->
						<Tabs.Content class="px-4 h-full mb-8  w-full " value="physical-info">
							<div class=" flex flex-col gap-[1.28rem] w-full">
								<div class="weight">
									<label for="weight" class="block mb-2 text-sm">Weight</label>
									<input
										type="text"
										name="weight"
										id="weight"
										placeholder="Enter weight eg - (99kg)"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									<!-- {#if validationErrors?.email}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
								>
							{/if} -->
								</div>

								<div class="w-full">
									<label for="cold-weight" class="block mb-2 text-sm">Cold weight</label>
									<input
										type="text"
										name="cold-weight"
										id="cold-weight"
										placeholder="Enter cold weight eg - (99kg)"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									<!-- {#if validationErrors?.password}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.password}</sub
								>
							{/if} -->
								</div>

								<div>
									<label for="sex-category" class="block mb-2 text-sm">Sex category</label>
									<Selector
										name="sex-category"
										placeholder="Select sex category"
										options={[
											{ value: 'young-bull', label: 'Young bull' },
											{ value: 'Bull', label: 'Bull' },
											{ value: 'Steer', label: 'Steer' },
											{ value: 'Heifer', label: 'Heifer' }
										]}
									/>
								</div>
								<div>
									<label for="fat-score" class="block mb-2 text-sm">Fat score</label>
									<Selector
										name="sex-category"
										placeholder="Select fat score"
										options={[
											{ value: '10', label: '10%' },
											{ value: '20', label: '20%' },
											{ value: '30', label: '30%' },
											{ value: '40', label: '40%' },
											{ value: '50', label: '50%' }
										]}
									/>
								</div>

								<div class="conformation">
									<label for="conformation" class="block mb-2 text-sm">Conformation</label>
									<input
										type="text"
										name="conformation"
										id="conformation"
										placeholder="Enter vendor's moq"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									<!-- {#if validationErrors?.email}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
								>
							{/if} -->
								</div>
							</div>
						</Tabs.Content>
						<!-- Physical info -->

						<!-- Vendor info -->
						<Tabs.Content class="px-4 h-full mb-8  w-full " value="vendor">
							<div class=" flex flex-col gap-[1.28rem] w-full">
								<div class="vendor-code">
									<label for="vendor-code" class="block mb-2 text-sm">Vendor code</label>
									<input
										type="text"
										name="vendor-code"
										id="vendor-code"
										placeholder="Enter vendor code"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									<!-- {#if validationErrors?.email}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
								>
							{/if} -->
								</div>

								<div class="w-full">
									<label for="vendor-moq" class="block mb-2 text-sm">Vendor MOQ</label>
									<input
										type="text"
										name="vendor-moq"
										id="vendor-moq"
										placeholder="Enter moq"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									<!-- {#if validationErrors?.password}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.password}</sub
								>
							{/if} -->
								</div>

								<div>
									<label for="vendor-moq-unit" class="block mb-2 text-sm">Vendor MOQ unit</label>
									<input
										type="text"
										name="vendor-moq-unit "
										id="vendor-moq-unit "
										placeholder="Enter vendor's moq"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									<!-- {#if validationErrors?.email}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
								>
							{/if} -->
								</div>
								<div>
									<label for="vendor-item-name" class="block mb-2 text-sm">Vendor item name</label>
									<input
										type="text"
										name="vendor-item-name"
										id="vendor-item-name"
										placeholder="Enter vendor item name"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									<!-- {#if validationErrors?.email}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
								>
							{/if} -->
								</div>
							</div>
						</Tabs.Content>
						<!-- Vendor info -->

						<!-- Traceability -->
						<Tabs.Content class="px-4 h-full mb-8  w-full " value="traceability">
							<div class=" flex flex-col gap-[1.28rem] w-full">
								<div class="lot-number">
									<label for="lot-number" class="block mb-2 text-sm">Lot number</label>
									<input
										type="text"
										name="lot-number"
										id="lot-number"
										placeholder="Enter lot number"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									<!-- {#if validationErrors?.email}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
								>
							{/if} -->
								</div>

								<div class="w-full">
									<label for="carcass_number" class="block mb-2 text-sm">Carcass number</label>
									<input
										type="text"
										name="carcass_number"
										id="carcass_number"
										placeholder="Enter carcass number"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									<!-- {#if validationErrors?.password}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.password}</sub
								>
							{/if} -->
								</div>
								<div class="w-full">
									<label for="abhd-number" class="block mb-2 text-sm">ABHD number</label>
									<input
										type="text"
										name="abhd-number"
										id="abhd-number"
										placeholder="Enter abhd number"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									<!-- {#if validationErrors?.password}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.password}</sub
								>
							{/if} -->
								</div>

								<div>
									<label for="ear-tag" class="block mb-2 text-sm">Ear tag</label>
									<input
										type="text"
										name="ear-tag"
										id="ear-tag"
										placeholder="Enter ear tag"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									<!-- {#if validationErrors?.email}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
								>
							{/if} -->
								</div>

								<div>
									<label for="date_of_slaughter" class="block mb-2 text-sm"
										>Date of slaughter <span class="text-destructive">*</span></label
									>
									<input
										type="text"
										name="date_of_slaughter"
										id="date_of_slaughter"
										placeholder="Enter slaughter date"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									<!-- {#if validationErrors?.email}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
								>
							{/if} -->
								</div>

								<div>
									<label for="date_received" class="block mb-2 text-sm"
										>Date received <span class="text-destructive text-base">*</span></label
									>
									<input
										type="text"
										name="date_received"
										id="date_received"
										placeholder="Enter date received"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									<!-- {#if validationErrors?.email}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
								>
							{/if} -->
								</div>

								<div>
									<label for="lairage-number" class="block mb-2 text-sm">Lairage number</label>
									<input
										type="text"
										name="lairage-number"
										id="lairage-number"
										placeholder="Enter lairage number"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									<!-- {#if validationErrors?.email}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
								>
							{/if} -->
								</div>
							</div>
						</Tabs.Content>
						<!-- Traceability -->

						<!-- Origin -->
						<Tabs.Content class="px-4 h-full mb-8  w-full " value="origin">
							<div class=" flex flex-col gap-[1.28rem] w-full">
								<div>
									<label for="origin-and-terrior" class="block mb-2 text-sm"
										>Origin and terrior</label
									>
									<input
										type="text"
										name="origin-and-terrior"
										id="origin-and-terrior"
										placeholder="Enter origin and terrior"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									<!-- {#if validationErrors?.email}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
								>
							{/if} -->
								</div>

								<div class="w-full">
									<label for="country" class="block mb-2 text-sm">Country of origin</label>
									<input
										type="text"
										name="country"
										id="country"
										placeholder="Enter country of origin"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									<!-- {#if validationErrors?.password}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.password}</sub
								>
							{/if} -->
								</div>

								<div>
									<label for="farm" class="block mb-2 text-sm">Farm</label>
									<input
										type="text"
										name="farm "
										id="farm "
										placeholder="Enter farm name"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									<!-- {#if validationErrors?.email}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
								>
							{/if} -->
								</div>
								<div>
									<label for="farm" class="block mb-2 text-sm">Farm</label>
									<input
										type="text"
										name="farm "
										id="farm "
										placeholder="Enter farm name"
										class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
									/>
									<!-- {#if validationErrors?.email}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
								>
							{/if} -->
								</div>
							</div>
						</Tabs.Content>
						<!-- Origin -->

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
