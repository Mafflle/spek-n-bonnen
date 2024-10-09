<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import Dropdown from '$components/Dropdown.svelte';
	import DropdownContent from '$components/DropdownContent.svelte';

	import Link from './Link.svelte';

	export let route: SidenavLink;

	interface SidenavLink {
		name: string;
		icon?: string;
		link: string;
		activeIcon?: string;
		children?: SidenavLink[];
	}

	let showChildren = false;
	let isActive = false;

	$: if ($page.url.pathname === '/' && route.link === '/') {
		isActive = true;
	} else if ($page.url.pathname.startsWith(route.link) && route.link !== '/') {
		isActive = true;
		if (route.children) {
			showChildren = true;
		}
	} else {
		isActive = false;
	}

	if (!isActive) {
		showChildren = false;
	}
</script>

{#if route.children}
	<Dropdown
		on:toggledDropdown={(e) => (showChildren = e.detail)}
		bind:open={showChildren}
		class="relative"
	>
		<li
			class:active-link={isActive}
			class=" flex w-full rounded text-grey-100 hover:bg-black"
			slot="dropdown-trigger"
		>
			<span class="flex h-full w-full items-center gap-2 rounded px-2 py-1.5">
				<span class="h-5 w-5">
					<img
						src={isActive ? route.activeIcon : route.icon}
						class="h-full w-full"
						alt="{route.name} icon"
					/>
				</span>
				<span class=" text-sm font-medium">{route.name}</span>
			</span>
			<span class="flex h-7 w-7" class:rotate={showChildren}>
				<img src="/icons/caret-down.svg" class="h-full w-full" alt="Caret down icon" />
			</span>
		</li>

		<svelte:fragment slot="dropdown-content">
			<DropdownContent bind:isOpen={showChildren}>
				<svelte:fragment slot="dropdown-items">
					<ul class="children-container relative mt-2 grid grid-cols-1 gap-1">
						{#each route.children as child}
							<li class="relative flex items-start text-xs">
								<Link route={child} />
							</li>
						{/each}
					</ul>
				</svelte:fragment>
			</DropdownContent>
		</svelte:fragment>
	</Dropdown>
{:else}
	<li class:active-link={isActive} class="flex items-center text-sm">
		<Link {route} />
		<!-- <a class="flex h-full w-full items-center gap-2 rounded px-2 py-1.5 text-grey-100" href={route.link}>
			<span class="h-5 w-5">
				<img src={isActive ? route.activeIcon : route.icon} class="h-full w-full" alt="" />
			</span>

			<span class=" text-sm font-medium">{route.name}</span>
		</a> -->
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

	.active-link {
		background: linear-gradient(180deg, #373737 0%, rgba(30, 30, 30, 0.78) 100%);
		border: 1px solid #505050;
		color: white;
	}
</style>
