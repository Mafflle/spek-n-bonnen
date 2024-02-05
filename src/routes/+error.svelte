<script>
	import { page } from '$app/stores';
</script>

<main class="flex flex-col items-center justify-center h-screen text-center">
	<h1 class="text-2xl font-bold">Error: {$page.error?.message}</h1>
	<h2 class="text-xl">Error Code: {$page.status}</h2>
	<a href="/" class="text-primary-100">Go back home</a>
</main>
