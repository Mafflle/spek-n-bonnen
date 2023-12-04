<script>
	import NavbarButton from '$lib/components/NavBarButton.svelte';
</script>

<div class="min-w-screen min-h-screen inline-flex gap-[1.875rem] bg-[#F9F9F9]">
	<div class="side-nav w-[17.75rem] min-h-full flex flex-col">
		<div
			class="sidebar-logo inline-flex flex-col items-start gap-[0.25rem] px-[1.75rem] py-[2.44rem]"
		>
			<p class="text-center text-sm font-bold text-primary-50">Spek and Bonnen</p>
			<sub class=" text-center text-[0.5rem] tracking-[0.125rem] text-[#6B6B6B]">ERP SYSTEM</sub>
		</div>
		<div
			class="sidebar-nav w-full flex p-[0.625rem] flex-col items-start gap-[0.625rem] text-[#6B6B6B]"
		>
			<NavbarButton href="/" icon="/icons/home.svg" text="Homepage" />
			<NavbarButton href="/" icon="/icons/shopping-cart.svg" text="Orders" alert={true} />
			<NavbarButton href="/" icon="/icons/box.svg" text="Inventory" />
			<NavbarButton href="/" icon="/icons/box.svg" text="Tasks" />
			<NavbarButton href="/" icon="/icons/box.svg" text="Tasks" />
			<NavbarButton href="/staff" icon="/icons/Staff.svg" text="Staff" />
		</div>
		<div
			class="settings flex p-[0.625rem] flex-col justify-center items-start gap-[0.8125rem] text-[#6B6B6B]"
		>
			<div
				class="settings-header text-secondary-50 text-[0.625rem] font-bold tracking-[0.0635rem] px-[1.75rem]"
			>
				SETTINGS
			</div>
			<NavbarButton href="/" icon="/icons/settings.svg" text="User permission" />
		</div>
	</div>
	<div class="content w-[68.5rem] min-h-full rounded-[0.625rem] bg-white"><slot /></div>
</div>
