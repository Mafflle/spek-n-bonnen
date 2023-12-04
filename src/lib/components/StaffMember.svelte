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
			<div class="grow shrink basis-0 text-[#6B6B6B] text-sm font-medium">
				{name}
			</div>
		</div>
	</td>
	<td>
		<div
			class="w-[124px] h-6 px-1 py-[3px] bg-stone-50 rounded-[20px] justify-start items-center gap-2.5 inline-flex"
		>
			<div class="grow shrink basis-0 text-center text-[#6B6B6B] text-[13px] font-medium">
				{role}
			</div>
		</div>
	</td>
	<td class="text-[#9C9C9C]">{email}</td>
	<td class="text-[#9C9C9C]">{permissions}</td>
	<td>
		<button class=" px-1.5 py-3 flex justify-center items-center gap-2.5">
			<iconify-icon icon="pepicons-pencil:dots-y" style="color: #6b6b6b;" width="30"></iconify-icon>
		</button>
	</td>
</tr>
