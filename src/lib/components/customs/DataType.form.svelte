<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';

	let dataTypes = [{}];
</script>

<div
	class="min-h-[160px] w-[500px] h-full bg-white border-l-4 border-yellow-300 rounded shadow flex items-center gap-2["
>
	<div class="form-group w-full">
		<label for="name" class="font-satoshi text-sm font-medium mb-1">Name</label>
		<input
			type="text"
			name="name"
			id="name"
			placeholder="Enter name"
			class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
		/>

		<div class="form-item w-full flex flex-col gap-1">
			<label for="priority" class="text-sm mb-1 font-medium font-satoshi">Priority</label>

			<!-- <Select.Root bind:selected={taskPriority}>
				<Select.Trigger class="w-full flex items-center">
					<Select.Value placeholder="Select task priority" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each taskPriorities as priority}
							<Select.Item
								class="flex items-center gap-3 justify-start"
								value={priority.value}
								label={priority.label}
							>
								<iconify-icon class={priority.color} width="20" icon="material-symbols:flag-outline"
								></iconify-icon>
								<span>{priority.label}</span>
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
				<Select.Input name="priority" />
			</Select.Root>
			{#if validationErrors?.priority}
				<sub
					transition:slide={{ delay: 250, duration: 300 }}
					class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.priority[0]}</sub
				>
			{/if} -->
		</div>
	</div>
</div>
