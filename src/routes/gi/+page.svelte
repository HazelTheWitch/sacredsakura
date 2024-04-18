<script lang="ts">
    import { Simulation, combine, cumulative } from "../../lib/simulation";
    import { character_transition, character_goal, character_initial } from "../../lib/genshin/character";
    import { weapon_transition, weapon_goal, weapon_initial } from "../../lib/genshin/weapon";
	import { CanonMap } from "big-m";
	import Input from "../../components/Input.svelte";

	let cached = {
		pity_character: 0,
		guaranteed_character: false,
		desired_copies_character: 0,
		pity_weapon: 0,
		guaranteed_weapon: false,
		fate_points_weapon: 0,
		desired_copies_weapon: 0,
		max_wishes: 0,
	};
	
	let pity_character = "0";
	let guaranteed_character = false;
	let desired_copies_character = "0";
	let pity_weapon = "0";
	let guaranteed_weapon = false;
	let fate_points_weapon = "0";
	let desired_copies_weapon = "0";
	let max_wishes = "0";

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

	let probabilities = new CanonMap([[0, 1]]);

	let chance = 1;

	function update() {
		cached = {
			pity_character: parseInt(pity_character),
			guaranteed_character,
			desired_copies_character: parseInt(desired_copies_character),
			pity_weapon: parseInt(pity_weapon),
			guaranteed_weapon,
			fate_points_weapon: parseInt(fate_points_weapon),
			desired_copies_weapon: parseInt(desired_copies_weapon),
			max_wishes: parseInt(max_wishes),
		};

		probabilities = success_probability(cached.pity_character, cached.guaranteed_character, cached.desired_copies_character, cached.pity_weapon, cached.guaranteed_weapon, cached.fate_points_weapon, cached.desired_copies_weapon);

		chance = probabilities.get(cached.max_wishes);
	}
</script>


<div class="grid grid-cols-2">
	<Input name="Character Pity" bind:value={pity_character} />
	<div>Guaranteed Character<input class="px-2" type="checkbox" bind:value={guaranteed_character}></div>
	<Input name="Desired Character Copies" bind:value={desired_copies_character} />
	<Input name="Weapon Pity" bind:value={pity_weapon} />
	<div>Guaranteed Weapon<input class="px-2" type="checkbox" bind:value={guaranteed_weapon}></div>
	<Input name="Fate Points" bind:value={fate_points_weapon} />
	<Input name="Desired Weapon Copies" bind:value={desired_copies_weapon} />
	<Input name="Wishes" bind:value={max_wishes} />
</div>

<button class="p-4" on:click={update}>Submit</button>

<br>

You have a {Math.round(chance * 10000) / 100}% chance.
