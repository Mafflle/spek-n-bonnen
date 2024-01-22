<script lang="ts">
</script>

<svelte:head>
	<title>Carcass - Spek-N-Boonen</title>
</svelte:head>

<div class="w-full">
	<div class="manage flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<h2 class="text-3xl font-semibold">Carcass</h2>
			<sub class="text-[#6B6B6B] text-sm"> Providers / Carcass</sub>
		</div>
		<div class="filters flex items-center w-full justify-between">
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
				<input
					type="text"
					placeholder="Search for carcass..."
					class=" py-2 flex-auto outline-none"
				/>
			</div>

			<a
				href="carcass/manage"
				class="px-3 py-2 bg-primary-100 text-sm text-white rounded-md flex items-center gap-1"
			>
				<span>Add carcass</span>
				<img src="/icons/plus.svg" alt="Plus icon to represent adding" /></a
			>
		</div>
	</div>
</div>
