<script lang="ts">
    import { Simulation, combine, cumulative } from "../lib/simulation";
    import { character_transition, character_goal, character_initial } from "../lib/genshin/character";
    import { weapon_transition, weapon_goal, weapon_initial } from "../lib/genshin/weapon";
	import { CanonMap } from "big-m";

    export let pity_character: number;
    export let guaranteed_character: boolean;
    export let desired_copies_character: number;

    export let pity_weapon: number;
    export let guaranteed_weapon: boolean;
    export let fate_points_weapon: number;
    export let desired_copies_weapon: number;

    export let max_wishes: number;

    function success_probability(
        pity_character: number,
        guaranteed_character: boolean,
        desired_copies_character: number,
        pity_weapon: number,
        guaranteed_weapon: boolean,
        fate_points_weapon: number,
        desired_copies_weapon: number,
    ): CanonMap<number, number> {
        console.log("simulating");
        const character = new Simulation(character_transition, character_goal(desired_copies_character), character_initial(pity_character, guaranteed_character));
        const character_pulls = character.simulate_to_goal().probabilities;

        const weapon = new Simulation(weapon_transition, weapon_goal(desired_copies_weapon), weapon_initial(pity_weapon, fate_points_weapon, guaranteed_weapon));
        const weapon_pulls = weapon.simulate_to_goal().probabilities;

        return cumulative(combine(character_pulls, weapon_pulls));
    }

    $: simulation_results = success_probability(pity_character, guaranteed_character, desired_copies_character, pity_weapon, guaranteed_weapon, fate_points_weapon, desired_copies_weapon);
</script>

{Math.round(simulation_results.get(max_wishes) * 10000) / 100}%
