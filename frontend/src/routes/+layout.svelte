<script>
	import '../app.postcss';

	import Icon from "@iconify/svelte";
</script>

<main class="text-blossom-400 bg-blossom-900 genshin-font h-full flex flex-col items-center">
	<nav class="flex items-center justify-between w-full">
		<a href="/" class="text-xl link flex items-center">
			<div class="p-6">
				<Icon icon="emojione-monotone:cherry-blossom" height="3rem" color="#f1a7be" />
			</div>
			<span>Sacred Sakura</span>
		</a>
		<div class="flex items-center text-lg p-6 mx-6">
			<a href="/artifacts" class="link">Artifacts</a>
		</div>
	</nav>
	
	<div class="container">
		<slot />
	</div>
</main>

<style>
    @font-face {
        font-family: 汉仪文黑-85W;
        src: url('/zhcn.ttf');
    }

    .genshin-font {
        font-family: '汉仪文黑-85W', sans-serif;
    }
</style>