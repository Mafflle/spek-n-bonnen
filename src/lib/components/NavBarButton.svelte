<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Button from './ui/button/button.svelte';

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
</script>

{#if children.length > 0}
	<Collapsible.Root class="w-full">
		<Collapsible.Trigger asChild let:builder>
			<div
				class="flex max-w-full w-full h-full px-3 items-center justify-around rounded-md
										hover:bg-grey-200 hover:shadow-inner {active && 'bg-primary-light text-[#DA4E45]'}
										"
			>
				<a {href} class="side-nav-button w-full flex items-center justify-between">
					<div class="button-content flex items-center gap-2.5 self-stretch">
						<span>{@html active ? activeIcon : icon}</span>
						<span
							class="button-text flex flex-col justify-center flex-shrink-0 self-stretch text-sm"
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
				</a>

				<Button builders={[builder]} class="flex items-center justify-center p-0"
					><iconify-icon icon="iconamoon:arrow-up-2-fill" width="20" rotate="90deg"></iconify-icon>
					<span class="sr-only">Toggle</span></Button
				>
			</div>
		</Collapsible.Trigger>

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
{:else}
	<span
		class="flex max-w-full h-full py-3 px-3 items-center justify-around rounded-md
										hover:bg-grey-200 hover:shadow-inner {active && 'bg-primary-light text-[#DA4E45]'}
										"
	>
		<a {href} class="side-nav-button flex max-w-full w-full items-center justify-between">
			<div class="button-content flex items-center w-full gap-2.5 self-stretch">
				<!-- <enhanced:img src={icon} /> -->
				<span>{@html active ? activeIcon : icon}</span>
				<span class="button-text flex flex-col justify-center flex-shrink-0 self-stretch text-sm">
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
		</a>
	</span>
{/if}
