<script lang="ts">
	export let name: string;
	export let id: number;
	export let permissions: [
		{ codename?: string; content_type?: number; id?: number; name?: string }
	];
</script>

<tr class="border-b border-[#D9D9D9]">
	<td>
		<div class="   justify-start items-center gap-3 inline-flex">
			<span class="grow shrink basis-0 text-[#6B6B6B] text-sm font-medium">
				{name}
			</span>
		</div>
	</td>
	<td>
		<div
			class="w-[124px] h-6 px-1 bg-stone-50 rounded-[20px] justify-start items-center gap-2.5 inline-flex"
		>
			<span class="grow shrink basis-0 text-center text-[#6B6B6B] text-[13px] font-medium">
				{id}
			</span>
		</div>
	</td>
	<td class="text-[#9C9C9C] flex gap-2">
		{#each permissions as permission}
			<div
				class="h-6 px-1 bg-stone-50 rounded-[20px] justify-start items-center gap-2.5 inline-flex text-[#6B6B6B]"
			>
				{permission.codename}
			</div>
		{/each}
	</td>
	<td>
		<button class=" px-1.5 flex justify-center items-center gap-2.5">
			<iconify-icon icon="pepicons-pencil:dots-y" style="color: #6b6b6b;" width="30"></iconify-icon>
		</button>
	</td>
</tr>
