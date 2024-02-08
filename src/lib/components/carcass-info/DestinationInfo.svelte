<script lang="ts">
	export let slaughterHouse: string;
	export let butcherShop: string;
	export let vendorMoqUnit: string;
	export let fatScore: number;
	export let conformation: string;
</script>

<div class="py-4 flex flex-col gap-4 w-full">
	<div class="flex justify-between">
		<div class="info text-grey-100">Slaughter house:</div>
		<div class="value text-left">{slaughterHouse}</div>
	</div>
	<div class="flex justify-between">
		<div class="info text-grey-100">Butcher shop:</div>
		<div class="value text-left">{butcherShop}</div>
	</div>
	<div class="flex justify-between">
		<div class="info text-grey-100">Vendor MOQ Unit:</div>
		<div class="value text-left">{vendorMoqUnit}</div>
	</div>
	<div class="flex justify-between">
		<div class="info text-grey-100">Fat score:</div>
		<div class="value text-left">{fatScore}</div>
	</div>
	<div class="flex justify-between">
		<div class="info text-grey-100">Conformation:</div>
		<div class="value text-left">{conformation}</div>
	</div>
</div>
