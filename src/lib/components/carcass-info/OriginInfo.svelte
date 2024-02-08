<script lang="ts">
	export let originAndTerrior: string;
	export let countryOfOrigin: string;
	export let farm: string;
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
		<div class="value text-left">{farm}</div>
	</div>
</div>
