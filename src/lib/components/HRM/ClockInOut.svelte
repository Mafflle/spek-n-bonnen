<script lang="ts">
	import Modal from '../Modal.svelte';
	import Separator from '../ui/separator/separator.svelte';

	let timerState: 'running' | 'paused' | 'stopped' | 'inactive' = 'inactive';
	let showModal: boolean = false;
	export let disabled: boolean = false;
	$: actionToPerform = 'Clock me in';

	function handleTimerAction(newState: 'running' | 'paused' | 'stopped' | 'inactive') {
		timerState = newState;

		if (newState === 'paused') {
			actionToPerform = 'Take a break';
		} else if (newState === 'stopped') {
			actionToPerform = 'Clock me out';
		} else {
			actionToPerform = 'Clock me in';
		}
		// console.log(timerState);
		showModal = true;
		// Add your timer logic here based on newState
	}

	const clockStates: {
		src: string;
		activeSrc: string;
		alt: string;
		state: 'running' | 'paused' | 'stopped' | 'inactive';
	}[] = [
		{
			src: 'play-icon.svg',
			activeSrc: 'play-icon(active).svg',
			alt: 'Play icon',
			state: 'running'
		},
		{
			src: 'pause-icon.svg',
			activeSrc: 'pause-icon(active).svg',
			alt: 'Pause icon',
			state: 'paused'
		},
		{
			src: 'stop-icon.svg',
			activeSrc: 'stop-icon(active).svg',
			alt: 'Stop icon',
			state: 'stopped'
		}
	];
</script>

<span class="flex items-center gap-3.5 justify-center">
	{#each clockStates as state}
		<button
			class="p-0"
			on:click={() => handleTimerAction(state.state)}
			disabled={disabled ? disabled : timerState === state.state}
		>
			<img
				class="w-full h-full transition-all"
				src="/icons/{timerState === state.state ? state.activeSrc : state.src}"
				alt={state.alt}
			/>
		</button>
	{/each}
</span>
<Modal mode="dialog" {showModal} on:close={() => (showModal = false)}>
	<div
		class="min-w-[400px] pb-6 text-black-100 max-w-[510px] w-full rounded-none"
		slot="modal-content"
	>
		<section class="flex justify-between p-4 items-center">
			<div class="flex gap-2 items-center">
				<div class="w-8 h-7">
					<img class="w-full h-full" src="/icons/ScheduleClock.svg" alt="clock icon" />
				</div>
				<h3 class="font-poppins font-semibold text-primary-50">
					{#if showModal}
						{actionToPerform}
					{/if}
				</h3>
			</div>
			<button class="w-fit h-fit" on:click={() => (showModal = false)}>
				<span class="w-7 h-7">
					<img class="w-full h-full" src="/icons/CloseIcon.svg" alt="close icon" />
				</span>
			</button>
		</section>
		<Separator />
		<section
			class="text-black-100 flex-col flex items-center justify-center gap-2 h-[230px] w-full"
		>
			<p class="text-2xl font-bold">20th January 2024</p>
			<h2 class="text-7xl font-bold font-satoshi">7:31am</h2>
		</section>
		<section class="flex w-full p-6">
			<button
				class="w-full flex items-center gap-1.5 justify-center bg-primary-red rounded-lg font-bold text-sm text-white py-2.5 px-4"
			>
				<span> Proceed </span>

				<iconify-icon icon="ep:right" width="15"></iconify-icon>
			</button>
		</section>
	</div>
</Modal>
