<script lang="ts">
	import Card from "../ui/Card.svelte";

    let cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
</script>

<div class="flex flex-col items-center justify-center">
	<img
		src="/sacred_sakura_background.jpg"
		alt="Sacred sakura tree"
		height="12rem"
		width="100%"
		class="h-[30vh] object-cover object-top"
	/>
    <h1 class="text-5xl m-6">Welcome to Sacred Sakura!</h1>
    <div class="flex flex-wrap w-5/6">
        {#each cards as i}
            <a href="/artifacts">
                <Card title="Card {i}" subtitle="Subtitle {i}">
                    <p slot="text">Artifacts</p>
                </Card>
            </a>
        {/each}
    </div>    
</div>
