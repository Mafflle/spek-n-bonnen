<script lang="ts">
	import { enhance } from '$app/forms';
	import MediaManager from '$lib/components/MediaManager.svelte';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import Modal from '$lib/components/Modal.svelte';
	import UploadBox from '$lib/components/UploadBox.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { currentUser, type profileErrors } from '$lib/user';
	import { showToast } from '$lib/utils.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import dayjs from 'dayjs';
	import { slide } from 'svelte/transition';
	export let data;

	dayjs.extend(relativeTime);
	let { images } = data;

	let showModal: boolean = false;

	let firstName: string = $currentUser?.first_name ?? '';
	let lastName: string = $currentUser?.last_name ?? '';
	let email: string = $currentUser?.email ?? '';

	let loading: boolean = false;
	let validationErrors: {
		first_name?: [string];
		last_name?: [string];
		email?: [string];
		profile_picture_id?: [string];
		title?: [string];
		image?: [string];
	};

	let imageCount: number;

	$: {
		imageCount = images.results.length;
	}

	const toggleModal = () => {
		showModal = !showModal;
	};
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
	let imageValidationError: string;
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
		<Tabs.Root value="profile">
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
				<Tabs.Content value="media-manager">
					<div class="flex-1 flex flex-col gap-5 w-full">
						<div class="mb-6 flex flex-col gap-4 w-full">
							<p>Gallery ({imageCount})</p>
							<section class=" flex justify-between items-center w-full">
								<div
									class="flex items-center sm:w-[18em] border gap-2 rounded-md border-[#D9D9D9] text-[#232222] px-2"
								>
									<span>
										<svg
											width="20x"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
												stroke="#A9A9A9"
												stroke-width="1.5"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
											<path
												d="M21 20.9999L16.65 16.6499"
												stroke="#A9A9A9"
												stroke-width="1.5"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</span>
									<input
										type="text"
										placeholder="Type here"
										class=" py-0.5 flex-auto outline-none placeholder:text-xs"
									/>
								</div>
								<div class="flex items-center gap-3">
									<button
										on:click={toggleModal}
										class="bg-primary-100 py-1.5 px-4 flex items-center gap-1 text-sm rounded-3xl text-white"
									>
										<iconify-icon icon="mingcute:upload-3-fill" width="22	"></iconify-icon>
										<!-- <span>
							<img src="/icons/plus.svg" alt="plus" />
						<!-- </span>  -->
										<span class="hidden sm:block">Upload</span>
									</button>
								</div>
							</section>
						</div>
						<div class="grid grid-cols-3 m gap-10 overflow-scroll no-scrollbar max-h-96">
							{#each images.results as image}
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<div
									class="w-full brand-image-card flex flex-col gap-1 items-start rounded-t-xl border-grey-300"
								>
									<div
										class="brand-image overflow-hidden cursor-pointer relative h-32 self-stretch bg-[#f9f9f9]"
									>
										<img
											class="h-full w-full object-cover aspect-[16/9] object-center rounded-lg"
											src={image.image}
											alt={image.title}
										/>
									</div>
									<div class="media-info flex w-full flex-col items-start gap-2 flex-[1 0 0]">
										<div class="media-name text-base font-medium">{image.title}</div>
										<div class="date-added flex items-center gap-2 self-stretch">
											<div class="date-icon">
												<img src="/icons/clock.svg" alt="clock icon" />
											</div>
											<div class="date text-xs text-grey-100 flex-[1 0 0]">
												Added {dayjs(image.updated_at).fromNow()}
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</Tabs.Content>
			</section>
		</Tabs.Root>
	</section>
</div>

<Modal {showModal} on:close={() => (showModal = false)}>
	<form
		action="/?/upload"
		method="post"
		use:enhance={() => {
			loading = true;

			return async ({ update, result }) => {
				try {
					if (result.status === 200) {
						images.results = [result.data.newMedia, ...images.results];
						showToast('New media uploaded successfully', 'success');

						toggleModal();
					} else if (result.status === 400) {
						validationErrors = result.data.errors;
						if (validationErrors && validationErrors?.image) {
							imageValidationError = validationErrors.image[0];
						}
					} else {
						showToast('Ooops something went wrong!!', 'error');
					}
				} finally {
					loading = false;
					update();
				}
			};
		}}
		enctype="multipart/form-data"
		slot="modal-content"
		class="max-w-md w-full px-6 py-8 flex flex-col gap-5 rounded-md bg-white"
	>
		<UploadBox error={imageValidationError} isFileInput={true} inputName="image" />
		<div class="modal-input">
			<input
				type="text"
				name="image-title"
				id="image-title"
				placeholder="Media name"
				class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
			/>
			{#if validationErrors?.title}
				<sub
					transition:slide={{ delay: 250, duration: 300 }}
					class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.title}</sub
				>
			{/if}
		</div>
		<div class="modal-submit">
			<button
				class="bg-primary-50 py-[0.88rem] px-[0.63rem] rounded-[8px] w-full md:w-[25rem]
					hover:bg-[#C7453C] hover:rounded-[0.625rem]
					focus:shadow-custom text-white font-bold text-sm max-h-12 flex items-center justify-center
					"
				type="submit"
			>
				{#if loading}
					<iconify-icon width="35" icon="eos-icons:three-dots-loading"></iconify-icon>
				{:else}
					<span class="button-text">Upload media</span>
				{/if}
			</button>
		</div>
	</form>
</Modal>
