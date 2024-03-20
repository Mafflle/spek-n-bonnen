<script lang="ts">
	import MediaManager from '$lib/components/MediaManager.svelte';
	import Modal from '$lib/components/Modal.svelte';
	export let data;

	let showModal: boolean = false;
	let showTagsModal: boolean = true;
	let showMaingroupsModal: boolean = false;

	const settingsOptions = [
		{
			title: 'Media Manager',
			icon: 'heroicons-solid:collection',
			clickFn: () => {
				showModal = !showModal;
			}
		},
		{
			title: 'Tags',
			icon: 'tabler:tags',
			clickFn: () => {
				showTagsModal = !showTagsModal;
			}
		},
		{
			title: 'Main groups',
			icon: 'fluent:collections-add-20-filled',
			clickFn: () => {
				showMaingroupsModal = !showMaingroupsModal;
			}
		}
	];
</script>

<svelte:head>
	<title>Settings - Spek-n-Boonen</title>
</svelte:head>

<div class="max-w-full h-full">
	<div class="w-full flex flex-col items-start gap-9">
		<section class="w-full">
			<h1 class="text-3xl">Settings</h1>
		</section>
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
			{#each settingsOptions as card}
				<button on:click={card.clickFn} class="border-2 rounded w-full h-36 py-2 px-3 flex shadow">
					<section class="flex gap-2 items-center">
						<span class="text-primary-100"
							><iconify-icon icon={card.icon} width="35"></iconify-icon></span
						>
						<h5 class="text-2xl font-satoshi font-medium">{card.title}</h5>
					</section>
				</button>
			{/each}
		</div>
	</div>
</div>

<Modal on:close={() => (showModal = false)} {showModal}>
	<MediaManager images={data.images.results} slot="modal-content" />
</Modal>
