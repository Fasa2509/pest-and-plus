import { action, atom } from "nanostores";

export const $menu = atom<boolean>(false);

export type Themes = "light" | "dark" | "";

export const $theme = atom<Themes>("");

export const $toggleMenu = action($menu, 'addTask', (store, toggle: boolean) => {
    store.set(toggle);
    return store.get();
});

export const $toggleTheme = action($theme, 'toggleTheme', (store, theme: Themes) => {
    store.set(theme);
    return store.get();
});
