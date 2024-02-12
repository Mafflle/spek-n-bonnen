<script>
	import SideNav from '$lib/components/SideNav.svelte';
</script>

<div class="max-w-screen flex bg-[#F9F9F9]">
	<SideNav />

	<div class="w-full min-h-screen lg:m-4 md:rounded-lg pt-10 md:p-8 px-5 max-xsm:mb-16 bg-white">
		<slot />
	</div>
</div>
