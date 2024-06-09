<script lang="ts">
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { showToast } from '$lib/utils';
	import { goto } from '$app/navigation';

	let loading: boolean = false; //to show button loader or whatever loader we decide on

	let validationErrors: {
		email?: [string];
		password?: [string];
		password2?: [string];
	};

	let currInputType = 'password';

	const toggleInputType = () => {
		if (currInputType === 'password') {
			document.querySelectorAll('#password, #confirm-password').forEach((input) => {
				input.type = 'text';
			});
			currInputType = 'text';
		} else {
			document.querySelectorAll('#password, #confirm-password').forEach((input) => {
				input.type = 'password';
			});
			currInputType = 'password';
		}
	};

	// onMount(async () => {});
</script>

<svelte:head>
	<title>Setup Admin - Spek-n-Boonen</title>
</svelte:head>

<div class="min-h-screen max-w-screen flex justify-center items-center bg-[#F2F2F2]">
	<form
		action="?/setup"
		method="post"
		use:enhance={() => {
			//this function helps us to progressively enhance the form when js is enabled, it's better to read on it from joyOfCode's blog
			loading = true;

			return async ({ result, update }) => {
				try {
					if (result.status === 400) {
						// console.log('works');
						if (result.data?.errors) {
							validationErrors = result.data?.errors;
						}
					} else if (result.status === 200) {
						await goto('login');
						showToast('Account created successfully', 'success');
					} else if (result.status === 500) {
						showToast(`${result.data.message}`, 'error');
					}
				} finally {
					loading = false;
					await update(); //prevents form from resetting after being submitted
				}
			};
		}}
		class="w-full mx-2 my-5 md:my-0 flex items-center justify-center"
	>
		<div
			class="bg-white shadow-none border-none rounded-2xl px-5 py-7 md:py-12 md:px-7 text-[#2d2d2d] flex flex-col justify-center items-center gap-10 xs:w-[95%] min-w-5/6 md:max-w-[30.25rem]"
		>
			<div class="greeting w-full">
				<div class="flex gap-[1.88rem] items-center w-full">
					<div class="avatar w-auto h-16 flex items-center justify-center">
						<img src="/icons/user.svg" alt="avatar" />
					</div>
					<div class="admin gap-2 w-auto justify-center">
						<h1 class="text-[1.1rem] lg:text-2xl font-medium tracking-[-0.03rem] whitespace-nowrap">
							Setup admin account
						</h1>
						<p class="text-[0.8rem] lg:text-[0.9375rem] tracking-[-0.00938rem] text-[#575757]">
							Enter your credentials below
						</p>
					</div>
				</div>
			</div>
			<div class=" flex flex-col gap-[1.28rem] w-full">
				<div class="email flex flex-col w-full">
					<label for="email" class="block mb-2 text-[ 0.875rem]">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						placeholder="Enter your Email"
						class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.email}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email[0]}</sub
						>
					{/if}
				</div>

				<div class="password">
					<label for="password" class="block mb-2 text-[0.875rem]">Password</label>
					<div class="w-full relative flex items-center px-0">
						<input
							type={currInputType}
							name="password"
							id="password"
							placeholder="Enter your password"
							class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9]"
						/>
						<button
							type="button"
							on:click={toggleInputType}
							class="absolute right-1 flex items-center cursor-pointer z-10 w-max p-2"
						>
							<span class={currInputType === 'password' ? 'flex items-center' : 'hidden'}>
								<iconify-icon icon="carbon:view" width="20"></iconify-icon>
							</span>
							<span class={currInputType === 'text' ? ' flex items-center' : 'hidden'}>
								<iconify-icon icon="carbon:view-off" width="20" class=""></iconify-icon>
							</span>
						</button>
					</div>
					{#if validationErrors?.password}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.password}</sub
						>
					{/if}
				</div>

				<div class="password">
					<label for="confirm-password" class="block mb-2 text-[0.875rem]">Confirm Password</label>
					<div class="w-full relative flex items-center px-0">
						<input
							type={currInputType}
							name="confirm-password"
							id="confirm-password"
							placeholder="Confirm your password"
							class="input w-full focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9]"
						/>
						<button
							type="button"
							on:click={toggleInputType}
							class="absolute right-1 flex items-center cursor-pointer z-10 w-max p-2"
						>
							<span class={currInputType === 'password' ? 'flex items-center' : 'hidden'}>
								<iconify-icon icon="carbon:view" width="20"></iconify-icon>
							</span>
							<span class={currInputType === 'text' ? ' flex items-center' : 'hidden'}>
								<iconify-icon icon="carbon:view-off" width="20" class=""></iconify-icon>
							</span>
						</button>
					</div>
					{#if validationErrors?.password2}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.password2}</sub
						>
					{/if}
				</div>

				<div class="submit w-full flex flex-col gap-[1.88rem]">
					<button
						disabled={loading}
						class="bg-primary-50 py-[0.88rem] px-[0.63rem] rounded-[8px] w-full
                    hover:bg-[#C7453C] hover:rounded-[0.625rem] text-white font-bold text-sm max-h-12 flex items-center justify-center
                    focus:shadow-custom
                    "
						type="submit"
					>
						{#if loading}
							<iconify-icon width="25" icon="eos-icons:three-dots-loading"></iconify-icon>
						{:else}
							<span class="button-text">Sign up</span>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</form>
</div>
