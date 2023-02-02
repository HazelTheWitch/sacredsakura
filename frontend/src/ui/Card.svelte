<script lang="ts">
    export let title: string;
    export let subtitle: string;
</script>

<div class="bg-blossom-800 block max-w-xs p-6 border border-blossom-900 rounded-xl shadow hover:bg-blossom-700 cursor-pointer m-6 aspect-[4/3]">
    <h4 class="text-2xl">{title}</h4>
    <h5 class="text-xl">{subtitle}</h5>
    <slot name="text" />
</div>
