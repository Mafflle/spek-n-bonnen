<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Selector from '$lib/components/Selector.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { GroupEnum, MainGroups, VAT } from '$lib/stores';
	import { showToast } from '$lib/utils';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { slide } from 'svelte/transition';

	const VAT_Options = [
		{
			value: VAT.one,
			label: '1'
		},
		{
			value: VAT.two,
			label: '2'
		},
		{
			value: VAT.three,
			label: '3'
		},
		{
			value: VAT.four,
			label: '4'
		}
	];

	const traceability_Options = [
		{
			value: GroupEnum.AUTO,
			label: GroupEnum.AUTO
		},
		{
			value: GroupEnum.MANUAL,
			label: GroupEnum.MANUAL
		}
	];

	let loading: boolean = false;
	let validationErrors: any = {};

	const submit: SubmitFunction = async () => {
		loading = true;
		return async ({ update, result }) => {
			try {
				if (result.status === 200 && result.data) {
					const group = result.data.newGroup;
					$MainGroups = [group, ...$MainGroups];
					showToast('New group added successfully', 'success');
					await goto('/inventory/main-groups');
				} else if (result.status === 400) {
					// console.log(result);
					showToast(`${result.data.message}`, 'error');

					validationErrors = result.data.errors;
				}
			} finally {
				update();
				loading = false;
			}
		};
	};

	// console.log(VAT);
</script>

<div class="">
	<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<h2 class="text-3xl font-semibold">
				<!-- {currCarcassId ? `Edit carcass #${currCarcassId}` : 'Add carcass'}
         -->
				Add main group
			</h2>
			<sub class="text-[#6B6B6B] text-sm">Inventory / Main groups / manage</sub>
		</div>
	</div>
	<Separator class="my-8 md:block hidden" />
	<form use:enhance={submit} method="post" action="?/manage-groups" class="w-full">
		<section
			class="  flex flex-col md:flex-row md:justify-between items-start md:h-[680px] min-h-auto sticky top-0 justify-center text-sm w-full lg:gap-10"
		>
			<section class="flex flex-col gap-8 w-full">
				<div class="form-group">
					<label for="name" class="block mb-2 text-sm">Name</label>
					<input
						disabled={loading}
						type="text"
						name="name"
						placeholder="Enter group name"
						class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.name}
						<div class="flex flex-col items-start gap-1">
							{#each validationErrors.name as error}
								<sub transition:slide={{ delay: 250, duration: 300 }} class="text-rose-500 text-xs"
									>{error}</sub
								>
							{/each}
						</div>
					{/if}
				</div>
				<div class="form-group">
					<label for="department" class="block mb-2 text-sm">Department</label>
					<input
						disabled={loading}
						type="text"
						name="department"
						placeholder="Enter department"
						class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.department}
						<div class="flex flex-col items-start gap-1">
							{#each validationErrors.department as error}
								<sub transition:slide={{ delay: 250, duration: 300 }} class="text-rose-500 text-xs"
									>{error}</sub
								>
							{/each}
						</div>
					{/if}
				</div>
				<div class="form-group">
					<label for="vat" class="block mb-2 text-sm">VAT</label>
					<Selector placeholder="Select VAT" inputName="vat" options={VAT_Options} />
					{#if validationErrors?.vat}
						<div class="flex flex-col items-start gap-1">
							{#each validationErrors.vat as error}
								<sub transition:slide={{ delay: 250, duration: 300 }} class="text-rose-500 text-xs"
									>{error}</sub
								>
							{/each}
						</div>
					{/if}
				</div>
				<div class="form-group">
					<label for="color" class="block mb-2 text-sm">Color</label>
					<input
						disabled={loading}
						type="color"
						accept="hex"
						name="color"
						placeholder="Enter color"
						class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.color}
						<div class="flex flex-col items-start gap-1">
							{#each validationErrors.color as error}
								<sub transition:slide={{ delay: 250, duration: 300 }} class="text-rose-500 text-xs"
									>{error}</sub
								>
							{/each}
						</div>
					{/if}
				</div>
			</section>
			<Separator orientation="vertical" class="" />
			<section class="flex flex-col gap-8 w-full">
				<div class="form-group">
					<label for="traceability" class="block mb-2 text-sm">Traceability</label>
					<Selector
						placeholder="Select traceability type"
						options={traceability_Options}
						inputName="traceability"
					/>
					{#if validationErrors?.traceability}
						<div class="flex flex-col items-start gap-1">
							{#each validationErrors.traceability as error}
								<sub transition:slide={{ delay: 250, duration: 300 }} class="text-rose-500 text-xs"
									>{error}</sub
								>
							{/each}
						</div>
					{/if}
				</div>
				<div class="form-group">
					<label for="traceability_scenario" class="block mb-2 text-sm">Traceability scenario</label
					>
					<input
						disabled={loading}
						type="text"
						name="traceability_scenario"
						placeholder="Enter traceability scenario"
						class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.traceability_scenario}
						<div class="flex flex-col items-start gap-1">
							{#each validationErrors.traceability_scenario as error}
								<sub transition:slide={{ delay: 250, duration: 300 }} class="text-rose-500 text-xs"
									>{error}</sub
								>
							{/each}
						</div>
					{/if}
				</div>
				<div class="w-full items-center justify-end flex">
					<button
						disabled={loading}
						type="submit"
						class="px-3 py-2 min-w-[100px] bg-primary-100 text-sm text-white rounded-md flex items-center justify-center gap-1"
					>
						{#if loading}
							<iconify-icon icon="line-md:loading-loop" width="25"></iconify-icon>
						{:else}
							<span class="">Add main group</span>
						{/if}
					</button>
				</div>
			</section>
		</section>
	</form>
</div>
