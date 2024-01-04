<script lang="ts">
	import { page } from '$app/stores';

	export let href: string = '';
	export let icon: string = '';
	export let activeIcon: string = '';
	export let text: string = '';
	export let alert: boolean = false;
	export let active: boolean = false;
</script>

<a
	{href}
	on:mouseenter={() => {
		if ($page.url.pathname !== href) active = true;
	}}
	on:mouseleave={() => {
		if ($page.url.pathname !== href) active = false;
	}}
	class="side-nav-button flex max-w-full py-3 px-3 items-center justify-between rounded-md
                hover:bg-primary-light {active && 'bg-primary-light text-[#DA4E45] shadow-inner'}
                "
>
	<div class="button-content flex items-center w-[11.625rem] gap-[0.875rem] self-stretch">
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
