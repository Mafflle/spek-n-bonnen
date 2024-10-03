<script lang="ts">
	let overProfile = false;
</script>

<div class="sticky top-0 flex h-14 w-full items-center bg-white">
	<div class="flex w-full items-center justify-between px-6 py-1.5">
		<div
			class="flex h-8 min-w-[380px] items-center gap-2 rounded border border-grey-200 px-3 py-1.5"
		>
			<span class="h-5 w-5"
				><img class="h-full w-full" src="/icons/search-normal.svg" alt="search icon" /></span
			>
			<input
				class="h-full w-full placeholder:text-xs placeholder:font-medium placeholder:text-grey-special focus:outline-none"
				placeholder="Search anything"
				type="text"
				name=""
				id=""
			/>
		</div>
		<section class="flex items-center gap-4">
			<span class="h-5 w-5">
				<img src="/icons/notification.svg" alt="bell icon" />
			</span>
			<button
				on:mouseenter={() => (overProfile = !overProfile)}
				on:mouseleave={() => (overProfile = !overProfile)}
				class="flex h-10 w-16 items-center gap-1 rounded-full border border-grey-200 bg-grey-bg px-1"
			>
				<span class="h-8 w-full"
					><img src="/icons/avatar.svg" class="h-full w-full" alt="user avatar" /></span
				>

				<span class="flex {overProfile ? 'text-primary' : 'text-grey-special'}">
					<iconify-icon width="20" icon="system-uicons:chevron-down"></iconify-icon>
				</span>
			</button>
		</section>
	</div>
</div>
