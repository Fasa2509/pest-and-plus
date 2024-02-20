import { memo, type FC } from "preact/compat";

import { type Notification } from "@/stores/Notifications";
import { CloseNotificationButton, ConfirmNotificationButtons } from "@/utils/NotificationActions";

interface Props {
    not: Notification;
}

export const NotificationInfo: FC<Props> = memo(({ not }) => {

    return (
        <div
            id={not.id}
            class={`notification fade-in-not ${not.type} ${not.status !== "render" ? "hide" : ""}`}
        >
            <div class="not-info-container">
                <span>{not.content}</span>
                {
                    not.confirmation && (
                        <ConfirmNotificationButtons id={not.id} />
                    )
                }
                {
                    (!not.nonClose && !not.confirmation) && (
                        <CloseNotificationButton id={not.id} />
                    )
                }
            </div>
        </div>
    )
})
