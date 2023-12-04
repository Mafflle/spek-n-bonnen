<script>
	import InviteUserModal from '$lib/components/InviteUserModal.svelte';
	import StaffMember from '$lib/components/StaffMember.svelte';
	import { openInviteUserModal } from '$lib/utils';
	let isFocused = false;
</script>

<div
	class="staff-page inline-flex pt-[2.875rem] pr-[1.0625rem] pb-[17.9375rem] pl-[2.1875rem] flex-col items-start gap-[3.8125rem]"
>
	<div class="manage flex flex-col items-start gap-[2.5rem]">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<div class="text-[2rem] tracking-[-0.04rem]">Staff management</div>
			<sub class="text-[#6B6B6B] text-[0.8125rem] tracking-[-0.00813rem]">
				Manage employees, assign roles and tasks
			</sub>
		</div>
		<div class="filters flex items-start gap-[26rem]">
			<label class="relative text-gray-400 focus-within:text-gray-600 block">
				{#if !isFocused}
					<div
						class="icon pointer-events-none w-8 h-8 absolute top-1/2 transform -translate-y-1/2 left-3 flex items-center"
					>
						<div class="w-[330px] h-6 justify-start items-center gap-[9px] inline-flex">
							<div class="w-6 h-6 relative">
								<img src="/icons/search.svg" alt="search icon" />
							</div>
							<div class="grow shrink w-[inherit] basis-0 text-neutral-400 text-[13px] font-normal">
								Search for staffs...
							</div>
						</div>
					</div>
				{/if}
				<input
					type="text"
					placeholder=""
					class="input input-bordered w-[22rem] py-[0.68rem] px-[0.37rem] rounded-[0.375rem] b-[#D9D9D9] border-[0.5px]"
					on:focus={() => (isFocused = true)}
					on:blur={() => (isFocused = false)}
				/>
			</label>

			<div class="filter-buttons flex items-start gap-5">
				<button
					class="w-32 h-9 px-2.5 py-2 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
                    hover:bg-[#C7453C]
                    focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]

                    "
					on:click={() => openInviteUserModal()}
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/user-plus.svg" alt="user-plus" />
					</div>
					<div class="text-white text-sm font-bold">Invite staff</div>
				</button>
			</div>
		</div>
	</div>

	<table class="table">
		<thead>
			<tr class="">
				<th class="bg-[#F9F9F9] rounded-tl-[0.625rem] border-x-[0.5px] border-[#F9F9F9]">Name</th>
				<th class="bg-[#F9F9F9]">Role</th>
				<th class="bg-[#F9F9F9]">Email</th>
				<th class="bg-[#F9F9F9]">Permissions</th>
				<th class="bg-[#F9F9F9] rounded-tr-[0.625rem] border-x-[0.5px] border-[#F9F9F9]"></th>
			</tr>
		</thead>
		<tbody class="border-x-[0.5px] border-[#D9D9D9] rounded-br-[0.625rem] rounded-bl-[0.625rem]">
			<StaffMember
				name="Oluwasheyifunmi oyefeso"
				role="Customer service"
				email="dummyname@gmail.com"
				permissions="dummyname@gmail.com"
			/>
			<StaffMember
				name="Oluwasheyifunmi oyefeso"
				role="Customer service"
				email="dummyname@gmail.com"
				permissions="dummyname@gmail.com"
			/>
			<StaffMember
				name="Oluwasheyifunmi oyefeso"
				role="Customer service"
				email="dummyname@gmail.com"
				permissions="dummyname@gmail.com"
			/>
		</tbody>
	</table>
</div>

<InviteUserModal />
