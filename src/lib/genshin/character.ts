import { CanonMap } from "big-m";

export type CharacterState = {pity: number, limited: number, guaranteed: boolean};

export function character_transition(state: CharacterState): CanonMap<CharacterState, number> {
    const five_star_probability = Math.min(0.006 + 0.06 * Math.max(0, state.pity - 72), 1);

    if (state.guaranteed) {
        return new CanonMap([
            [no_drop(state), 1 - five_star_probability],
            [limited_drop(state), five_star_probability],
        ]);
    } else {
        return new CanonMap([
            [no_drop(state), 1 - five_star_probability],
            [standard_drop(state), five_star_probability * 0.5],
            [limited_drop(state), five_star_probability * 0.5],
        ]);
    }
}

export function character_initial(pity: number, guaranteed: boolean): CharacterState {
    return {pity, limited: 0, guaranteed};
}

export function character_goal(limited_count: number): (state: CharacterState) => boolean {
    return (state: CharacterState) => { return state.limited >= limited_count };
}

function no_drop(state: CharacterState): CharacterState {
    return Object.freeze({...state, pity: state.pity + 1})
}

function limited_drop(state: CharacterState): CharacterState {
    return Object.freeze({pity: 0, limited: state.limited + 1, guaranteed: false})
}

function standard_drop(state: CharacterState): CharacterState {
    return Object.freeze({...state, pity: 0, guaranteed: true})
}
