<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Modal from '$lib/components/Modal.svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { LoggedinUsers, mediaState } from '$lib/stores.js';
	import { currentUser } from '$lib/user.js';
	import { showToast, updateLoggedInUsers, type loggedInUser, type ToastType } from '$lib/utils.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { onDestroy, onMount } from 'svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import MediaManager from '$lib/components/MediaManager.svelte';
	import LoggedInUsersActions from '$lib/components/LoggedInUsersActions.svelte';
	export let data;
	const { user } = data;

	let message = $page.url.searchParams.get('message') as string;
	let messageType = $page.url.searchParams.get('type') as ToastType;

	onMount(() => {
		if (message && messageType) {
			showToast(message, messageType);
			$page.url.searchParams.delete('message');
			$page.url.searchParams.delete('type');
		}
	});

	currentUser.set(user);

	let userToLogin: loggedInUser | null;

	const unsubscribe = currentUser.subscribe((currUser) => (currUser = currUser));
	const unsubscribeLoggedInUsers = LoggedinUsers.subscribe((users) => (users = users));

	let showModal: boolean = false;
	let loading: boolean = false;

	function selectUserToLogin(user: loggedInUser) {
		userToLogin = user;
	}
	function toggleModal() {
		showModal = !showModal;
	}
	let validationErrors: { email?: string; password?: string };

	const submit: SubmitFunction = async ({ formData }) => {
		loading = true;
		if (userToLogin?.email) {
			formData.append('email', `${userToLogin.email}`);
		}
		// const previous = $page.url.searchParams.get('from');
		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					let currUser = result.data.currUser;
					currentUser.set(currUser);
					showToast('Login successful', 'success');
					toggleModal();
					userToLogin = null;
				} else if (result.status === 400) {
					validationErrors = result.data.errors;
				} else if (result.status === 401) {
					showToast(`${result.data.message}`, 'error');
				} else if (result.status === 500) {
					showToast(`${result.data.message}`, 'error');
				}
			} finally {
				update();
				loading = false;
			}
		};
	};

	updateLoggedInUsers($currentUser);

	mediaState.update((state) => ({ ...state, images: data.images?.results }));

	const unsubscribeMedia = mediaState.subscribe((val) => (val = val));

	onDestroy(() => {
		unsubscribe();
		unsubscribeMedia();
		unsubscribeLoggedInUsers();
	});
</script>

<Modal
	showModal={$mediaState.isOpen}
	on:close={() => mediaState.update((state) => ({ ...state, isOpen: false }))}
>
	<div slot="modal-content">
		<MediaManager />
	</div>
</Modal>
<div class="flex max-h-screen h-full overflow-hidden max-w-[100vw] w-full bg-[#F9F9F9]">
	<SideNav on:showSwitch={toggleModal} />
	<div
		class="flex-1 overflow-y-scroll h-screen relative lg:m-4 md:rounded-lg pt-10 md:p-8 px-5 max-xsm:mb-16 bg-white"
	>
		<slot />
	</div>
</div>

<Modal {showModal}>
	<svelte:fragment slot="modal-content">
		<LoggedInUsersActions
			action="/?/login"
			bind:loading
			bind:userToLogin
			bind:validationErrors
			on:close={toggleModal}
			{submit}
		/>
	</svelte:fragment>
</Modal>
