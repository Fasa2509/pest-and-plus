import { useEffect, type FC } from "preact/compat";
import { useStore } from "@nanostores/preact";

import { NotificationInfo } from "./NotificationInfo.tsx";
import {
    $notifications,
    $removeNotification,
    marginY,
    type Notification,
    type NotificationStatus,
    type NotificationType,
} from "@/stores/Notifications";
import "./Notifications.css";

interface Props {
    hidingDuration?: number;
    lifeDuration?: number;
}

export const NotificationsProvider: FC<Props> = ({ hidingDuration, lifeDuration }) => {

    const notifications = useStore($notifications);

    useEffect(() => {
        let space = 0;
        let numberOfHiddens = 0;
        notifications.nots.forEach((not, i) => {
            const el = document.getElementById(not.id)! as HTMLDivElement;
            if (not.status === "render") {
                el.style.transform = `translateY(${space - (marginY * (i + 1) - marginY * numberOfHiddens)}px)`;
                space -= Number(getComputedStyle(el).height.slice(0, -2));
            } else if (not.status === "hidden" || not.status === "hiding") {
                numberOfHiddens += 1;
            }
        });
    }, [notifications.nots]);

    return (
        <section class="not-section">
            {
                notifications.nots.map((not) =>
                    <NotificationInfo not={not} />
                )
            }
        </section>
    )
}
