<script lang="ts">
	import { page } from '$app/stores';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Button from './ui/button/button.svelte';
	import * as Menubar from '$lib/components/ui/menubar';
	import { currentUser } from '$lib/user';

	export let hidden: boolean;
	export let route: any;
	export let alert: boolean = false;
	export let active: boolean = false;
	let childActive: boolean = false;
	let showChildren: boolean = false;

	const toggleChildren = () => {
		showChildren = !showChildren;
	};

	let keepOpen = false;

	function checkIfChildActive() {
		if (route && route?.children) {
			if (route.children.length > 0) {
				route.children.map((child) => {
					if (child.href === $page.url.pathname) {
						keepOpen = true;
						return;
					}
				});
			} else {
				return (keepOpen = false);
			}
		} else keepOpen = false;
	}

	// console.log(checkIfPermissionsMatch());

	if ($currentUser?.is_superuser) {
		hidden = false;
	}

	function check(permission: string, userPermissions = $currentUser?.groups) {
		if (permission && !$currentUser?.is_superuser) {
			for (let i = 0; i < userPermissions.length; i++) {
				let currRole = userPermissions[i];
				for (let x = 0; x < currRole?.permissions.length; x++) {
					let currPermission = currRole?.permissions[x];
					if (currPermission?.codename === permission) {
						return false;
					}
				}
			}
			return true;
		} else {
			return false;
		}
	}
	checkIfChildActive();
</script>

