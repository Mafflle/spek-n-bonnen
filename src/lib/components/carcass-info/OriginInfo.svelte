<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';

	export let originAndTerrior: string;
	export let countryOfOrigin: string;
	export let farm: {
		name: string;
		address?: string;
	};
</script>

<div class="py-4 flex flex-col gap-4 w-full">
	<div class="flex justify-between">
		<div class="info text-grey-100">Origin and terriot:</div>
		<div class="value text-left">{originAndTerrior}</div>
	</div>
	<div class="flex justify-between">
		<div class="info text-grey-100">Country of origin:</div>
		<div class="value text-left">{countryOfOrigin}</div>
	</div>
	<div class="flex justify-between">
		<div class="info text-grey-100">Farm:</div>
		<Tooltip.Root>
			<Tooltip.Trigger><div class="value text-left">{farm.name}</div></Tooltip.Trigger>
			<Tooltip.Content>
				<h3 class="text-grey-100 text-1xl text-bold">Name</h3>
				<div class="text-lg">
					{farm.name}
				</div>
				{#if farm.address}
					<h3 class="text-grey-100 text-1xl text-bold">Address</h3>
					<div class="text-lg">
						{farm.address}
					</div>
				{/if}
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
</div>
