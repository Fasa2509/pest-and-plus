import type { IUpdatePet } from "@/types/Pet";
import type { IEditUser, IPetInfo, IPostInfo, IUser } from "@/types/User";
import { action, deepMap } from "nanostores";

export const $userInfo = deepMap<IUser | { id: undefined }>({ id: undefined });


export const $updateUserInfo = action($userInfo, 'updateUserInfo', (store, info: IUser) => {
    store.set(info);
    return store.get();
});

export const $setUpdatedUserInfo = action($userInfo, 'setUpdateUserInfo', (store, info: IEditUser) => {
    const userInfo = store.get();

    const body: Record<string, string> = {};

    if (info.bio) body.bio = info.bio;
    if (info.image) body.image = info.image;

    store.set({
        ...userInfo,
        ...body
    });

    return store.get();
});

export const $updateUserPosts = action($userInfo, 'updateUserPosts', (store, info: IPostInfo) => {
    const state = store.get();

    if (!state.id) return state;

    store.set({
        ...state,
        posts: [info, ...state.posts],
    });

    return store.get();
});

export const $removeUserPost = action($userInfo, 'removeUserPost', (store, postId: number) => {
    const state = store.get();

    if (!state.id) return state;

    store.set({
        ...state,
        posts: state.posts.filter((post) => post.id !== postId),
    });

    return store.get();
});

export const $updateUserPets = action($userInfo, 'updateUserPets', (store, info: IPetInfo) => {
    const state = store.get();

    if (!state.id) return state;

    store.set({
        ...state,
        pets: [info, ...state.pets],
    });

    return store.get();
});

export const $toggleFollowingPet = action($userInfo, "toggleFollowingPet", (store, pet: IPetInfo, isFollowed: boolean) => {
    const state = store.get();

    if (!state.id) return state;

    store.set({
        ...state,
        following: (isFollowed) ? state.following.filter((p) => p.id !== pet.id) : [...state.following, pet],
    });

    return store.get();
});

export const $responseLinkRequest = action($userInfo, "responseLinkRequest", (store, id: number, pet: IPetInfo, response: "accept" | "reject") => {
    const state = store.get();

    if (!state.id) return state;

    store.set({
        ...state,
        linkRequests: state.linkRequests.filter((req) => req.id !== id),
        pets: (response === "accept") ? [pet, ...state.pets] : state.pets,
    });

    return store.get();
});

export const $updateUserPetInfo = action($userInfo, "updateUserPetInfo", (store, petId: number, petInfo: IUpdatePet) => {
    const state = store.get();

    if (!state.id) return state;

    store.set({
        ...state,
        pets: state.pets.map((pet) => pet.id !== petId ? pet : { ...pet, ...petInfo }),
    });

    return store.get();
});
