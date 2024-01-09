<script lang="ts">
	const tabs = [{ name: 'Gallery' }, { name: 'Trash' }, { name: 'Archive' }];
	let selectedTab = tabs.find((tab) => tab.name === 'Gallery');

	function selectTab(tab: { name: string } | undefined) {
		selectedTab = tab;
	}
</script>

<div class="w-[1145px] flex flex-col items-start rounded-md bg-white">
	<div class="title flex h-24 px-5 items-center gap-3 self-stretch border-b-2 border-grey-300">
		<div class="text-black-100 text-3xl font-bold tracking-[-0.64px]">Media manager</div>
	</div>
	<div class="content flex items-start">
		<div
			class="tabs flex py-10 gap-4 flex-col items-start flex-[1 0 0] items-stretch bg-[#F5F5F5] w-40"
		>
			{#each tabs as tab}
				<button class="tab flex py-3 px-5 self-stretch" on:click={() => selectTab(tab)}>
					<div class="tab-item text-grey-100 text-base font-medium leading-6 tracking-[-0.64px]">
						{tab.name}
					</div>
				</button>
			{/each}
		</div>
		<div class="content flex w-[961px] px-8 pt-8 pb-16 flex-col justify-center items-start">
			<div class="flex flex-col justify-center gap-8">
				<div class="modal-input">
					<div
						class="flex items-center w-[24em] border gap-2 rounded-md border-[#D9D9D9] text-[#232222] px-2"
					>
						<span>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
									stroke="#A9A9A9"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M21 20.9999L16.65 16.6499"
									stroke="#A9A9A9"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</span>
						<input type="text" placeholder="Type here" class=" py-2 flex-auto outline-none" />
					</div>
				</div>
				<div class="modal-content">
					{#if selectedTab}
						{selectedTab.name} content
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
