<script>
	import { Card, Label, Input } from 'flowbite-svelte';
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
</script>

<div class="h-screen w-screen flex justify-center items-center bg-[#F2F2F2]">
	<form>
		<Card
			class="bg-white shadow-none border-none rounded-[16px] py-[50px] px-[30px] text-[#2d2d2d] flex flex-col justify-center items-center gap-10 w-[28.25rem]"
			size="lg"
		>
			<div class="greeting">
				<div class="flex gap-[1.88rem] items-center w-full align-center">
					<div class="avatar w-auto h-16 flex items-center justify-center">
						<img src="/icons/user.svg" alt="avatar" />
					</div>
					<div class="admin gap-2 w-auto h-16 justify-center">
						<h1 class="text-2xl font-medium tracking-[ -0.03rem] whitespace-nowrap">
							Welcome back admin
						</h1>
						<sub class="text-[0.9375rem] tracking-[-0.00938rem] text-[#575757]">
							Enter your credentials to log in
						</sub>
					</div>
				</div>
			</div>
			<div class="input flex flex-col gap-[1.28rem]">
				<div class="email">
					<Label for="email" class="block mb-2 text-[ 0.875rem]">Email</Label>
					<Input
						id="email"
						size="lg"
						placeholder="Enter your Email"
						class="focus:border-1 focus:border-[#DA4E45] focus:shadow-custom bg-white border-[#D9D9D9] w-[25rem] rounded[0.5rem]"
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
						class="focus:border-1 focus:border-[#DA4E45] focus:shadow-custom bg-white border-[#D9D9D9] w-[25rem] rounded[0.5rem]"
						type="password"
						bind:value={password}
					/>
				</div>
			</div>
			<div class="submit w-full flex flex-col gap-[1.88rem]">
				<button
					class="bg-primary-50 py-[0.88rem] px-[0.63rem] rounded-[10px] w-[25rem]
					hover:bg-[#C7453C] hover:rounded-[0.625rem]
                    focus:shadow-custom
					"
					type="submit"
				>
					<div class="button-text text-white font-bold text-sm">Log in</div>
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