{#if route}
	<li class=" {check(route.permission) ? 'hidden' : 'w-full'}">
		{#if route.children && route.children.length > 0}
			<Collapsible.Root
				onOpenChange={checkIfChildActive}
				bind:open={keepOpen}
				class="md:w-full lg:flex hidden items-start flex-col "
			>
				<Collapsible.Trigger class="" asChild let:builder>
					<span
						on:mouseenter={() => {
							if ($page.url.pathname === route.href && active === true) active = false;
						}}
						on:mouseleave={() => {
							if ($page.url.pathname === route.href && active === false) active = true;
						}}
						class="flex w-full md:w-full items-center text-grey-200 px-3 py-1 justify-around rounded-md
		hover:bg-grey-200 hover:text-white hover:shadow-inner {active &&
							'bg-primary-light text-primary-red'}
		"
					>
						<span class="side-nav-button w-full text-inherit flex items-center justify-between">
							<div class="button-content flex items-center gap-2.5 self-stretch">
								<span class="test-inherit">{@html active ? route.activeIcon : route.icon}</span>
								<span
									class="button-text {active &&
										'text-primary-red'} hidden md:flex flex-col justify-center flex-shrink-0 self-stretch text-sm"
								>
									{route.pageTitle}
								</span>
							</div>
							{#if alert}
								<div
									class="button-alert flex w-[1.875rem] py-[0.1875rem] px-[0.625rem] flex-col justify-center items-center gap-[0.625rem] self-stretch
		rounded-[1.875rem] bg-[#FF1C0D]
		"
								>
									<span class="alert-text text-white text-xs font-bold">4</span>
								</div>
							{/if}
						</span>

						<Button
							builders={[builder]}
							class="flex items-center justify-center p-0 {active && 'text-black-100'}"
						>
							<img src="/icons/Chevron down.svg" alt="arrow down icon" />
							<span class="sr-only">Toggle</span></Button
						>
					</span>
				</Collapsible.Trigger>

				<Collapsible.Content class="py-2 pl-1 w-full">
					<ul class="ml-4 w-full border-l-[1.5px] border-white">
						<div class="flex flex-col w-full gap-3 px-2 justify-between">
							{#each route?.children as child}
								{#if child.childRoutes}
									<Collapsible.Root>
										<Collapsible.Trigger asChild let:builder>
											<Button
												builders={[builder]}
												class="flex items-center justify-between py-2 px-3 text-xs w-full "
											>
												<span>{child.title}</span>
												<iconify-icon icon="iconamoon:arrow-up-2-fill" width="15" rotate="90deg"
												></iconify-icon>
											</Button>
										</Collapsible.Trigger>
										<Collapsible.Content>
											<ul class="ml-4 w-full border-l border-grey-200 pl-2">
												{#each child.childRoutes as route}
													<a
														class="py-2 w-full {childActive &&
															'bg-primary-light text-primary-red shadow-inner'}
											 px-3 rounded-sm flex gap-3 hover:bg-primary-light hover:text-primary-red"
														href={route.href}
													>
														<span class="item-title font-medium text-xs">{route.title}</span>
													</a>
												{/each}
											</ul>
										</Collapsible.Content>
									</Collapsible.Root>
								{:else}
									<a
										class=" py-2 w-full text-grey-200 {$page.url.pathname === child.href &&
											'bg-primary-light text-primary-red shadow-inner'}
											 px-3 rounded-sm {check(child.permission)
											? 'hidden'
											: 'flex'} gap-3 hover:bg-primary-light hover:text-primary-red"
										href={child.href}
									>
										<span class="item-title font-medium text-sm">{child.title}</span>
									</a>
								{/if}
							{/each}
						</div>
					</ul>
				</Collapsible.Content>
			</Collapsible.Root>
			<Menubar.Root
				class="flex  p-0 md:justify-start justify-center m-0 w-fit lg:hidden	border-0 space-x-0    "
			>
				<Menubar.Menu>
					<Menubar.Trigger
						class="p-0 space-x-0 w-full flex items-center justify-center rounded-full {active &&
							'bg-primary-light text-primary-red'} w-8 h-8"
					>
						<a
							on:mouseenter={() => {
								if ($page.url.pathname === route.href && active === true) active = false;
							}}
							on:mouseleave={() => {
								if ($page.url.pathname === route.href && active === false) active = true;
							}}
							class="flex items-center justify-center rounded-md
	  md:hover:shadow-inner md:p-3
	"
							href={route.href}
						>
							<span class="side-nav-button w-full flex items-center justify-center">
								<div class="button-content flex items-center justify-center">
									<span>{@html active ? route.activeIcon : route.icon}</span>
									<span
										class="button-text hidden lg:flex flex-col justify-center flex-shrink-0 self-stretch text-sm"
									>
										{route.pageTitle}
									</span>
								</div>
								{#if alert}
									<div
										class="button-alert flex w-[1.875rem] py-[0.1875rem] px-[0.625rem] flex-col justify-center items-center gap-[0.625rem] self-stretch
	rounded-[1.875rem] bg-[#FF1C0D]
	"
									>
										<span class="alert-text text-white text-xs font-bold">4</span>
									</div>
								{/if}
							</span>
						</a>
					</Menubar.Trigger>

					<Menubar.Content class="bg-black-100 text-white flex flex-col">
						{#each route?.children as child}
							{#if child.childRoutes}
								<Menubar.Sub>
									<Menubar.SubTrigger
										class="{check(child.permission) && !$currentUser?.is_superuser
											? 'hidden'
											: 'block'} text-xs font-semibold"
									>
										<span class="p-2">{child.title}</span>
									</Menubar.SubTrigger>
									<Menubar.SubContent
										class="flex flex-col  justify-between bg-black-100 text-white"
									>
										{#each child.childRoutes as route}
											<Menubar.Item class="">
												<a
													class="p-2 {childActive && ' text-primary-red shadow-inner'}
												  rounded-md flex gap-3 hover:text-primary-red"
													href={route.href}
												>
													<div class="item-title font-medium text-xs">{route.title}</div>
												</a>
											</Menubar.Item>
										{/each}
									</Menubar.SubContent>
								</Menubar.Sub>
							{:else}
								<Menubar.Item>
									<a
										class="p-2 w-full {childActive && ' text-primary-red shadow-inner'}
												  rounded-md flex gap-3 hover:text-primary-red"
										href={child.href}
									>
										<div class="item-title font-medium text-xs">{child.title}</div>
									</a>
								</Menubar.Item>
							{/if}
						{/each}
					</Menubar.Content>
				</Menubar.Menu>
			</Menubar.Root>
		{:else}
			<a
				class="flex max-w-full md:w-full lg:h-full md:border-0 relative w-8 h-8 md:py-3 md:px-3 items-center text-grey-200 justify-center lg:justify-around rounded-full lg:rounded-md md:hover:bg-grey-200 hover:text-white hover:shadow-inner {active &&
					' bg-primary-light text-primary-red'}
										"
				href={route.href}
				on:mouseenter={() => {
					if ($page.url.pathname === route.href && active === true) active = false;
				}}
				on:mouseleave={() => {
					if ($page.url.pathname === route.href && active === false) active = true;
				}}
			>
				<span
					class="side-nav-button text-inherit flex max-w-full w-full items-center lg:justify-between"
				>
					<div
						class="button-content text-inherit flex items-center justify-center lg:justify-start w-full md:gap-2.5"
					>
						<!-- <enhanced:img src={icon} /> -->
						<span class="text-inherit">{@html active ? route.activeIcon : route.icon}</span>
						<span
							class="button-text hidden lg:flex flex-col justify-center flex-shrink-0 self-stretch text-sm"
						>
							{route.pageTitle}
						</span>
					</div>
					{#if alert}
						<div
							class="button-alert absolute top-0 right-0 border-2 lg:border-none border-black-100 lg:static w-4 h-4 lg:w-6 lg:h-5 lg:p-0 flex p-1.5 flex-col justify-center items-center gap-[0.625rem]
						rounded-full bg-[#FF1C0D]
						"
						>
							<span class="alert-text text-white text-xs font-medium lg:font-bold">3</span>
						</div>
					{/if}
				</span>
			</a>
		{/if}
	</li>
{/if}
