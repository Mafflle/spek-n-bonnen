<script lang="ts">
	import Dropdown from '$components/Dropdown.svelte';
	import DropdownContent from '$components/DropdownContent.svelte';

	interface SidenavLink {
		name: string;
		icon: string;
		link: string;
		children?: SidenavLink[];
	}
	export let route: SidenavLink;

	let showChildren = false;
</script>

{#if route.children}
	<Dropdown class="relative" tiggerStyle="hover:bg-black" bind:open={showChildren}>
		<svelte:fragment slot="dropdown-trigger">
			<span class="flex h-full w-full items-center gap-2 rounded px-2 py-1.5">
				<span class="h-5 w-5">
					<img src={route.icon} class="h-full w-full" alt="home icon" />
				</span>
				<span class=" text-sm font-medium text-grey-100">{route.name}</span>
			</span>
		</svelte:fragment>

		<svelte:fragment slot="dropdown-content">
			<DropdownContent bind:isOpen={showChildren}>
				<svelte:fragment slot="dropdown-items">
					<ul class="children-container relative mt-2 grid grid-cols-1">
						{#each route.children as child}
							<li class="relative flex items-start rounded px-2 py-1 hover:bg-black">
								<a href="/">
									<span class="text-xs font-medium text-grey-100">{child.name}</span>
								</a>
							</li>
						{/each}
					</ul>
				</svelte:fragment>
			</DropdownContent>
		</svelte:fragment>
	</Dropdown>
{:else}
	<li class="h-full w-full rounded hover:bg-black">
		<a class="flex h-full w-full items-center gap-2 rounded px-2 py-1.5" href={route.link}>
			<span class="h-5 w-5">
				<img src={route.icon} class="h-full w-full" alt="home icon" />
			</span>
			<span class=" text-sm font-medium text-grey-100">{route.name}</span>
		</a>
	</li>
{/if}

<style>
	.children-container::before {
		content: '';
		position: absolute;
		height: 70%;
		left: -1.7rem;
		top: 0;

		border: 1px solid #505050;
	}

	.children-container > li::before {
		content: '';

		position: absolute;
		height: 70%;
		top: -0.4rem;
		left: -26.9px;
		width: 1.4rem;
		border-left: 2px solid #505050;
		border-bottom: 2px solid #505050;
		border-bottom-left-radius: 0.6rem;
	}
</style>
