<script>
	import NavBarButton from './NavBarButton.svelte';
</script>

<aside class="side-nav w-[15rem] sticky top-0 h-screen flex flex-col">
	<div
		class="sidebar-logo inline-flex flex-col items-start gap-[0.25rem] px-[1.75rem] py-[2.44rem]"
	>
		<p class="text-center text-sm font-bold text-primary-50">Spek and Bonnen</p>
		<sub class=" text-center text-[0.5rem] tracking-[0.125rem] text-[#6B6B6B]">ERP SYSTEM</sub>
	</div>
	<div
		class="sidebar-nav w-full flex p-[0.625rem] flex-col items-start gap-[0.625rem] text-[#6B6B6B]"
	>
		<NavBarButton href="/" icon="/icons/home.svg" text="Homepage" />
		<NavBarButton href="/" icon="/icons/shopping-cart.svg" text="Orders" alert={true} />
		<NavBarButton href="/" icon="/icons/box.svg" text="Inventory" />
		<NavBarButton href="/" icon="/icons/box.svg" text="Tasks" />
	</div>
	<div
		class="settings flex p-[0.625rem] flex-col justify-center items-start gap-[0.8125rem] text-[#6B6B6B]"
	>
		<div
			class="settings-header text-secondary-50 text-[0.625rem] font-bold tracking-[0.0635rem] px-[1.75rem]"
		>
			SETTINGS
		</div>
		<NavBarButton href="/" icon="/icons/settings.svg" text="User permission" />
		<form class="" action="?/logout" method="post">
			<button
				type="submit"
				class="flex h-10 w-full py-[0.635rem] px-[1.75rem] items-center gap-[0.625rem] flex-shrink-0 rounded-[0.375rem]"
			>
				<iconify-icon icon="mdi-light:logout" style="color: #6b6b6b;" width="25"></iconify-icon>
				<span class="text-sm">Logout</span>
			</button>
		</form>
	</div>
</aside>
