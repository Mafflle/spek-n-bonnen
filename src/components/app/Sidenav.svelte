<script lang="ts">
	import SidenavSection from './SidenavSection.svelte';

	const general = [
		{
			name: 'Homepage',
			icon: '/icons/home-2.svg',
			activeIcon: '/icons/active/home-active.svg',
			link: '/'
		},
		{
			name: 'Inventory',
			icon: '/icons/box.svg',
			activeIcon: '/icons/active/box-active.svg',
			link: '/inventory',

			children: [
				{
					name: 'Products',
					link: '/products'
				},
				{
					name: 'Product type',
					link: '/inventory/product-type'
				},
				{
					name: 'Batches',
					link: '/batches'
				}
			]
		},
		{
			name: 'Orders',
			icon: '/icons/shopping-cart.svg',
			activeIcon: '/icons/active/shopping-cart-active.svg',
			link: '/orders'
		},
		{
			name: 'Suppliers',
			icon: '/icons/group.svg',
			activeIcon: '/icons/active/group-active.svg',
			link: '/suppliers'
		}
	];

	const hrm = [
		{
			name: 'Tasks',
			icon: '/icons/layer.svg',
			activeIcon: '/icons/active/layer-active.svg',
			link: '/tasks'
		},
		{
			name: 'Staffs',
			icon: '/icons/people.svg',
			activeIcon: '/icons/active/people-active.svg'
		}
	];

	const otherRoutes = [
		{
			name: 'Media gallery',
			icon: '/icons/gallery.svg',
			activeIcon: '/icons/active/gallery-active.svg',
			link: '/media'
		},
		{
			name: 'Settings',
			icon: '/icons/setting-2.svg',
			link: '/settings'
		},
		{
			name: 'Webshop',
			icon: '/icons/global.svg',
			activeIcon: '/icons/active/global-active.svg',
			link: '/webshop'
		}
	];
</script>

<div
	class="no-scrollbar sticky top-0 hidden h-screen w-full max-w-64 overflow-scroll bg-[#111314] text-white lg:flex lg:flex-col"
>
	<section class="mb-10 flex items-center gap-2 border-b border-border-black p-4">
		<img src="/icons/logo.svg" class="h-7 w-7" alt="Spek-n-Boonen logo" />
		<h2 class="text-sm font-medium text-grey-text">SPEK N BOONEN ERP</h2>
	</section>
	<section class="mb-2 flex flex-1 flex-col gap-8">
		<SidenavSection title="General" routes={general} />
		<SidenavSection title="Employee" routes={hrm} />
		<SidenavSection class="flex-1" title="Others" routes={otherRoutes} />
	</section>
	<section class="flex items-center justify-center p-3">
		<span
			class="text-sm font-medium text-[#94949459]
">&copy; 2024 Spek and Boonen</span
		>
	</section>
</div>
