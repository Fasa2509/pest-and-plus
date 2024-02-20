import type { JSX } from "preact/compat";
import { action, map } from "nanostores";

export type NotificationStatus = "render" | "hiding" | "hidden";

export type NotificationType = "success" | "error" | "warning" | "info";

export const hidingDuration = 500;
export const lifeDuration = 10000;
export const marginY = 16;

export type Notification =
    {
        id: string,
        status: NotificationStatus,
        type: NotificationType,
        content: string | JSX.Element;
        confirmation?: boolean;
        duration?: number;
        nonClose?: boolean;
    }

type NotificationContext = {
    nots: Notification[];
};

export const $notifications = map<NotificationContext>({
    nots: [
        // {
        //     id: "success",
        //     type: "success",
        //     status: "render",
        //     content: "exito probando la notificacion",
        // },
        // {
        //     id: "error",
        //     type: "error",
        //     status: "render",
        //     content: "error probando la notificacion",
        // },
        // {
        //     id: "warning",
        //     type: "warning",
        //     status: "render",
        //     content: "peligro probando la notificacion",
        // },
        // {
        //     id: "info",
        //     type: "info",
        //     status: "render",
        //     content: "info probando la notificacion",
        // },
    ],
});


export const $addNotification = action($notifications, 'addNotification', (store, notInfo: Notification) => {
    const prevState = store.get();

    store.set({
        nots: [...prevState.nots, notInfo],
    });

    return store.get();
});

export const $hideNotification = action($notifications, "hideNotification", (store, id: string) => {
    const prevState = store.get();

    store.set({
        nots: prevState.nots.map((not) => not.id !== id ? not : ({ ...not, status: "hiding" })),
    });

    return store.get();
});

export const $removeNotification = action($notifications, "removeNotification", (store, id: string) => {
    const prevState = store.get();

    if (prevState.nots.filter((not) => not.status !== "hidden").length === 1 && !prevState.nots.some((not) => not.status === "render")) {
        store.set({
            nots: [],
        });
    } else {
        store.set({
            nots: prevState.nots.map((not) => not.id !== id ? not : ({ ...not, status: "hidden" })),
        });
    };

    return store.get();
});


export const PromiseConfirmHelper = (notId: string, duration: number = lifeDuration): Promise<boolean> => {

    let ref: any;

    return new Promise((resolve, reject) => {
        let timer = setTimeout(() => reject(callback), duration);

        const callback = (e: MouseEvent) => {
            // @ts-ignore
            if (e.target!.matches(`#confirm-${notId} *`)) {
                resolve({
                    timer,
                });
            };

            // @ts-ignore
            if (e.target.matches(`#negate-${notId} *`)) {
                reject({
                    timer,
                });
            };
        };

        ref = callback;

        // @ts-ignore
        document.addEventListener('click', callback);
    })
        .then(({ timer }: any) => {
            // @ts-ignore
            document.removeEventListener('click', ref);
            clearTimeout(timer);
            return true;
        })
        .catch(({ timer }: any) => {
            // @ts-ignore
            document.removeEventListener('click', ref);
            clearTimeout(timer);
            return false;
        });
};
