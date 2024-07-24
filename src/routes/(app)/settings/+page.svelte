<script lang="ts">
	import relativeTime from 'dayjs/plugin/relativeTime';

	import { currentUser } from '$lib/user';

	import dayjs from 'dayjs';
	import Button from '$lib/components/ui/button/button.svelte';
	import CustomTabs from '$lib/components/customs/TabContainer.svelte';
	import { page } from '$app/stores';
	import Profile from '$lib/components/HRM/tabs/Profile.svelte';
	import WorkSchedule from '$lib/components/HRM/tabs/WorkSchedule.svelte';
	import Vacation from '$lib/components/HRM/tabs/Vacation.svelte';

	import TimeEntriesLog from '$lib/components/HRM/tabs/TimeEntriesLog.svelte';
	import { TimeEntries } from '$lib/hrm.js';

	export let data;

	dayjs.extend(relativeTime);

	let schedules = data.mySchedule.results;
	let { myTimeEntries } = data;

	TimeEntries.set(myTimeEntries.results);

	let showProfileModal: boolean = false;

	let staff_profile = $page.url.searchParams.get('staff_profile');

	if (staff_profile || $currentUser?.staff_profile === null) {
		showProfileModal = true;
	}

	let tabs = [
		{
			title: 'Profile',
			id: 'staff_profile',
			component: Profile,
			props: { currentProfile: $currentUser }
		},
		{
			title: 'Work Schedule',
			id: 'work-schedule',
			component: WorkSchedule,
			props: { viewType: 'employee', workSchedule: schedules }
		},
		{ title: 'Vacation', id: 'vacation', component: Vacation },
		{
			title: 'Logs',
			id: 'logs',
			component: TimeEntriesLog,
			props: { timeEntries: $TimeEntries }
		}
	];
</script>

<svelte:head>
	<title>Settings - Spek-n-Boonen</title>
</svelte:head>

