<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Button } from '$lib/components/ui/button';
	import Separator from '../ui/separator/separator.svelte';
	import type { BatchAttr, typeObject } from '$lib/stores/product.stores';
	import { createEventDispatcher } from 'svelte';

	export let data: BatchAttr;
	export let showCreate: boolean = false;
	export let attributeId: string | number;

	const dispatch = createEventDispatcher();

	let displayedName = data.name ? data.name.trim().replace(/\s+/g, '_') : '';

	// Reactive statement to update displayedName whenever data.name changes
	$: if (data.name) {
		displayedName = data.name.trim().replace(/\s+/g, '_');
	} else {
		displayedName = '';
	}

	$: dispatch('updateAttribute', { id: attributeId, ...data });

	$: if (selectedType) {
		if (selectedType.value === 'multi-select' || selectedType.value === 'select') {
			data.choice_list = [];
		}
	}

	let dataTypes: typeObject[] = [
		{
			value: 'number',
			label: 'Number',
			icon: '<iconify-icon icon="arcticons:123" width="20"></iconify-icon>'
		},
		{
			value: 'text',
			label: 'String',
			icon: '<iconify-icon icon="codicon:symbol-string" width="20"></iconify-icon>'
		},
		{
			value: 'select',
			label: 'Boolean',
			icon: '<iconify-icon icon="tabler:toggle-right-filled"  width="20"></iconify-icon>'
		},
		{
			value: 'text',
			label: 'Date',
			icon: '<iconify-icon icon="formkit:date" width="20"></iconify-icon>'
		},
		{
			value: 'multi-select',
			label: 'Multiple choice',
			icon: '<iconify-icon icon="grommet-icons:radial-selected" width="20"></iconify-icon>'
		}
	];

	function handleCreateNew() {
		if (!data.name || !data.data_type) {
			return;
		}

		const parsedName = data.name.trim().replace(/\s+/g, '_');
		dispatch('createNew', { id: attributeId, ...data, name: parsedName }); // Dispatch the createNew event
	}

	let selectedType: typeObject;

	$: if (selectedType && selectedType.value) {
		data.data_type = selectedType.value;
	}
</script>

<div class=" h-full flex flex-col w-[523px] gap-2">
	<div
		class="flex flex-col gap-4 shadow px-5 pt-5 items-end w-full min-h-[166px] border-l-4 border-l-yellow-300 rounded"
	>
		<section class="grid gap-2 grid-cols-8 w-full">
			<div class="form-group w-full col-span-5">
				<label for="name" class="font-satoshi text-sm font-medium mb-1">Name</label>
				<input
					type="text"
					name="name"
					id="name"
					bind:value={data.name}
					placeholder="Enter name"
					class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
			</div>

			<div class="form-group w-full col-span-3">
				<label for="dataType" class="font-satoshi text-sm font-medium mb-1">Data type </label>
				<Select.Root bind:selected={selectedType}>
					<Select.Trigger class="border-[#D9D9D9] w-full flex items-center h-[45px]">
						<Select.Value class="text-gray-400" placeholder="Select data type" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{#each dataTypes as dataType}
								<Select.Item
									class="w-full py-2 pl-0 mb-1"
									value={dataType.value}
									label={dataType.label}
								>
									<div class="w-full flex items-start gap-2 px-3">
										<span class="text-[#9C9C9C]">
											{@html dataType.icon}
										</span>
										<span class="text-sm text-black-100">{dataType.label}</span>
									</div>
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
					<Select.Input name="dataType" />
				</Select.Root>
			</div>
		</section>
		<Separator class="w-full" />
		<section class="flex justify-end gap-5 items-center">
			<button type="button" on:click={() => dispatch('delete', attributeId)}>
				<iconify-icon class="text-grey-200" icon="lucide:trash-2"></iconify-icon>
			</button>
			<Separator orientation="vertical" class="h-5 border-1" />
			<div class="flex items-center gap-2">
				<span class="text-xs">Required</span>
				<Switch bind:checked={data.is_required} />
			</div>
		</section>
	</div>

	{#if showCreate}
		<Button
			disabled={!data.name || !data.data_type}
			on:click={handleCreateNew}
			class="w-fit pl-0 text-grey-200 flex gap-1 items-center"
		>
			<iconify-icon width="20" icon="iconoir:plus-circle"></iconify-icon>
			<span> Create new </span>
		</Button>
	{/if}
</div>
