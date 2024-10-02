<script lang="ts">
</script>

<div class="context-hidden-layout bg-none px-3 md:w-[500px]">
	<div class="h-3 w-full rounded-tl-[8px] rounded-tr-[8px] bg-[#F5F5F5]"></div>
</div>
<div class="auth-context rounded-[12px] bg-white p-10 shadow md:w-[500px]">
	<div class="flex items-center justify-center">
		<slot name="context-image" />
	</div>
	<div class="space-y-1 pt-[24px] text-center">
		<h2 class="font-inter text-2xl font-medium text-primary-black">
			<slot name="context-title" />
		</h2>
		<p class="text-sm text-grey-100"><slot name="context-description" /></p>
	</div>

	<div class="">
		<slot name="context-content" />
	</div>
</div>

<style>
	.auth-context {
		box-shadow: 0px 2.5px 8px 0px #00000014;
	}
</style>
