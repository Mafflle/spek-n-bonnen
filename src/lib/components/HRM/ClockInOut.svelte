<script lang="ts">
	let timerState: 'running' | 'paused' | 'stopped' | 'inactive' = 'inactive';

	function handleTimerAction(newState: 'running' | 'paused' | 'stopped' | 'inactive') {
		timerState = newState;
		console.log(timerState);

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
			disabled={timerState === state.state}
		>
			<img
				class="w-full h-full transition-all"
				src="/icons/{timerState === state.state ? state.activeSrc : state.src}"
				alt={state.alt}
			/>
		</button>
	{/each}
</span>
