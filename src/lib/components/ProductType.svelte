<script>
	import {
		Calendar,
		CaseLower,
		Check,
		ChevronDown,
		CircleDot,
		FileDigit,
		LucideCalendarClock,
		ToggleRight,
		Trash2,
		PlusCircleIcon
	} from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { Switch } from '$lib/components/ui/switch';
	import { Separator } from '$lib/components/ui/separator';
	const dataTypes = [
		{ name: 'Number', icon: FileDigit },
		{ name: 'String', icon: CaseLower },
		{ name: 'Boolean', icon: ToggleRight },
		{ name: 'Datetime', icon: LucideCalendarClock },
		{ name: 'Date', icon: Calendar },
		{ name: 'Checkbox', icon: Check },
		{ name: 'Multiple Choice', icon: CircleDot }
	];
</script>

<div class="flex flex-col items-start gap-6 w-[523px] type__container">
	<div
		class="type__inputs flex flex-col justify-center items-end p-5 gap-4 w-full border-l-4 border-l-yellow-300 rounded-sm"
	>
		<div class="type__dropdowns flex items-start gap-3 w-full">
			<div class="name flex flex-col gap-2 w-1/2">
				<div class="type__name text-sm leading-5 text-black-100 font-medium">Name</div>
				<input
					class="type__input w-full flex items-center py-2 h-[46px] px-2 border border-grey-300 gap-2 rounded-lg
                    outline-none focus:outline-primary-100 focus:border-primary-100 placeholder:text-sm placeholder:font-satoshi
                    "
				/>
			</div>
			<div class="dropdown__container flex flex-col gap-2 w-1/2">
				<div class="dropdown__name text-sm leading-5 text-black-100 font-medium">Data type</div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<div
							class="dropdown__trigger w-full flex items-center py-3 px-2 border border-grey-300 gap-2 rounded-lg"
						>
							<div class="dropdown__placeholder w-[219px] h-5 text-left">Test</div>
							<ChevronDown size="20" />
						</div>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Group>
							{#each dataTypes as type}
								<DropdownMenu.Item class="flex py-2 cursor-pointer px-3 gap-2 rounded-md">
									<svelte:component this={type.icon} size="18" />
									<span class="text-sm leading-4 text-black-100">{type.name}</span>
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>

		<!-- <Separator />
		<div class="type__options flex gap-6 max-h-5 text-grey-200 items-center">
			<Button variant="ghost">
				<Trash2 />
			</Button>
			<Separator orientation="vertical" />
			<div class="toggle-required flex gap-2 items-center">
				<span class="text-sm leading-5 text-black-100">Required</span>
				<Switch class="bg-primary-100" />
			</div>
		</div> -->
	</div>

	<Button class="create-new flex items-center gap-2 text-grey-200 p-0 hover:text-primary-100">
		<PlusCircleIcon />
		<span class="text-sm leading-5">Create new</span>
	</Button>
</div>
