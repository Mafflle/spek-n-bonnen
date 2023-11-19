<script>
	import { Card, Label, Input } from 'flowbite-svelte';
	import { slide } from 'svelte/transition';

	/**
	 * @type {string}
	 */
	let firstName = '';
	/**
	 * @type {string}
	 */
	let lastName = '';
	/**
	 * @type {string}
	 */
	let email = '';
	/**
	 * @type {string}
	 */
	let password = '';
	/**
	 * @type {string}
	 */
	let confirmPassword = '';
</script>

<div class="min-h-screen min-w-screen flex justify-center items-center bg-[#F5F5F5] py-8">
	<form>
		<Card
			class="bg-white shadow-none rounded-[16px] py-[50px] px-[30px] text-[#2d2d2d] flex gap-10 w-[28.25rem]"
			size="lg"
		>
			<div class="greeting">
				<div class="flex gap-[1.88rem] items-center w-full">
					<div class="avatar w-auto h-16 flex items-center justify-center">
						<img src="/icons/user.svg" alt="avatar" />
					</div>
					<div class="admin gap-2 w-auto h-16 justify-center">
						<h1 class="text-2xl font-medium tracking-[ -0.03rem] whitespace-nowrap">
							Setup admin account
						</h1>
						<sub class="text-[0.9375rem] tracking-[-0.00938rem] text-[#575757]"
							>Enter your credentials below</sub
						>
					</div>
				</div>
			</div>
			<div class="input flex flex-col gap-[1.28rem]">
				<div class="name flex gap-8">
					<div class="first-name">
						<Label for="first_name" class="block mb-2 text-[ 0.875rem]">First name</Label>
						<Input
							id="first_name"
							size="lg"
							placeholder="First name"
							class="focus:border-1 focus:border-[#DA4E45] focus:shadow-custom bg-white border-[#D9D9D9] w-[11.5rem] rounded-[0.5rem]"
							type="text"
							bind:value={firstName}
						/>
					</div>
					<div class="last-name">
						<Label for="last_name" class="block mb-2 text-[ 0.875rem]">Last name</Label>
						<Input
							id="last_name"
							size="lg"
							placeholder="Last name"
							class="focus:border-1 focus:border-[#DA4E45] focus:shadow-custom bg-white border-[#D9D9D9] w-[11.5rem] rounded-[0.5rem]"
							type="text"
							bind:value={lastName}
						/>
					</div>
				</div>
				<div class="email">
					<Label for="email" class="block mb-2 text-[ 0.875rem]">Email</Label>
					<Input
						id="email"
						size="lg"
						placeholder="Enter your Email"
						class="focus:border-1 focus:border-[#DA4E45] focus:shadow-custom bg-white border-[#D9D9D9] w-[25rem] rounded-[0.5rem]"
						type="email"
						bind:value={email}
					/>
				</div>

				<div class="password">
					<Label for="password" class="block mb-2 text-[ 0.875rem]">Password</Label>
					<Input
						id="password"
						size="lg"
						placeholder="Enter your password"
						class="focus:border-1 focus:border-[#DA4E45] focus:shadow-custom bg-white border-[#D9D9D9] w-[25rem] rounded-[0.5rem]"
						type="password"
						bind:value={password}
					/>
					{#if password.length < 8}
						<div
							transition:slide={{ delay: 250, duration: 300 }}
							class="text-[#A9A9A9] text-xs tracking-[-0.0075rem] mt-[0.38rem]"
						>
							Must at least 8 characters
						</div>
					{/if}
				</div>
			</div>

			<div class="password">
				<Label for="password" class="block mb-2 text-[ 0.875rem]">Confirm password</Label>
				<Input
					id="password"
					size="lg"
					placeholder="Confirm your password"
					class="focus:border-1 focus:border-[#DA4E45] focus:shadow-custom bg-white border-[#D9D9D9] w-[25rem] rounded-[0.5rem]"
					type="password"
					bind:value={confirmPassword}
				/>
			</div>
			<div class="submit w-full flex flex-col gap-[1.88rem]">
				<button
					class="bg-primary-50 py-[0.88rem] px-[0.63rem] rounded-[10px] w-[25rem]
                    hover:bg-[#C7453C] hover:rounded-[0.625rem]
                    focus:shadow-custom
                    "
					type="submit"
				>
					<div class="button-text text-white font-bold text-sm">Sign up</div>
				</button>

				<div class="forgot-password">
					<div class="flex gap-[0.38rem] text-[0.8125rem] justify-center">
						<div class="text-[#9C9C9C]">Forgotten password?</div>
						<a href="/" class="hover:underline">Click here to reset</a>
					</div>
				</div>
			</div>
		</Card>
	</form>
</div>
