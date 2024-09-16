<script lang="ts">
	import { Users } from '$lib/user';
	import UserRowCard from '$lib/components/UserRowCard.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
</script>

<div class="border rounded-xl w-full max-w-full flex overflow-x-scroll no-scrollbar">
	<Table.Root class="">
		<Table.Header class="sticky top-0">
			<Table.Row class="h-[55px] bg-[#F9F9F9] font-satoshi font-medium ">
				<Table.Head class="bg-[#F9F9F9] rounded-tl-[0.625rem]">Name</Table.Head>
				<Table.Head class="bg-[#F9F9F9]">Email</Table.Head>
				<Table.Head class="bg-[#F9F9F9]">Role</Table.Head>
				<Table.Head class="bg-[#F9F9F9]">Date</Table.Head>
				<Table.Head class="bg-[#F9F9F9]">Status</Table.Head>

				<Table.Head class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each $Users as user}
				{#if user}
					<UserRowCard {user} />
				{/if}
			{/each}
		</Table.Body>
	</Table.Root>
</div>
