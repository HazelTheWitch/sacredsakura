<script lang="ts">
    import { simulate } from "../lib/simulation";
    import { character_transition, character_goal } from "../lib/genshin/character";

    export let pity: number;
    export let guaranteed: boolean;
    export let desired_copies: number;
    export let max_wishes: number;
</script>

{simulate(character_transition, character_goal(desired_copies), {pity, limited: 0, guaranteed}, max_wishes).remaining}
