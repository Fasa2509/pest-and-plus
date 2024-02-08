import { $addNotification, $hideNotification, $removeNotification, hidingDuration, lifeDuration, type Notification } from "@/stores/Notifications";

interface Props {

}


export const useNotifications = () => {

    const createNotification = (notInfo: Omit<Notification, "id" | "status">): string => {
        const id = crypto.randomUUID();

        $addNotification({
            ...notInfo,
            id,
            status: "render",
        });

        setTimeout(() => removeNotification(id), notInfo.duration || lifeDuration);

        return id;
    };

    const removeNotification = (id: string) => {
        $hideNotification(id);
        setTimeout(() => $removeNotification(id), hidingDuration);
    };

    return { createNotification, removeNotification };
};
