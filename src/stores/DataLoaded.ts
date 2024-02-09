import { action, map } from "nanostores";

import { type IPet, type IUserInfo } from "@/types/Pet";
import type { IPetInfo } from "@/types/User";

export type TPetCount = {
    dogCount?: number;
    catCount?: number;
    horseCount?: number;
    rabbitCount?: number;
    monkeyCount?: number;
    turtleCount?: number;
    goatCount?: number;
    birdCount?: number;
    fishCount?: number;
    pigCount?: number;
    hedgehogCount?: number;
    otherCount?: number;
}

export type TDataLoaded = {
    myPets: IPet[];
    otherPets: IPet[];
    cachedPets: IPetInfo[];
    cachedUsers: IUserInfo[];
    count: TPetCount;
};

export const $dataLoaded = map<TDataLoaded>({
    myPets: [],
    otherPets: [],
    cachedPets: [],
    cachedUsers: [],
    count: {}
});


export const $updatePets = action($dataLoaded, 'updatePets', (store, pet: IPet, mine: boolean) => {
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

export const $updateCachedInfo = action($dataLoaded, 'updateCachedPets', (store, data: { petsInfo: IPetInfo[], usersInfo: IUserInfo[] }) => {
    const value = store.get();

    store.set({
        ...value,
        cachedPets: [...data.petsInfo, ...value.cachedPets],
        cachedUsers: [...data.usersInfo, ...value.cachedPets],
    });

    return store.get();
});

export const $updateCachedPets = action($dataLoaded, 'updateCachedPets', (store, pets: IPetInfo[]) => {
    const value = store.get();

    store.set({
        ...value,
        cachedPets: [...pets, ...value.cachedPets],
    });

    return store.get();
});

export const $updateCachedUsers = action($dataLoaded, 'updateCachedUsers', (store, users: IUserInfo[]) => {
    const value = store.get();

    store.set({
        ...value,
        cachedUsers: [...users, ...value.cachedUsers],
    });

    return store.get();
});

export const $updateCounts = action($dataLoaded, "updateCount", (store, count: TPetCount) => {
    const value = store.get();

    store.set({
        ...value,
        count,
    })
});
