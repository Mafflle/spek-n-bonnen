<script lang="ts">
	import Sidenav from '$components/app/Sidenav.svelte';
	import Topnav from '$components/app/Topnav.svelte';
</script>

<div class="flex h-full max-h-screen w-full max-w-[100vw] overflow-hidden bg-[#F9F9F9]">
	<!-- <SideNav on:showSwitch={toggleModal} />-->
	<Sidenav />
	<div class="w-screen bg-grey-bg">
		<Topnav />
		<div>
			<slot />
		</div>
	</div>
</div>
