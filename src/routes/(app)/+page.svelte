<script lang="ts">
	import auth from '$lib/client/auth';
</script>

<div class="flex w-full items-center justify-center">
	<div class="w-80 py-10">
		<button on:click={auth.logout} class="btn bg-primary text-white">Logout</button>
	</div>
</div>
