<script lang="ts">
    export let name: string;
    export let value: any;
</script>


<div>{name}<input class="px-2" type="text" bind:value></div>
