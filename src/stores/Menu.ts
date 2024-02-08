import { action, atom } from "nanostores";

export const $menu = atom<boolean>(false);


export const $toggleMenu = action($menu, 'addTask', (store, toggle: boolean) => {
    store.set(toggle);
    return store.get();
});
