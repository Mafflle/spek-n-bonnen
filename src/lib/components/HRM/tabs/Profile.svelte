<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { currentUser, type User } from '$lib/user';
	import dayjs from 'dayjs';
	import { createEventDispatcher } from 'svelte';
	import ManageProfile from '../forms/ManageProfile.svelte';
	import { page } from '$app/stores';

	export let currentProfile: User;
	export let view: 'employee' | 'manager' = 'employee';

	let showEditModal: boolean = false;

	let state = showEditModal;

	$: console.log(state);

	let staff_profile = $page.url.searchParams.get('staff_profile');

	if (staff_profile || currentProfile?.staff_profile === null) {
		showEditModal = true;
	}

	$: name = `${currentProfile?.staff_profile?.first_name} ${currentProfile?.staff_profile?.last_name}`;
	$: emergencyContactName = `${currentProfile?.staff_profile?.emergency_contact_name}`;
	$: preferred_name = currentProfile?.staff_profile?.preferred_name;
	$: preferred_weekly_working_hours = currentProfile?.staff_profile?.preferred_weekly_working_hours;
	$: email = currentProfile?.email;

	function updatedProfile(user) {
		currentProfile.staff_profile = user;
		currentUser.update((state) => ({ ...state, staff_profile: user }));

		showEditModal = false;
	}
</script>

<div class="w-full py-5 flex flex-col gap-8 text-grey-200">
	<section class="w-full flex flex-col max-xs:space-y-5 md:grid md:grid-cols-2 md:gap-6 xl:gap-10">
		<div class="flex flex-col">
			<label for="name" class="mb-2 text-xs font-satoshi">Name</label>
			<div class="w-full min-h-[48px] border-none flex items-center px-2 bg-[#FCFCFC] rounded-md">
				<p id="name" aria-label={name}>{name}</p>
			</div>
		</div>
		<div class="flex flex-col">
			<label for="email" class="mb-2 text-xs font-satoshi">Email Address</label>
			<div class="w-full min-h-[48px] border-none flex items-center px-2 bg-[#FCFCFC] rounded-lg">
				<p id="email" aria-label={email}>{email}</p>
			</div>
		</div>
		<div class="flex flex-col">
			<label for="preferred_name" class="mb-2 text-xs font-satoshi">Preferred Name</label>
			<div class="w-full min-h-[48px] border-none flex items-center px-2 bg-[#FCFCFC] rounded-lg">
				<p id="preferred_name" aria-label={preferred_name}>{preferred_name}</p>
			</div>
		</div>
		<div class="flex flex-col">
			<label for="preferred_weekly_working_hours" class="mb-2 text-xs font-satoshi"
				>Preferred Weekly Working Hours</label
			>
			<div class="w-full min-h-[48px] border-none flex items-center px-2 bg-[#FCFCFC] rounded-lg">
				<p id="preferred_weekly_working_hours" aria-label="preferred_weekly_working_hours">
					{preferred_weekly_working_hours}
				</p>
			</div>
		</div>
		<div class="flex flex-col">
			<label for="phone_number" class="mb-2 text-xs font-satoshi">Phone Number</label>
			<div class="w-full min-h-[48px] border-none flex items-center px-2 bg-[#FCFCFC] rounded-lg">
				<p id="phone_number" aria-label={currentProfile?.staff_profile?.phone_number}>
					{currentProfile?.staff_profile?.phone_number}
				</p>
			</div>
		</div>
		<div class="flex flex-col">
			<label for="address" class="mb-2 text-xs font-satoshi">Home Address</label>
			<div class="w-full min-h-[48px] border-none flex items-center px-2 bg-[#FCFCFC] rounded-lg">
				<p id="address" aria-label={currentProfile?.staff_profile?.address}>
					{currentProfile?.staff_profile?.address}
				</p>
			</div>
		</div>
		<div class="flex flex-col">
			<label for="date_of_birth" class="mb-2 text-xs font-satoshi">Date Of Birth</label>
			<div class="w-full min-h-[48px] border-none flex items-center px-2 bg-[#FCFCFC] rounded-lg">
				<p id="date_of_birth" aria-label={currentProfile?.staff_profile?.address}>
					{dayjs(currentProfile?.staff_profile?.date_of_birth).format('DD/MM/YYYY')}
				</p>
			</div>
		</div>
	</section>
	<section
		class="w-full flex flex-col max-xs:space-y-5 md:grid md:grid-cols-2 md:gap-6 xl:gap-10 text-grey-200"
	>
		<h2 class="font-satoshi font-medium text-primary-red col-span-2 mb-3 xl:mb-0">
			Emergency Contact
		</h2>
		<div class="form-group w-full mb-5 xl:mb-0">
			<label for="emergency_contact_name" class="mb-2 text-xs font-satoshi">Name</label>
			<div class="w-full min-h-[48px] border-none flex items-center px-2 bg-[#FCFCFC] rounded-md">
				<p id="emergency_contact_name" aria-label={emergencyContactName}>
					{emergencyContactName}
				</p>
			</div>
		</div>

		<div class="form-group w-full mb-5 xl:mb-0">
			<label for="emergency_contact_number" class="mb-2 text-xs font-satoshi">Phone Number</label>
			<div class="w-full min-h-[48px] border-none flex items-center px-2 bg-[#FCFCFC] rounded-lg">
				<p
					id="emergency_contact_number"
					aria-label={currentProfile?.staff_profile?.emergency_contact_number}
				>
					{currentProfile?.staff_profile?.emergency_contact_number}
				</p>
			</div>
		</div>
		<div class="form-group w-full mb-5 xl:mb-0">
			<label for="emergency_contact_relationship" class="mb-2 text-xs font-satoshi"
				>Relationship</label
			>
			<div class="w-full min-h-[48px] border-none flex items-center px-2 bg-[#FCFCFC] rounded-lg">
				<p
					id="emergency_contact_relationship"
					aria-label={currentProfile?.staff_profile?.emergency_contact_relationship}
				>
					{currentProfile?.staff_profile?.emergency_contact_relationship}
				</p>
			</div>
		</div>
		<div class="col-span-2 flex items-center justify-end">
			<button
				type="button"
				on:click={() => (showEditModal = true)}
				class="text-sm bg-primary-red font-satoshi rounded-md font-bold min-w-24 px-2 hover:bg-primary-25 transition-all p-2.5 text-white"
				>Edit Profile</button
			>
		</div>
	</section>
</div>

<Modal
	mode="sheet"
	showModal={showEditModal}
	lock={!!staff_profile}
	on:close={() => (showEditModal = false)}
>
	<ManageProfile
		on:close={() => (showEditModal = false)}
		on:updated={(e) => {
			updatedProfile(e.detail.user);
		}}
		{view}
		formaction="?/manage-staff-profile"
		slot="modal-content"
		currentStaff={currentProfile}
	/>
</Modal>
