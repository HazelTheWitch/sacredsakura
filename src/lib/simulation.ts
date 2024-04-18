import { CanonMap } from "big-m";

export type TransitionFunction<T> = (state: T) => CanonMap<T, number>;
export type GoalFunction<T> = (state: T) => boolean;
export type SimulationOutput = { probabilities: CanonMap<number, number>, remaining: number, completed: boolean };

export class Simulation<T> {
    states: CanonMap<T, number>
    transition: TransitionFunction<T>
    goal: GoalFunction<T>
    final_probabilities: CanonMap<number, number>
    iteration: number
    remaining: number

    constructor(
        transition: TransitionFunction<T>,
        goal: GoalFunction<T>,
        initial_state: T
    ) {
        this.states = new CanonMap([[initial_state, 1.0]]);
        this.transition = transition;
        this.goal = goal;

        this.final_probabilities = new CanonMap();
        this.iteration = 0;
        this.remaining = 1;
    }

    output(): SimulationOutput {
        return {
            probabilities: this.final_probabilities,
            remaining: this.remaining,
            completed: this.states.size == 0,
        }
    }

    simulate_step(): boolean {
        if (this.states.size == 0) {
            this.remaining = 0;
            return true;
        }

        let next_states: CanonMap<T, number> = new CanonMap();

        for (let [state, probability] of this.states.entries()) {
            if (probability > 0) {
                if (this.goal(state)) {
                    this.final_probabilities.set(this.iteration, (this.final_probabilities.get(this.iteration) || 0) + probability);
                    this.remaining -= probability;
                } else {
                    for (let [next_state, second_probability] of this.transition(state).entries()) {
                        next_states.set(next_state, (next_states.get(next_state) || 0) + probability * second_probability);
                    }
                }
            }
        }
        
        this.iteration++;
        this.states = next_states;

        return false;
    }

    simulate_to_goal(): SimulationOutput {
        while (!this.simulate_step()) {}

        return this.output();
    }

    simulate(steps: number): SimulationOutput {
        for (let i = 0; i < steps; i ++) {
            if (this.simulate_step()) {
                return this.output()
            }
        }
    
        return this.output();
    }
}

export function combine(first: CanonMap<number, number>, second: CanonMap<number, number>): CanonMap<number, number> {
    let combined: CanonMap<number, number> = new CanonMap();

    for (let [first_steps, first_probability] of first.entries()) {
        for (let [second_steps, second_probability] of second.entries()) {
            const total = first_steps + second_steps;

            combined.set(total, (combined.get(total) || 0) + first_probability * second_probability);
        }
    }

    return combined
}

export function cumulative(probabilities: CanonMap<number, number>): CanonMap<number, number> {
    let cumulative: CanonMap<number, number> = new CanonMap();

    let max_step = Math.max(...probabilities.keys());

    for (let i = 0; i <= max_step; i++) {
        cumulative.set(i, (probabilities.get(i) || 0) + (cumulative.get(i - 1) || 0))
    }

    return cumulative;
}
