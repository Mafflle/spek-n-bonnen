<script lang="ts">
	export let weight: string;
	export let coldWeight: string;
	export let sexCategory: string;
	export let fatScore: number;
	export let conformation: string;
</script>

<div class="py-4 flex flex-col gap-4 w-full">
	<div class="flex justify-between">
		<div class="info text-grey-100">Weight:</div>
		<div class="value text-left">{weight}</div>
	</div>
	<div class="flex justify-between">
		<div class="info text-grey-100">Cold weight:</div>
		<div class="value text-left">{coldWeight}</div>
	</div>
	<div class="flex justify-between">
		<div class="info text-grey-100">Sex category:</div>
		<div class="value text-left">{sexCategory}</div>
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
