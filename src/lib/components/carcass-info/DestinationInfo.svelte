<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';

	export let slaughterHouse: {
		name: string;
		address?: string;
	};
	export let butcherShop: {
		name: string;
		address?: string;
	};
	export let vendorMoqUnit: string;
	export let fatScore: number;
	export let conformation: string;
</script>

<div class="py-4 flex flex-col gap-4 w-full">
	<div class="flex justify-between">
		<div class="info text-grey-100">Slaughter house:</div>

		<Tooltip.Root>
			<Tooltip.Trigger><div class="value text-left">{slaughterHouse.name}</div></Tooltip.Trigger>
			<Tooltip.Content>
				<h3 class="text-grey-100 text-1xl text-bold">Name</h3>
				<div class="text-lg">
					{slaughterHouse.name}
				</div>
				{#if slaughterHouse.address}
					<h3 class="text-grey-100 text-1xl text-bold">Address</h3>
					<div class="text-lg">
						{slaughterHouse.address}
					</div>
				{/if}
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
	<div class="flex justify-between">
		<div class="info text-grey-100">Butcher shop:</div>

		<Tooltip.Root>
			<Tooltip.Trigger><div class="value text-left">{butcherShop.name}</div></Tooltip.Trigger>
			<Tooltip.Content>
				<h3 class="text-grey-100 text-1xl text-bold">Name</h3>
				<div class="text-lg">
					{butcherShop.name}
				</div>
				{#if butcherShop.address}
					<h3 class="text-grey-100 text-1xl text-bold">Address</h3>
					<div class="text-lg">
						{butcherShop.address}
					</div>
				{/if}
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
</div>
