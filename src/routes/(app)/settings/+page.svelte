<script lang="ts">
	import { enhance } from '$app/forms';
	import MediaManager from '$lib/components/MediaManager.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import UploadBox from '$lib/components/UploadBox.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { currentUser, type profileErrors } from '$lib/user';
	import { showToast } from '$lib/utils.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { slide } from 'svelte/transition';
	export let data;

	let showModal: boolean = false;

	let firstName: string = $currentUser?.first_name ?? '';
	let lastName: string = $currentUser?.last_name ?? '';
	let email: string = $currentUser?.email ?? '';

	let loading: boolean = false;
	let validationErrors: profileErrors;
	const submit: SubmitFunction = async ({ formData }) => {
		loading = true;
		const profile_picture_id = formData.get('profile_picture_id');
		if (profile_picture_id === $currentUser?.profile_picture) {
			formData.delete('profile_picture_id');
		}

		return async ({ update, result }) => {
			try {
				if (result.status === 200) {
					const editedProfile = result.data.updatedProfile;

					$currentUser = editedProfile;

					showToast('Profile update successful', 'success');
				} else if (result.status === 400) {
					validationErrors = result.data.errors;
				} else {
					showToast('Ooops something went wrong', 'error');
				}
			} finally {
				update({ invalidateAll: false, reset: false });
				loading = false;
			}
		};
	};
</script>

<svelte:head>
	<title>Settings - Spek-n-Boonen</title>
</svelte:head>

<div class="">
	<div class="manage flex flex-col items-start gap-[2.5rem] mb-16">
		<div class="headers flex flex-col items-start gap-[0.25rem]">
			<h1 class="text-3xl text-black-100 font-satoshi tracking-[-0.04rem] font-bold">Settings</h1>
			<sub class="font-satoshi font-medium text-grey-100 text-sm"> Edit and update details.</sub>
		</div>
	</div>
	<section class="max-w-[550px] w-full">
		<Tabs.Root>
			<section
				class="md:sticky top-0 md:px-1 py-4 w-full bg-white overflow-x-scroll no-scrollbar z-10"
			>
				<Tabs.List class=" bg-[#F7F7F7] py-2.5 px-1 w-full ">
					<Tabs.Trigger
						class="w-full data-[state=active]:font-bold data-[state=active]:bg-background data-[state=active]:text-grey-100 data-[state=active]:shadow  "
						value="profile">Profile</Tabs.Trigger
					>

					<Tabs.Trigger
						class="w-full data-[state=active]:font-bold data-[state=active]:bg-background data-[state=active]:text-grey-100 data-[state=active]:shadow"
						value="media-manager">Media manager</Tabs.Trigger
					>
				</Tabs.List>
			</section>
			<section>
				<Tabs.Content value="profile">
					<form
						action="?/manage-profile"
						use:enhance={submit}
						enctype="multipart/form-data"
						method="post"
						class="flex flex-col gap-8 py-5 md:max-w-[80%]"
					>
						<div class="form-group">
							<label for="profile_picture_id" class="form-label mb-4 sr-only">Profile picture</label
							>
							<UploadBox
								small={true}
								smallText="Upload profile image"
								inputName="profile_picture_id"
								defaultValue={$currentUser?.profile_picture}
							/>
						</div>
						<div class="form-group">
							<label for="first_name" class="form-label mb-4">First Name</label>
							<input
								name="first_name"
								type="text"
								bind:value={firstName}
								placeholder="Enter first name"
								class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
							/>
							{#if validationErrors?.first_name}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]"
									>{validationErrors.first_name}</sub
								>
							{/if}
						</div>
						<div class="form-group">
							<label for="last_name" class="form-label mb-4">Last Name</label>
							<input
								name="last_name"
								bind:value={lastName}
								type="text"
								placeholder="Enter last name"
								class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
							/>
							{#if validationErrors?.last_name}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]"
									>{validationErrors.last_name}</sub
								>
							{/if}
						</div>
						<div class="form-group">
							<label for="email" class="form-label mb-4">Email</label>
							<input
								bind:value={email}
								name="email"
								type="text"
								placeholder="Enter email"
								class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
							/>
							{#if validationErrors?.email}
								<sub
									transition:slide={{ delay: 250, duration: 300 }}
									class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email}</sub
								>
							{/if}
						</div>
						<div class="w-full">
							<button
								type="submit"
								class="flex w-full bg-primary-red gap-2 items-center justify-center font-satoshi text-sm font-bold text-white py-3.5 px-3 rounded-md hover:bg-primary-100"
							>
								{#if loading}
									<iconify-icon width="25" icon="eos-icons:three-dots-loading"></iconify-icon>
								{:else}
									<span> Update </span>

									<iconify-icon icon="ep:right" width="15"></iconify-icon>
								{/if}
							</button>
						</div>
					</form>
				</Tabs.Content>
			</section>
		</Tabs.Root>
	</section>
</div>

<Modal on:close={() => (showModal = false)} {showModal}>
	<MediaManager images={data.images.results} slot="modal-content" />
</Modal>
