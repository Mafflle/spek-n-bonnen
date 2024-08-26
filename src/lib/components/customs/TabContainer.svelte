<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { SvelteComponent } from 'svelte';
	import TabController from './TabController.svelte';
	import TabContent from './TabContent.svelte';
	import { currentUser } from '$lib/user';

	const dispatch = createEventDispatcher();

	interface Tab {
		title: string;
		id: string;
		component: typeof SvelteComponent;
		props?: Record<string, any>;
	}

	export let tabs: Tab[];

	let selectedTab = tabs[0].id;

	function handleTabClick(index: number) {
		selectedTab = tabs[index].id;
	}
</script>

<section
	aria-label="User Profile with Tabs"
	class="w-full lg:w-[100%] xl:w-[70%] max-w-full flex flex-col gap-3"
>
	<TabController bind:selectedTab {tabs} on:tabChange={(e) => handleTabClick(e.detail)} />

	<div
		class="tabs-container overflow-hidden flex items-center justify-end max-w-full h-full w-full"
	>
		<div class="max-w-[75%] xl:max-w-[780px] w-full h-full">
			{#each tabs as tab}
				<TabContent {tab} {selectedTab}>
					<svelte:component
						this={tab.component}
						{...tab.props}
						on:updatedProfile={(e) => {
							if ($currentUser?.staff_profile) {
								$currentUser.staff_profile = e.detail.profile;
							}
						}}
					/>
				</TabContent>
			{/each}
		</div>
	</div>
</section>
