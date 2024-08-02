<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { staffProfileErrors, User } from '$lib/user';
	import { showToast } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import { enhance } from '$app/forms';
	import UploadBox from '$lib/components/UploadBox.svelte';
	import { slide } from 'svelte/transition';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let currentStaff: User = null;
	export let view: 'employee' | 'manager' = 'employee';
	export let formaction: string = '';

	const dispatch = createEventDispatcher();

	let loading: boolean = false;
	let validationErrors: staffProfileErrors = {};

	let firstName = currentStaff?.staff_profile?.first_name;
	let lastName = currentStaff?.staff_profile?.last_name;
	let emergencyContactName = `${currentStaff?.staff_profile?.emergency_contact_name}`;
	let emergencyContactNumber = currentStaff?.staff_profile?.emergency_contact_number;
	let emergencyContactRelationship = currentStaff?.staff_profile?.emergency_contact_relationship;
	let address = currentStaff?.staff_profile?.address;
	let dateOfBirth = currentStaff?.staff_profile?.date_of_birth;
	let phoneNumber = currentStaff?.staff_profile?.phone_number;
	let preferred_name = currentStaff?.staff_profile?.preferred_name;
	let preferred_hours = currentStaff?.staff_profile?.preferred_weekly_working_hours;

	const submit: SubmitFunction = async ({ formData }) => {
		loading = true;
		let hasExistingProfile =
			currentStaff?.staff_profile !== undefined && currentStaff?.staff_profile !== null;

		formData.append('hasExistingProfile', hasExistingProfile.toString());

		return async ({ update, result }) => {
			try {
				if (result.status === 200) {
					if (result.data.edit) {
						const editedProfile = result.data.updatedStaffProfile as User;
						dispatch('updated', { user: editedProfile });
						showToast('Profile updated successfully', 'success');
					} else {
						const newProfile = result.data.newStaffProfile as User;
						dispatch('updated', { user: newProfile });
						showToast('Profile completed successfully', 'success');
					}
				} else if (result.status === 400) {
					validationErrors = result.data.errors;
				} else {
					showToast('Ooops something went wrong', 'error');
				}
			} finally {
				await update();
				loading = false;
			}
		};
	};
</script>

<form
	action={formaction}
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
						<span>{currentStaff ? 'Edit' : 'Complete'} profile</span>
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
				>Kindly fill information below to {view === 'manager' && currentStaff
					? 'edit staff'
					: view === 'employee' && currentStaff
						? 'edit your'
						: 'complete your'} profile.</span
			>
			<section class="w-full px-3 flex flex-col gap-5">
				<div class="form-item w-full flex flex-col mb-5">
					<UploadBox
						inputName="profile_picture_id"
						small={true}
						defaultValue={currentStaff?.staff_profile?.profile_picture}
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
				{#if view === 'manager'}
					<div class="form-item w-full flex flex-col gap-1">
						<label for="preferred_hours" class="text-sm mb-1 font-medium font-satoshi"
							>Preferred Work Hours</label
						>
						<input
							type="number"
							name="preferred_hours"
							bind:value={preferred_hours}
							id="preferred_hours"
							placeholder="Enter preferred work hours"
							class="w-full px-4 py-2.5 border rounded-md outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi"
						/>
						{#if validationErrors?.preferred_hours}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]"
								>{validationErrors.preferred_hours[0]}</sub
							>
						{/if}
					</div>
				{/if}

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
							class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.address[0]}</sub
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
								<sub transition:slide={{ delay: 250, duration: 300 }} class="text-rose-500 text-xs"
									>{validationErrors.emergency_contact_name[0]}</sub
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
								<sub transition:slide={{ delay: 250, duration: 300 }} class="text-rose-500 text-xs"
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
								<sub transition:slide={{ delay: 250, duration: 300 }} class="text-rose-500 text-xs"
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
					<span> {currentStaff ? 'Update' : 'Proceed'}</span>

					<iconify-icon icon="ep:right" width="15"></iconify-icon>
				{/if}
			</Button>
		</div>
	</Sheet.Footer>
</form>
