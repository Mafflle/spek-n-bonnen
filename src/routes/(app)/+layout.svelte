<script>
	import SideNav from '$lib/components/SideNav.svelte';
</script>

<div class="max-w-screen flex bg-[#F9F9F9]">
	<SideNav />

	<div class="w-full min-h-screen lg:my-4 lg:m-4 md:rounded-lg pt-10 md:pt-16 px-5 pb-5 bg-white">
		<slot />
	</div>
</div>
