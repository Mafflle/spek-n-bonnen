<script lang="ts">
	import { page } from '$app/stores';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Button from './ui/button/button.svelte';
	import * as Menubar from '$lib/components/ui/menubar';
	import { SubTrigger } from './ui/dropdown-menu';
	import { Menu } from 'lucide-svelte';

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
	<Collapsible.Root class="md:w-full h-full hidden md:flex">
		<a
			on:mouseenter={() => {
				if ($page.url.pathname === href && active === true) active = false;
			}}
			on:mouseleave={() => {
				if ($page.url.pathname === href && active === false) active = true;
			}}
			class="flex max-w-full md:w-full h-full px-3 items-center justify-around rounded-md
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

			<!-- <Collapsible.Trigger class="h" asChild let:builder>
				<Button
					builders={[builder]}
					class="hidden md:flex items-center justify-center p-0 {active && 'text-black-100'}"
					><iconify-icon icon="iconamoon:arrow-up-2-fill" width="20" rotate="90deg"></iconify-icon>
					<span class="sr-only">Toggle</span></Button
				>
			</Collapsible.Trigger> -->
		</a>

		<Collapsible.Content class="py-5">
			<ul class="ml-6 border-l-2 border-grey-300 pl-3">
				<h5 class="text-xs uppercase font-semibold text-grey-200">PROVIDERS</h5>
				<div class="flex flex-col gap-3 justify-between">
					{#each children as child}
						<a
							class="py-3 {childActive && 'bg-primary-light text-[#DA4E45] shadow-inner'}
											 px-3 rounded-md flex gap-3 active hover:bg-primary-light hover:text-primary-red"
							href={child.href}
						>
							<div class="item-color w-5 h-5" style="background-color: {child.color};"></div>
							<div class="item-title font-medium text-xs">{child.title}</div>
						</a>
					{/each}
				</div>
			</ul>
		</Collapsible.Content>
	</Collapsible.Root>
	<Menubar.Root
		class="md:w-full h-full flex p-2 justify-center  bg-transparent {active &&
			'bg-primary-light text-[#DA4E45]'} rounded-full	border-0 space-x-0 w-full md:hidden"
	>
		<Menubar.Menu>
			<Menubar.Trigger class="p-0">
				<a
					on:mouseenter={() => {
						if ($page.url.pathname === href && active === true) active = false;
					}}
					on:mouseleave={() => {
						if ($page.url.pathname === href && active === false) active = true;
					}}
					class="flex max-w-full md:w-full h-full items-center justify-around rounded-md
	md:hover:bg-grey-200 md:hover:text-white md:hover:shadow-inner {active &&
						'bg-primary-light text-[#DA4E45]'}
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

			<Menubar.Content class="bg-black-100 text-white">
				{#each children as child}
					{#if child.childRoutes}
						<Menubar.Sub>
							<Menubar.SubTrigger class="text-xs font-semibold">
								<span class="p-2">{child.title}</span>
							</Menubar.SubTrigger>
							<Menubar.SubContent
								class="flex flex-col gap-3 justify-between bg-black-100 text-white"
							>
								{#each child.childRoutes as route}
									<Menubar.Item>
										<a
											class="p-2 {childActive && 'bg-primary-light text-[#DA4E45] shadow-inner'}
												  rounded-md flex gap-3 active hover:bg-primary-light hover:text-primary-red"
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
								class="p-2 w-full {childActive && 'bg-primary-light text-[#DA4E45] shadow-inner'}
												  rounded-md flex gap-3 active hover:bg-primary-light hover:text-primary-red"
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
		class="flex max-w-full w-full md:h-full md:border-0 relative p-2 md:py-3 md:px-3 items-center justify-around rounded-full md:rounded-md
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
		<span class="side-nav-button flex max-w-full w-full items-center justify-between">
			<div
				class="button-content flex items-center justify-center w-full md:gap-2.5 md:self-stretch"
			>
				<!-- <enhanced:img src={icon} /> -->
				<span class="">{@html active ? activeIcon : icon}</span>
				<span
					class="button-text hidden md:flex flex-col justify-center flex-shrink-0 self-stretch text-sm"
				>
					{text}
				</span>
			</div>
			{#if alert}
				<div
					class="button-alert absolute md:static -top-1 -right-1 flex w-[1.875rem] py-[0.1875rem] px-[0.625rem] flex-col justify-center items-center gap-[0.625rem] self-stretch
						md:rounded-[1.875rem] md:bg-[#FF1C0D]
						"
				>
					<span class="alert-text text-primary-red text-xs font-bold">4</span>
				</div>
			{/if}
		</span>
	</a>
{/if}
