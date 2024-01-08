<script lang="ts">
	export let name: string;
	export let date: string;
</script>

<div
	class="w-full brand flex flex-col items-start gap-3 rounded-t-xl border-[0.5px] border-grey-300"
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
