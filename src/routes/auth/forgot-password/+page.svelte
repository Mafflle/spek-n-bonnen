<script>
	/**
	 * @type {string}
	 */
	let email = '';
</script>

<div class="h-screen w-screen flex justify-center items-center bg-[#F2F2F2]">
	<form>
		<div
			class="bg-white shadow-none border-none rounded-[16px] py-[50px] px-[30px] text-[#2d2d2d] flex flex-col justify-center items-center gap-10 w-[28.25rem]"
		>
			<div class="pass-avatar">
				<img src="/icons/pass.svg" alt="password svg" />
			</div>
			<div class="card-text flex flex-col gap-2 text-center">
				<h1 class="text-2xl tracking-[-0.03rem] font-medium">Forgotten password?</h1>
				<div class="text-[#575757] text-[0.9375rem] tracking-[-0.00938rem]">
					Don’t worry, enter your Email to get a new one
				</div>
			</div>
			<div class="email-input">
				<input
					type="email"
					id="email"
					placeholder="Enter your Email"
					class="input w-[25rem] focus:border-1 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
				/>
			</div>
			<div class="submit">
				<button
					class="bg-primary-50 py-[0.88rem] px-[0.63rem] rounded-[10px] w-[25rem]
                    hover:bg-[#C7453C] hover:rounded-[0.625rem]
                    focus:shadow-custom
                    "
					type="submit"
				>
					<div class="button-text text-white font-bold text-sm">Reset password</div>
				</button>
			</div>
			<a href="/login" class="back flex items-center gap-[0.5625rem] hover:underline">
				<div class="back-icon">
					<img src="/icons/arrow-left.svg" alt="back icon" />
				</div>
				<div class="back-text text-[0.875rem] tracking-[-0.00875rem] font-medium">
					Back to log in
				</div>
			</a>
		</div>
	</form>
</div>
