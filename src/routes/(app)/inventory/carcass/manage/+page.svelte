<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import * as Tabs from '$lib/components/ui/tabs';
</script>

<svelte:head>
	<title>Manage carcass - Spek-N-Boonen</title>
</svelte:head>

<div class="w-full">
	<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<h2 class="text-3xl font-semibold">Add carcass</h2>
			<sub class="text-[#6B6B6B] text-sm"> Carcass / manage</sub>
		</div>
	</div>
	<Separator class="my-8" />
	<section>
		<form action="" class="max-h-full overflow-hidden flex w-full gap-5">
			<section class="max-h-[450px] w-full h-full overflow-y-scroll no-scrollbar">
				<div class="mb-8">
					<h3 class="text-sm font-satoshi text-grey-200 capitalize mb-5">PROVIDERS</h3>
					<div class=" flex flex-col gap-[1.28rem] w-full">
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
			<Separator orientation="vertical" class="" />
			<section class="flex flex-col items-start w-full">
				<h3 class="text-sm font-satoshi text-grey-200 capitalize mb-5">MORE DETAILS</h3>
				<Tabs.Root value="physical-info" class="w-full">
					<Tabs.List class="">
						<Tabs.Trigger value="physical-info">Physical information</Tabs.Trigger>
						<Tabs.Trigger value="vendor">Vendor</Tabs.Trigger>
						<Tabs.Trigger value="traceability">Traceability</Tabs.Trigger>
						<Tabs.Trigger value="origin">Origin</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="physical-info">
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

							<div>
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
				</Tabs.Root>
			</section>
		</form>
	</section>
</div>
