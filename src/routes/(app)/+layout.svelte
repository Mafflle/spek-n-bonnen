<script lang="ts">
	// onMount(async () => {
	// 		if (browser) {
	// 			await initializeUserStore();
	// 		}
	// 	});

	import Sidenav from '$components/app/Sidenav.svelte';
</script>

<div class="flex h-full max-h-screen w-full max-w-[100vw] overflow-hidden bg-[#F9F9F9]">
	<!-- <SideNav on:showSwitch={toggleModal} />-->
	<Sidenav />
	<div class="bg-grey-bg w-screen">
		<div class="sticky top-0 h-14 w-full border-2 border-yellow-500 bg-white"></div>
		<div>
			<slot />
		</div>
	</div>
</div>
