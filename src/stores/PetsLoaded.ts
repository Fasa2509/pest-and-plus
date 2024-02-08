import { action, map } from "nanostores";

import { type IPet } from "@/types/Pet";
import type { IPetInfo } from "@/types/User";

export type TPetsLoaded = {
    myPets: IPet[];
    otherPets: IPet[];
    cachedPets: IPetInfo[];
};

export const $petsLoaded = map<TPetsLoaded>({
    myPets: [],
    otherPets: [],
    cachedPets: [],
});


export const $updatePets = action($petsLoaded, 'updatePets', (store, pet: IPet, mine: boolean) => {
    const value = store.get();

    if (mine) {
        store.set({
            ...value,
            myPets: [pet, ...value.myPets],
        });
    } else {
        store.set({
            ...value,
            otherPets: [pet, ...value.otherPets],
        });
    };

    return store.get();
});

export const $updateCachedPets = action($petsLoaded, 'updatePets', (store, pets: IPetInfo[]) => {
    const value = store.get();

    store.set({
        ...value,
        cachedPets: [...pets, ...value.cachedPets],
    });

    return store.get();
});
