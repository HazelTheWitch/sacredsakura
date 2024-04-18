import { CanonMap } from "big-m";

export type WeaponState = {pity: number, fate: number, limited: number, guaranteed: boolean};

export function weapon_transition(state: WeaponState): CanonMap<WeaponState, number> {
    const five_star_probability = Math.min(0.007 + 0.07 * Math.max(0, state.pity - 62), 1);

    if (state.fate >= 2) {
        return new CanonMap([
            [no_drop(state), 1 - five_star_probability],
            [target_drop(state), five_star_probability],
        ]);
    } else {
        if (state.guaranteed) {
            return new CanonMap([
                [no_drop(state), 1 - five_star_probability],
                [untarget_drop(state), five_star_probability * 0.5],
                [target_drop(state), five_star_probability * 0.5],
            ]);
        } else {
            return new CanonMap([
                [no_drop(state), 1 - five_star_probability],
                [standard_drop(state), five_star_probability * 0.25],
                [untarget_drop(state), five_star_probability * 0.375],
                [target_drop(state), five_star_probability * 0.375],
            ]);
        }
    }
}

export function weapon_initial(pity: number, fate: number, guaranteed: boolean): WeaponState {
    return {pity, fate, limited: 0, guaranteed};
}

export function weapon_goal(limited_count: number): (state: WeaponState) => boolean {
    return (state: WeaponState) => { return state.limited >= limited_count };
}

function no_drop(state: WeaponState): WeaponState {
    return {...state, pity: state.pity + 1}
}

function target_drop(state: WeaponState): WeaponState {
    return {pity: 0, limited: state.limited + 1, guaranteed: false, fate: 0}
}

function standard_drop(state: WeaponState): WeaponState {
    return {...state, pity: 0, guaranteed: true, fate: state.fate + 1}
}

function untarget_drop(state: WeaponState): WeaponState {
    return {...state, pity: 0, guaranteed: false, fate: state.fate + 1}
}
