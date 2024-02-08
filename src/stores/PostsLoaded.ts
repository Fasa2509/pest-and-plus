import { action, atom } from "nanostores";

import { type IPost } from "@/types/Post";

export const $postsLoaded = atom<IPost[]>([]);


export const $updatePosts = action($postsLoaded, 'addTask', (store, posts: IPost[]) => {
    const value = store.get();

    store.set([...value, ...posts]);

    return store.get();
});
