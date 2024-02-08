<script lang="ts">
	export let lotNumber: string;
	export let abhdCode: string;
	export let earTag: string;
	export let lairageNumber: string | null = 'null';
</script>

<div class="py-4 flex flex-col gap-4 w-full">
	<div class="flex justify-between">
		<div class="info text-grey-100">Lot number:</div>
		<div class="value text-left">{lotNumber}</div>
	</div>
	<div class="flex justify-between">
		<div class="info text-grey-100">ABHD code:</div>
		<div class="value text-left">{abhdCode}</div>
	</div>
	<div class="flex justify-between">
		<div class="info text-grey-100">Ear tag:</div>
		<div class="value text-left">{earTag}</div>
	</div>
	{#if lairageNumber != 'null'}
		<div class="flex justify-between">
			<div class="info text-grey-100">Lairage number:</div>
			<div class="value text-left">{lairageNumber}</div>
		</div>
	{/if}
</div>
