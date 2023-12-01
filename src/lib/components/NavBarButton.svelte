<script>
	/**
	 * @type {String}
	 */
	export let href = '';
	/**
	 * @type {String}
	 */
	export let icon = '';
	/**
	 * @type {String}
	 */
	export let text = '';
	/**
	 * @type {Boolean}
	 */
	export let alert = false;
</script>

<a
	{href}
	class="side-nav-button inline-flex h-10 w-full py-[0.635rem] px-[1.75rem] items-center gap-[0.625rem] flex-shrink-0 rounded-[0.375rem]
                hover:bg-white
                "
>
	<div class="button-content flex items-center w-[11.625rem] gap-[0.875rem] self-stretch">
		<img src={icon} alt="shopping-cart-icon" />
		<div
			class="button-text flex flex-col justify-center flex-shrink-0 self-stretch text-[0.875rem]"
		>
			{text}
		</div>
	</div>
	{#if alert}
		<div
			class="button-alert flex w-[1.875rem] py-[0.1875rem] px-[0.625rem] flex-col justify-center items-center gap-[0.625rem] self-stretch
        rounded-[1.875rem] bg-[#FF1C0D]
        "
		>
			<div class="alert-text text-white text-xs font-bold">4</div>
		</div>
	{/if}
</a>
