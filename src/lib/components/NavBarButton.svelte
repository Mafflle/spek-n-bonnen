<script lang="ts">
	import { page } from '$app/stores';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Button from './ui/button/button.svelte';
	import * as Menubar from '$lib/components/ui/menubar';

	export let href: string = '';
	export let icon: string = '';
	export let activeIcon: string = '';
	export let text: string = '';
	export let alert: boolean = false;
	export let active: boolean = false;
	export let children: any[] = [];
	let childActive: boolean = false;
	let showChildren: boolean = false;

	const toggleChildren = () => {
		showChildren = !showChildren;
	};
	// console.log(children);
</script>

{#if children.length > 0}
	<Collapsible.Root class="md:w-full lg:flex hidden items-start flex-col ">
		<a
			on:mouseenter={() => {
				if ($page.url.pathname === href && active === true) active = false;
			}}
			on:mouseleave={() => {
				if ($page.url.pathname === href && active === false) active = true;
			}}
			class="flex w-full md:w-full items-center px-3 py-1 justify-around rounded-md
		hover:bg-grey-200 hover:text-white hover:shadow-inner {active && 'bg-primary-light text-[#DA4E45]'}
		"
			{href}
		>
			<span class="side-nav-button w-full flex items-center justify-between">
				<div class="button-content flex items-center gap-2.5 self-stretch">
					<span>{@html active ? activeIcon : icon}</span>
					<span
						class="button-text hidden md:flex flex-col justify-center flex-shrink-0 self-stretch text-sm"
					>
						{text}
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

			<Collapsible.Trigger class="" asChild let:builder>
				<Button
					builders={[builder]}
					class="flex items-center justify-center p-0 {active && 'text-black-100'}"
					><iconify-icon icon="iconamoon:arrow-up-2-fill" width="20" rotate="90deg"></iconify-icon>
					<span class="sr-only">Toggle</span></Button
				>
			</Collapsible.Trigger>
		</a>

		<Collapsible.Content class="py-2 px-2 w-full">
			<ul class="ml-4 w-full border-l border-grey-300 pl-2">
				<div class="flex flex-col w-full gap-3 justify-between">
					{#each children as child}
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
													'bg-primary-light text-[#DA4E45] shadow-inner'}
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
								class="py-2 w-full {childActive && 'bg-primary-light text-[#DA4E45] shadow-inner'}
											 px-3 rounded-sm flex gap-3 hover:bg-primary-light hover:text-primary-red"
								href={child.href}
							>
								<span class="item-title font-medium text-xs">{child.title}</span>
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
					'bg-primary-light text-[#DA4E45]'} w-8 h-8"
			>
				<a
					on:mouseenter={() => {
						if ($page.url.pathname === href && active === true) active = false;
					}}
					on:mouseleave={() => {
						if ($page.url.pathname === href && active === false) active = true;
					}}
					class="flex items-center justify-center rounded-md
	  md:hover:shadow-inner md:p-3
	"
					{href}
				>
					<span class="side-nav-button w-full flex items-center justify-center">
						<div class="button-content flex items-center justify-center">
							<span>{@html active ? activeIcon : icon}</span>
							<span
								class="button-text hidden lg:flex flex-col justify-center flex-shrink-0 self-stretch text-sm"
							>
								{text}
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

					<!-- <Menubar.Trigger class="h" asChild let:builder>
			<Button
				builders={[builder]}
				class="hidden md:flex items-center justify-center p-0 {active && 'text-black-100'}"
				><iconify-icon icon="iconamoon:arrow-up-2-fill" width="20" rotate="90deg"></iconify-icon>
				<span class="sr-only">Toggle</span></Button
			>
		</Menubar.Trigger> -->
				</a>
			</Menubar.Trigger>

			<Menubar.Content class="bg-black-100 text-white flex flex-col">
				{#each children as child}
					{#if child.childRoutes}
						<Menubar.Sub>
							<Menubar.SubTrigger class="text-xs font-semibold">
								<span class="p-2">{child.title}</span>
							</Menubar.SubTrigger>
							<Menubar.SubContent class="flex flex-col  justify-between bg-black-100 text-white">
								{#each child.childRoutes as route}
									<Menubar.Item class="">
										<a
											class="p-2 {childActive && ' text-[#DA4E45] shadow-inner'}
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
								class="p-2 w-full {childActive && ' text-[#DA4E45] shadow-inner'}
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
		class="flex w-full lg:h-full md:border-0 relative w-8 h-8 md:py-3 md:px-3 items-center justify-center lg:justify-around rounded-full lg:rounded-md
										md:hover:bg-grey-200 hover:text-white hover:shadow-inner {active &&
			' bg-primary-light text-[#DA4E45]'}
										"
		{href}
		on:mouseenter={() => {
			if ($page.url.pathname === href && active === true) active = false;
		}}
		on:mouseleave={() => {
			if ($page.url.pathname === href && active === false) active = true;
		}}
	>
		<span
			class="side-nav-button relative flex max-w-full w-full items-center justify-center lg:justify-between"
		>
			<div
				class="button-content flex items-center justify-center lg:justify-start w-full md:gap-2.5"
			>
				<!-- <enhanced:img src={icon} /> -->
				<span class="">{@html active ? activeIcon : icon}</span>
				<span
					class="button-text hidden lg:flex flex-col justify-center flex-shrink-0 self-stretch text-sm"
				>
					{text}
				</span>
			</div>
			{#if alert}
				<div
					class="button-alert absolute lg:w-8 -top-2 md:-right-6 flex py-[0.1875rem] flex-col justify-center items-center gap-[0.625rem]
						lg:rounded-[1.875rem] lg:bg-[#FF1C0D]
						"
				>
					<span class="alert-text text-primary-red lg:text-white text-xs font-bold">4</span>
				</div>
			{/if}
		</span>
	</a>
{/if}
