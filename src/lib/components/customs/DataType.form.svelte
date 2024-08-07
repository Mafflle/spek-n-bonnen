<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import ProductType from '../ProductType.svelte';
	import { Button } from '$lib/components/ui/button';

	let dataTypes = [{}];
</script>

<div class="w-full h-full flex justify-center">
	<form
		method=""
		action=""
		class="flex flex-col justify-between items-end gap-6 w-[523px] min-h-full"
	>
		<ProductType />

		<Button
			type="submit"
			class="flex  bg-primary-red gap-2 items-center font-satoshi text-sm font-bold text-white py-2.5 px-3 rounded-md hover:bg-primary-100"
		>
			Create product type
		</Button>
	</form>
</div>
