<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { LoggedinUsers } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const showLoggedInUsers = () => {
		dispatch('showLoggedInUsers');
	};
</script>

{#if $LoggedinUsers.length > 0}
	<button
		on:click={showLoggedInUsers}
		class="flex justify-between items-center min-w-[22rem] lg:min-w-[28.25rem] bg-white hover:bg-white/60 p-4 rounded-[16px]"
	>
		<section class=" w-full flex gap-3 items-center">
			<div class="flex items-center -space-x-3">
				{#each $LoggedinUsers as user}
					<Avatar.Root class="w-12 h-12">
						<Avatar.Image
							class="w-full h-full object-cover"
							src={user.avatar}
							alt="User's profile picture"
						/>
						<Avatar.Fallback>
							{#if user.name}
								<span class="text-2xl">
									{`${user.name.substring(0, 2).toLocaleUpperCase()}`}
								</span>
							{:else}
								<span class="text-2xl">
									{`${user.email.substring(0, 2).toLocaleUpperCase()}`}
								</span>
							{/if}
						</Avatar.Fallback>
					</Avatar.Root>
				{/each}
			</div>
			<span class="font-satoshi text-primary-red">Switch Accounts</span>
		</section>
		<iconify-icon class="text-primary-red" width="30" icon="ph:caret-right-thin"></iconify-icon>
	</button>
{/if}
