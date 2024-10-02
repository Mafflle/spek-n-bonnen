<script lang="ts">
	import { onMount } from 'svelte';

	export let type: 'text' | 'password' | 'email' = 'text';
	export let value: string;
	export let label = 'Input something';
	export let name;
	export let inputErrors: any[] = [];
	let showToggleInputType = false;

	const toggleInputType = () => {
		if (type === 'password') {
			document.querySelectorAll('#password, #confirm-password').forEach((input) => {
				input.type = 'text';
			});
			type = 'text';
		} else {
			document.querySelectorAll('#password, #confirm-password').forEach((input) => {
				input.type = 'password';
			});
			type = 'password';
		}
	};

	onMount(() => {
		if (type === 'password') {
			showToggleInputType = true;
		}
	});
</script>

<div class="form-control">
	<label for={name} class="form-label">{label}</label>
	<div class="relative">
		<input
			{...{ type }}
			id={name}
			class="form-input"
			bind:value
			autocomplete="off"
			class:form-input-error={inputErrors && inputErrors.length > 0}
		/>
		{#if showToggleInputType}
			<button type="button" class="password-reveal-btn" on:click={toggleInputType}>
				<span class={type === 'password' ? 'flex items-center' : 'hidden'}>
					<iconify-icon icon="solar:eye-linear" width="22"></iconify-icon>
				</span>
				<span class={type === 'text' ? ' flex items-center' : 'hidden'}>
					<iconify-icon icon="carbon:view-off" width="22" class=""></iconify-icon>
				</span>
			</button>
		{/if}
	</div>

	{#if inputErrors}
		{#each inputErrors as message}
			<p class="form-error">{message}</p>
		{/each}
	{/if}
</div>
