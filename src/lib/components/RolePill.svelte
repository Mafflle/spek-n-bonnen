<script>
	export let roleName = '';
	let toggled = false;

	export function toggle() {
		toggled = !toggled;
	}
</script>

<button
	class={`btn text-[0.75rem] text-center tracking-[-0.0075rem] ${
		toggled ? 'bg-[#DA4E45] text-white' : 'bg-[#F9F9F9] text-[#6B6B6B]'
	}`}
	on:click={toggle}
>
	{roleName}
</button>
