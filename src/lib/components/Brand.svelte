<script lang="ts">
	export let name: string;
	export let date: string;
</script>

<tr class="border-b border-[#D9D9D9]">
	<td>
		<div class="   justify-start items-center gap-3 inline-flex">
			<div class="w-[38px] h-[38px] bg-neutral-100 rounded-full"></div>
			<span class="grow shrink basis-0 text-[#6B6B6B] text-sm font-medium">
				{name}
			</span>
		</div>
	</td>
	<td class="text-[#9C9C9C]">{date}</td>
	<td>
		<button class=" px-1.5 flex justify-center items-center gap-2.5">
			<iconify-icon icon="pepicons-pencil:dots-y" style="color: #6b6b6b;" width="30"></iconify-icon>
		</button>
	</td>
</tr>
