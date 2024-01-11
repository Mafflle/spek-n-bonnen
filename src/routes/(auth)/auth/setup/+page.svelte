<script lang="ts">
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { showToast } from '$lib/utils';
	import { goto } from '$app/navigation';

	let loading: boolean = false; //to show button loader or whatever loader we decide on

	let validationErrors: {
		email?: [string];
		first_name?: [string];
		last_name?: [string];
		password?: [string];
		password2?: [string];
	};

	// onMount(async () => {});
</script>

<svelte:head>
	<title>Setup Admin - Spek-n-Boonen</title>
</svelte:head>

<div class="min-h-screen max-w-screen py-6 flex justify-center items-center bg-[#F2F2F2]">
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
	>
		<div
			class="bg-white shadow-none border-none rounded-2xl py-12 px-7 text-[#2d2d2d] flex flex-col justify-center items-center gap-10 min-w-[22rem] lg:min-w-[28.25rem]"
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
				<div class="name flex flex-col md:flex-row gap-8">
					<div class="first-name flex flex-col">
						<label for="first-name" class="block mb-2 text-[ 0.875rem]">First name</label>
						<input
							type="text"
							id="first-name"
							name="first-name"
							placeholder="First name"
							class="input w-full md:w-[11.5rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
						/>

						{#if validationErrors?.first_name}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]"
								>{validationErrors.first_name[0]}</sub
							>
						{/if}
					</div>
					<div class="last-name flex flex-col">
						<label for="last-name" class="block mb-2 text-[ 0.875rem]">Last name</label>
						<input
							type="text"
							id="last-name"
							name="last-name"
							placeholder="Last name"
							class="input w-full md:w-[11.5rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
						/>
						{#if validationErrors?.last_name}
							<sub
								transition:slide={{ delay: 250, duration: 300 }}
								class="text-rose-500 text-xs tracking-[-0.0075rem]"
								>{validationErrors.last_name[0]}</sub
							>
						{/if}
					</div>
				</div>
				<div class="email flex flex-col">
					<label for="email" class="block mb-2 text-[ 0.875rem]">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						placeholder="Enter your Email"
						class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.email}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]">{validationErrors.email[0]}</sub
						>
					{/if}
				</div>

				<div class="password flex flex-col">
					<label for="password" class="block mb-2 text-[ 0.875rem]">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						placeholder="Enter your Password"
						class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.password}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]"
							>{validationErrors.password[0]}</sub
						>
					{/if}
				</div>
				<div class="password flex flex-col">
					<label for="confirm-password" class="block mb-2 text-[ 0.875rem]">Confirm password</label>
					<input
						type="password"
						id="confirm-password"
						name="confirm-password"
						placeholder="Confirm your Password"
						class="input w-full md:w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
					/>
					{#if validationErrors?.password2}
						<sub
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-rose-500 text-xs tracking-[-0.0075rem]"
							>{validationErrors.password2[0]}</sub
						>
					{/if}
				</div>
			</div>

			<div class="submit w-full flex flex-col gap-[1.88rem]">
				<button
					disabled={loading}
					class="bg-primary-50 py-[0.88rem] px-[0.63rem] rounded-[8px] w-full md:w-[25rem]
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
	</form>
</div>