<div class="">
	<div class="manage flex flex-col items-start gap-[2.5rem] mb-16">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<h1 class="text-3xl text-black-100 font-satoshi tracking-[-0.04rem] font-bold">Profile</h1>
			<sub class="font-satoshi font-medium text-grey-100 text-sm"> Edit and update details.</sub>
		</div>
	</div>
	<div class="w-full flex flex-col mb-8">
		{#if $currentUser?.staff_profile === null}
			<section
				class="max-w-[969px] flex flex-col justify-end w-full p-5 h-[110px] relative bg-primary-softPink-100 rounded"
			>
				<div class="absolute -top-5 w-fit h-fit left-10">
					<img src="/icons/Bell icon.svg" class="w-[50px] h-[50px]" alt="Bell icon" />
				</div>
				<div class="flex items-center gap-4">
					<p class="font-satoshi text-sm text-primary-red">
						Your profile information is essential for compliance and unlocks a tailored experience.
						Update your details to ensure access to all company resources and personalized benefits
					</p>
					<Button
						on:click={() => (showProfileModal = true)}
						class="bg-primary-red max-h-[35px] rounded-[6px] text-white text-sm font-satoshi font-medium"
						>Complete Profile</Button
					>
				</div>
			</section>
		{/if}
		<section class="w-full h-full">
			<CustomTabs
				on:updatedProfile={(e) => {
					console.log($currentUser, e.detail);

					if ($currentUser) {
						$currentUser.staff_profile = e.detail.profile;
					}
				}}
				{tabs}
			/>
		</section>
	</div>
</div>

<!-- <Modal
	mode="sheet"
	showModal={showProfileModal}
	lock={$currentUser?.staff_profile === null}
	on:close={() => (showProfileModal = false)}
>
	<form
		slot="modal-content"
		action="?/manage-staff-profile"
		use:enhance={submit}
		method="post"
		class="w-full max-xsm:pb-4 pb-6 h-fit max-h-full overflow-x-scroll no-scrollbar flex flex-col gap-5 items-start justify-between bg-white rounded-lg"
	>
		<section class="md:h-full w-full">
			<div
				class="flex w-full sticky bg-white top-0 h-16 max-xsm:py-2 z-30 items-center justify-center mb-5"
			>
				<Sheet.Header is="text" class=" w-full h-full grid space-y-0  z-10  ">
					<div class="w-full h-full px-3 flex flex-row justify-between items-center">
						<Sheet.Title
							class="flex items-center gap-2 text-primary-50 font-poppins font-semibold text-lg mr-auto"
						>
							<img src="/icons/UserWithEclipse.svg" alt="user icon " />
							<span>Complete profile</span>
						</Sheet.Title>
						<button
							type="button"
							class="bg-[#F2F2F2] border border-[#E0E0E0] flex items-center rounded-full p-0.5"
						>
							<img src="/icons/close.svg" alt="close icon" />
						</button>
					</div>
					<Separator />
				</Sheet.Header>
			</div>
			<div class="form-group py-6 flex flex-col gap-10 items-start justify-center w-full px-4">
				<span class="font-satoshi text-sm"
					>Kindly fill information below to complete your profile.</span
				>
				<section class="w-full px-3 flex flex-col gap-5">
					<div class="form-item w-full flex flex-col mb-5">
						<UploadBox
							inputName="profile_picture_id"
							small={true}
							defaultValue={$currentUser?.staff_profile?.profile_picture}
							smallText="Upload profile picture"
						/>
					</div>
					<div class="form-item w-full flex flex-col">
						<label for="first_name" class="text-sm mb-1 font-medium font-satoshi">First name</label>
						<input
							type="text"
							name="first_name"
							disabled={loading}
							bind:value={firstName}
							id="first_name"
							placeholder="First name"
							class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
						/>
						{#if validationErrors?.first_name}
							<sub transition:slide={{ delay: 250, duration: 300 }} class="text-rose-500 text-xs"
								>{validationErrors.first_name[0]}</sub
							>
						{/if}
					</div>
					<div class="form-item w-full flex flex-col">
						<label for="last_name" class="text-sm mb-1 font-medium font-satoshi">Last name</label>
						<input
							type="text"
							name="last_name"
							bind:value={lastName}
							id="last_name"
							disabled={loading}
							placeholder="Last name"
							class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
						/>
						{#if validationErrors?.last_name}
							<sub transition:slide={{ delay: 250, duration: 300 }} class="text-rose-500 text-xs"
								>{validationErrors.last_name[0]}</sub
							>
						{/if}
					</div>

					<div class="form-item w-full flex flex-col gap-1">
						<label for="preferred_name" class="text-sm mb-1 font-medium font-satoshi"
							>Preferred Name</label
						>
						<input
							type="text"
							name="preferred_name"
							bind:value={preferred_name}
							id="preferred_name"
							placeholder="Enter preferred name"
							class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
						/>
						{#if validationErrors?.preferred_name}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]"
								>{validationErrors.preferred_name[0]}</sub
							>
						{/if}
					</div>

					<div class="form-item w-full flex flex-col gap-1">
						<label for="phone_number" class="text-sm mb-1 font-medium font-satoshi"
							>Phone Number</label
						>
						<input
							type="text"
							name="phone_number"
							bind:value={phoneNumber}
							id="phone_number"
							placeholder="Enter phone number"
							class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
						/>
						{#if validationErrors?.phone_number}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]"
								>{validationErrors.phone_number[0]}</sub
							>
						{/if}
					</div>
					<div class="form-item w-full flex flex-col gap-1">
						<label for="address" class="text-sm mb-1 font-medium font-satoshi">Home Address</label>
						<input
							type="text"
							name="address"
							bind:value={address}
							id="address"
							placeholder="Enter address"
							class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
						/>
						{#if validationErrors?.address}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]"
								>{validationErrors.address[0]}</sub
							>
						{/if}
					</div>
					<div class="form-item w-full flex flex-col gap-1">
						<label for="date_of_birth" class="text-sm mb-1 font-medium font-satoshi"
							>Date of Birth</label
						>
						<input
							type="date"
							name="date_of_birth"
							bind:value={dateOfBirth}
							id="date_of_birth"
							placeholder="Enter phone number"
							class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
						/>
						{#if validationErrors?.date_of_birth}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]"
								>{validationErrors.date_of_birth[0]}</sub
							>
						{/if}
					</div>

					<section class="w-full flex flex-col gap-10 mt-3">
						<p class="font-satoshi text-sm text-primary-red">Emergency Contact Information</p>
						<div class="w-full flex flex-col gap-5">
							<div class="form-item w-full flex flex-col">
								<label for="emergency_contact_name" class="text-sm mb-1 font-medium font-satoshi"
									>Name</label
								>
								<input
									type="text"
									name="emergency_contact_name"
									id="emergency_contact_name"
									bind:value={emergencyContactName}
									disabled={loading}
									placeholder="Enter name"
									class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
								/>
								{#if validationErrors?.emergency_contact_name}
									<sub
										transition:slide={{ delay: 250, duration: 300 }}
										class="text-rose-500 text-xs">{validationErrors.emergency_contact_name[0]}</sub
									>
								{/if}
							</div>
							<div class="form-item w-full flex flex-col">
								<label
									for="emergency_contact_relationship"
									class="text-sm mb-1 font-medium font-satoshi">Relationship</label
								>
								<input
									type="text"
									bind:value={emergencyContactRelationship}
									name="emergency_contact_relationship"
									id="emergency_contact_relationship"
									disabled={loading}
									placeholder="Enter emergency contact relationship"
									class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
								/>
								{#if validationErrors?.emergency_contact_relationship}
									<sub
										transition:slide={{ delay: 250, duration: 300 }}
										class="text-rose-500 text-xs"
										>{validationErrors.emergency_contact_relationship[0]}</sub
									>
								{/if}
							</div>
							<div class="form-item w-full flex flex-col">
								<label for="emergency_phone_number" class="text-sm mb-1 font-medium font-satoshi"
									>Phone Number</label
								>
								<input
									type="text"
									name="emergency_contact_number"
									bind:value={emergencyContactNumber}
									id="emergency_contact_number"
									disabled={loading}
									placeholder="Enter emergency phone number"
									class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
								/>
								{#if validationErrors?.emergency_contact_number}
									<sub
										transition:slide={{ delay: 250, duration: 300 }}
										class="text-rose-500 text-xs"
										>{validationErrors.emergency_contact_number[0]}</sub
									>
								{/if}
							</div>
						</div>
					</section>
				</section>
			</div>
		</section>
		<Sheet.Footer class="w-full  px-3 ">
			<div class="w-full px-4">
				<Button
					disabled={loading}
					type="submit"
					class="flex w-full bg-primary-red gap-2 items-center font-satoshi text-sm font-bold text-white py-2.5 px-3 rounded-md hover:bg-primary-100"
				>
					{#if loading}
						<iconify-icon width="25" icon="eos-icons:three-dots-loading"></iconify-icon>
					{:else}
						<span> Proceed</span>

						<iconify-icon icon="ep:right" width="15"></iconify-icon>
					{/if}
				</Button>
			</div>
		</Sheet.Footer>
	</form>
</Modal> -->
