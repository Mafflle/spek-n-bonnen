<script lang="ts">
	import { currentUser } from '$lib/user';
	import { onMount } from 'svelte';

	import { createEventDispatcher } from 'svelte';

	export let tabs: { title: string; id: string }[];
	export let selectedTab: string;
	const dispatch = createEventDispatcher();
	let tabList: HTMLDivElement;

	onMount(() => {
		tabList.querySelector('button')?.focus();
	});

	function handleTabClick(index: number) {
		tabList.querySelector(`button:nth-child(${index + 1})`)?.focus();
	}
	$: console.log(selectedTab);
</script>

<div
	class="staff_profile-tab-controls h-24 xl:h-[118px] w-full bg-[#F7F7F7] flex items-center xl:space-x-6 rounded-[8px] px-6 lg:px-8 xl:px-10 relative z-20"
>
	<div
		class="staff_profile-section border-white border-[8px] shadow-sm lg:border-[10px] rounded-full relative -bottom-[50%]"
	>
		<img
			src={$currentUser?.staff_profile?.profile_picture?.image ?? '/icons/human.jpg'}
			loading="eager"
			alt="User's Profile avatar"
			class="staff_profile-picture xl:w-40 xl:h-40 lg:w-36 lg:h-36 w-28 h-28 rounded-full object-cover"
		/>
	</div>

	<div
		role="tablist"
		aria-label="Tabs"
		class="tab-list flex items-center justify-center flex-1 space-x-2 xl:space-x-4"
		bind:this={tabList}
	>
		{#each tabs as tab, index}
			<button
				role="tab"
				aria-selected={selectedTab === tab.id}
				aria-controls={`tabpanel-${index}`}
				id={`tab-${index}`}
				on:click={() => {
					handleTabClick(index);
					dispatch('tabChange', index);
				}}
				class="tab-button focus:outline-none relative py-2 px-6 xl:px-8 h-[34px] text-sm font-medium text-grey-200 {selectedTab ===
				tab.id
					? 'bg-white rounded border-[#FCFCFC] border-[0.5px] active-tab'
					: ''}"
			>
				{tab.title}
			</button>
		{/each}
	</div>
</div>

<style>
	.active-tab {
		box-shadow: 0px 4px 10px 0px #0000000a;
	}
</style>
