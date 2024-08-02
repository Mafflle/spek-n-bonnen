<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props['class'] = undefined;
	let isSpace: $$Props['is'] = undefined;
	export { className as class, isSpace as is };
</script>

<div
	class={cn(className, `${!isSpace && 'space-y-2'}`, 'flex flex-col text-center sm:text-left')}
	{...$$restProps}
>
	<slot />
</div>
