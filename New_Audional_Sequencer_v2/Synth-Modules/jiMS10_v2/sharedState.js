// sharedState.js

let activeEffect = null;

export function setActiveEffect(effect) {
    activeEffect = effect;
}

export function getActiveEffect() {
    return activeEffect;
}
