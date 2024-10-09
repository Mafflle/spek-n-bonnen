<script lang="ts">
	import { computePosition, flip, shift, offset, arrow } from '@floating-ui/dom';

	import Dropdown from '$components/Dropdown.svelte';
	import DropdownContent from '$components/DropdownContent.svelte';
	import { browser } from '$app/environment';

	let overProfile = false;
	let dropdownIsOpen = false;

	let dropdownTrigger;
	let dropdown;
	let arrowElement;

	$: if (browser && dropdownTrigger && dropdown && arrowElement) {
		computePosition(dropdownTrigger, dropdown, {
			placement: 'bottom-end',
			middleware: [offset(28), flip(), shift({ padding: 5 }), arrow({ element: arrowElement })]
		}).then(({ x, y, placement, middlewareData }) => {
			Object.assign(dropdown.style, {
				left: `${x}px`,
				top: `${y}px`
			});

			const { x: arrowX, y: arrowY } = middlewareData.arrow;

			const staticSide = {
				top: 'bottom',
				right: 'left',
				bottom: 'top',
				left: 'right'
			}[placement.split('-')[0]];

			Object.assign(arrowElement.style, {
				left: arrowX != null ? `${arrowX}px` : '',
				top: arrowY != null ? `${arrowY}px` : '',
				right: '',
				bottom: '',

				[staticSide]: '-8px'
			});
		});
	}
</script>

<div class="sticky top-0 flex h-14 w-full items-center bg-white">
	<div class="flex w-full items-center justify-between px-6 py-1.5">
		<div
			class="flex h-8 min-w-[380px] items-center gap-2 rounded border border-grey-200 px-3 py-1.5"
		>
			<span class="h-5 w-5"
				><img class="h-full w-full" src="/icons/search-normal.svg" alt="search icon" /></span
			>
			<input
				class="h-full w-full placeholder:text-xs placeholder:font-medium placeholder:text-grey-special focus:outline-none"
				placeholder="Search anything"
				type="text"
				name=""
				id=""
			/>
		</div>
		<section class="relative flex items-center gap-4">
			<span class="h-5 w-5">
				<img src="/icons/notification.svg" alt="bell icon" />
			</span>

			<Dropdown
				bind:open={dropdownIsOpen}
				on:toggledMouseOver={(e) => {
					overProfile = e.detail;
				}}
				on:toggledDropdown={(e) => (dropdownIsOpen = e.detail)}
				showIcon={false}
				handleClickOutside={true}
			>
				<svelte:fragment slot="dropdown-trigger">
					<span
						bind:this={dropdownTrigger}
						class="flex h-10 w-16 items-center gap-1 rounded-full border border-grey-200 bg-grey-bg px-1"
					>
						<span class="h-8 w-full"
							><img src="/icons/avatar.svg" class="h-full w-full" alt="user avatar" /></span
						>

						<span
							class:rotate={dropdownIsOpen}
							class="flex {overProfile ? 'text-primary' : 'text-grey-special'}"
						>
							<iconify-icon width="20" icon="system-uicons:chevron-down"></iconify-icon>
						</span>
					</span>
				</svelte:fragment>

				<svelte:fragment slot="dropdown-content">
					<DropdownContent bind:isOpen={dropdownIsOpen}>
						<svelte:fragment slot="dropdown-items">
							<div
								bind:this={dropdown}
								class="profile-dropdown item-center absolute left-0 top-0 flex h-[250px] w-[300px] flex-col justify-center rounded-lg bg-white"
							>
								<div class="flex w-full flex-col items-center justify-center gap-2.5 border-b py-5">
									<span>
										<img src="/icons/bigAvatar.svg" alt="user avatar" />
									</span>

									<div class=" flex flex-col items-center justify-center gap-0.5">
										<span class="role-tag rounded px-1.5 text-sm text-white"> Admin </span>
										<p class="font-medium text-primary-black">John Doelittle</p>
										<span class="text-sm font-medium text-[#949494]">doelittlejohn@gmail.com</span>
									</div>
								</div>
								<div class="flex items-center justify-center py-4">
									<button
										class=" flex items-center gap-1 rounded px-4 py-2 font-medium text-[#949494] transition-all hover:bg-grey-bg"
									>
										<span class="">
											<img src="/icons/logout.svg" class="h-full w-full" alt="Logout icon" />
										</span>
										<span class="">Switch account</span>
									</button>
								</div>
								<div bind:this={arrowElement} id="arrow"></div>
							</div>
						</svelte:fragment>
					</DropdownContent>
				</svelte:fragment>.
			</Dropdown>
		</section>
	</div>
</div>

<style>
	.profile-dropdown {
		box-shadow: 0px 8px 14.2px 0px #8383832b;
	}
	.role-tag {
		background: linear-gradient(97.86deg, #c191ff -11.18%, #5647ff 106.72%);
		opacity: 0px;
	}
	#arrow {
		position: absolute;
		z-index: -1;
		background: white;
		width: 24px;
		height: 24px;
		transform: rotate(45deg);
	}
</style>
