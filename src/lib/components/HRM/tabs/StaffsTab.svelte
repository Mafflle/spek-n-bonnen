<script lang="ts">
	import { Users } from '$lib/user';
	import UserRowCard from '$lib/components/UserRowCard.svelte';
</script>

<div class="border rounded-xl w-full max-w-full overflow-x-scroll no-scrollbar">
	<table class="table">
		<thead class="">
			<tr class="">
				<th class="bg-[#F9F9F9] rounded-tl-[0.625rem]">Name</th>
				<th class="bg-[#F9F9F9]">Email</th>
				<th class="bg-[#F9F9F9]">Role</th>
				<th class="bg-[#F9F9F9]">Date</th>
				<th class="bg-[#F9F9F9]">Status</th>

				<th class="bg-[#F9F9F9] rounded-tr-[0.625rem]"></th>
			</tr>
		</thead>
		<tbody>
			{#each $Users as user}
				{#if user && user.staff_profile}
					<UserRowCard {user} />
				{/if}
			{/each}
		</tbody>
	</table>
</div>
