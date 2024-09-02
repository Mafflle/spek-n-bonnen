<script lang="ts">
  export let title:string;
    export let value:string | undefined;
</script>
<div class="flex flex-col gap-8">
    <div class="form-group">
        <label for="sku" class="form-label">{title}</label>
        <input
            name="sku"
            type="text"
            {value}
            required
            disabled
            class="input w-full focus:border-1 placeholder:text-base placeholder:text-grey-200 focus:border-[#DA4E45] focus:shadow-custom border-[#D9D9D9] rounded-[0.5rem]"
        />
    </div>
</div>