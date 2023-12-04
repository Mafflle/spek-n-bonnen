<script>
	import SideNav from '$lib/components/SideNav.svelte';
</script>

<div class="max-w-screen flex bg-[#F9F9F9]">
	<SideNav />

	<div class="w-full min-h-full pt-16 px-10 pb-5 bg-white"><slot /></div>
</div>
