import { CanonMap } from "big-m";

export type TransitionFunction<T> = (state: T) => CanonMap<T, number>;
export type GoalFunction<T> = (state: T) => boolean;

export function simulate<T>(
    transition: TransitionFunction<T>,
    goal: GoalFunction<T>,
    initial_state: T,
    max_steps: number
): { probabilities: CanonMap<number, number>, remaining: number } {
    let final_states: CanonMap<number, number> = new CanonMap();
    let states = new CanonMap([[initial_state, 1.0]]);

    for (let i = 0; i < max_steps; i ++) {
        if (states.size == 0) {
            return {probabilities: final_states, remaining: 0};
        }

        let next_states: CanonMap<T, number> = new CanonMap();

        for (let [state, probability] of states.entries()) {
            if (probability > 0) {
                if (goal(state)) {
                    final_states.set(i, (final_states.get(i) || 0) + probability);
                } else {
                    for (let [next_state, second_probability] of transition(state).entries()) {
                        next_states.set(next_state, (next_states.get(next_state) || 0) + probability * second_probability);
                    }
                }
            }
        }
        
        states = next_states;
    }

    return {probabilities: final_states, remaining: [...states.values()].reduce((x, a) => x + a, 0)};
}

export function cumulative(probabilities: CanonMap<number, number>): CanonMap<number, number> {
    let cumulative: CanonMap<number, number> = new CanonMap();

    let max_step = Math.max(...probabilities.keys());

    for (let i = 0; i <= max_step; i++) {
        cumulative.set(i, (probabilities.get(i) || 0) + (cumulative.get(i - 1) || 0))
    }

    return cumulative;
}
