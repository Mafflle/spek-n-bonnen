<script lang="ts">
	export let name: string;
	export let date: string;
	export let grid: boolean;
</script>

{#if grid}
	<div
		class="w-full brand flex flex-col items-start gap-3 pb-2 rounded-t-xl border-[0.5px] border-grey-300"
	>
		<div class="brand-image h-32 self-stretch rounded-t-xl bg-[#f9f9f9]"></div>
		<div class="brand-info flex w-full py-2 px-3 flex-col items-start gap-2 flex-[1 0 0]">
			<div class="brand-name text-base font-medium">
				{name}
			</div>
			<div class="date-added flex items-center gap-2 self-stretch">
				<div class="date-icon">
					<img src="/icons/clock.svg" alt="clock icon" />
				</div>
				<div class="date text-xs flex-[1 0 0]">
					Added {date} months ago
				</div>
			</div>
		</div>
	</div>
{:else}
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
				<iconify-icon icon="pepicons-pencil:dots-y" style="color: #6b6b6b;" width="30"
				></iconify-icon>
			</button>
		</td>
	</tr>
{/if}
