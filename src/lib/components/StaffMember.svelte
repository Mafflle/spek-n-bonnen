<script>
	/**
	 * @type {String}
	 */
	export let name;
	/**
	 * @type {String}
	 */
	export let role;
	/**
	 * @type {String}
	 */
	export let email;
	/**
	 * @type {String}
	 */
	export let permissions;
</script>

<tr class="border-b-[0.5px] border-[#D9D9D9]">
	<td>
		<div class="  py-3 justify-start items-center gap-3 inline-flex">
			<div class="w-[38px] h-[38px] bg-neutral-100 rounded-full"></div>
			<div class="grow shrink basis-0 text-neutral-500 text-sm font-medium">
				{name}
			</div>
		</div>
	</td>
	<td>
		<div
			class="w-[124px] h-6 px-1 py-[3px] bg-stone-50 rounded-[20px] justify-start items-center gap-2.5 inline-flex"
		>
			<div class="grow shrink basis-0 text-center text-neutral-500 text-[13px] font-medium">
				{role}
			</div>
		</div>
	</td>
	<td>{email}</td>
	<td>{permissions}</td>
	<td
		><div
			class="w-7 h-[26px] px-1.5 py-3 origin-top-left -rotate-90 flex-col justify-center items-center gap-2.5 inline-flex"
		>
			<div class="justify-start items-start gap-[5px] inline-flex">
				<img src="/icons/menu.svg" alt="" />
			</div>
		</div></td
	>
</tr>
