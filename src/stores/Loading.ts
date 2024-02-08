import { action, atom } from "nanostores";

export const $tasks = atom<string[]>([]);


export const $updateTasks = action($tasks, 'addTask', (store, task: string) => {
    const value = store.get();
    if (value.includes(task)) {
        store.set(value.filter(val => val !== task));
    } else {
        store.set([...value, task]);
    }
    return store.get();
});
