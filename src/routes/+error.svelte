<script>
	import { page } from '$app/stores';
	import { RefreshCwIcon } from 'lucide-svelte';
	const refresh = () => {
		location.reload();
	};
</script>

<main class="flex flex-col items-center justify-center h-screen text-center">
	<h1 class="text-2xl font-bold">Error: {$page.error?.message}</h1>
	<h2 class="text-xl">Error Code: {$page.status}</h2>
	<div class="flex flex-col gap-4">
		<a href="/" class="text-primary-100">Go back home</a>
		{#if $page.status != 404}
			<p>Or</p>

			<button
				on:click={refresh}
				class="mt-5 px-2.5 py-2 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex hover:bg-[#C7453C] focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
			>
				<div class="w-5 h-5 relative">
					<RefreshCwIcon class="text-white" />
				</div>
				<span class="text-white text-sm font-bold">Refresh</span>
			</button>
		{/if}
	</div>
</main>
