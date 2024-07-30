<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';

	import { container } from '$lib/stores.js';
	import { Users, type User } from '$lib/user.js';
	import { onDestroy } from 'svelte';
	import * as Avatar from '$lib/components/ui/avatar';

	import InviteStaff from '$lib/components/HRM/forms/InviteStaff.svelte';
	import ManageTask from '$lib/components/HRM/forms/ManageTask.svelte';
	import { currentTask } from '$lib/hrm.js';
	import dayjs from 'dayjs';
	import Button from '$lib/components/ui/button/button.svelte';

	import StaffsTab from '$lib/components/HRM/tabs/StaffsTab.svelte';

	export let data;

	let { groups, access, users } = data;

	let showModal: boolean = false;
	let showTaskDetails: boolean = false;

	$: currentTab = 'staffs';

	const staffManagers = data.staffManagers.results as User[];

	$: {
		Users.set(users.results);
	}

	const toggleModal = () => {
		showModal = !showModal;
	};

	function toggleTaskDetails() {
		showTaskDetails = !showTaskDetails;
	}

	onDestroy(() => {
		container.set([]);
	});
</script>

<svelte:head>
	<title>Staffs - Spek-n-Boonen</title>
</svelte:head>

<div class="staff-page flex-col items-start w-full max-w-full lg:p-0 md:p-4">
	<div class="manage w-full flex flex-col items-start gap-[2.5rem] mb-10">
		<div class="headers w-full flex flex-col items-start gap-[0.25rem]">
			<div class="text-[2rem] tracking-[-0.04rem] font-bold">Staff management</div>
			<sub class="text-[#6B6B6B] text-sm"> Manage employees, assign roles and tasks </sub>
		</div>
		<div class="filters flex items-center w-full justify-between">
			<div
				class="flex items-center md:w-[24em] border gap-2 rounded-md border-[#D9D9D9] text-[#232222] px-2"
			>
				<span>
					<svg
						width="24"
						height="24"
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
				<input type="text" placeholder="Type here" class=" py-2 flex-auto outline-none" />
			</div>

			<div class="filter-buttons flex items-start gap-5">
				<button
					on:click={toggleModal}
					class=" px-2.5 py-2 bg-primary-50 rounded-md justify-center items-center gap-2.5 inline-flex
                    hover:bg-[#C7453C]
                    focus:bg-[#C7453C] focus:shadow-custom focus:border-[#DA4E45]"
				>
					<div class="w-5 h-5 relative">
						<img src="/icons/plus.svg" alt="user-plus" />
					</div>
					<span class="text-white text-sm font-bold font-satoshi hidden sm:block">
						Invite new user
					</span>
				</button>
			</div>
		</div>
	</div>

	<!-- <Separator data-separator-root class="hidden md:block" /> -->

	<StaffsTab />
	<div class="flex items-center gap-4 border-2 rounded-lg absolute mt-1 px-2 right-0">
		<button>prev</button>
		<span>page: 1</span>
		<button>next</button>
	</div>
</div>

<Modal mode="sheet" on:close={toggleModal} {showModal}>
	<div slot="modal-content" class="w-full h-fit max-h-full overflow-x-scroll no-scrollbar">
		<InviteStaff {groups} {access} {staffManagers} />
	</div>
</Modal>
