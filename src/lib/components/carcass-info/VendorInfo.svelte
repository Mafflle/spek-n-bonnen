<script lang="ts">
	export let vendorCode: string;
	export let vendorMoq: number;
	export let vendorMoqUnit: string;
	export let vendorItemName: string;
</script>

<div class="py-4 flex flex-col gap-4 w-full">
	<div class="flex justify-between">
		<div class="info text-grey-100">Vendor Code:</div>
		<div class="value text-left">{vendorCode}</div>
	</div>
	<div class="flex justify-between">
		<div class="info text-grey-100">Vendor Moq:</div>
		<div class="value text-left">{vendorMoq}</div>
	</div>
	<div class="flex justify-between">
		<div class="info text-grey-100">Vendor MOQ Unit:</div>
		<div class="value text-left">{vendorMoqUnit}</div>
	</div>
	<div class="flex justify-between">
		<div class="info text-grey-100">Vendor item name:</div>
		<div class="value text-left">{vendorItemName}</div>
	</div>
</div>
