import { memo, useMemo, useRef, type FC, useState, useEffect } from "preact/compat";

import { $hideNotification, $removeNotification, hidingDuration, marginY, type Notification } from "@/stores/Notifications";
import { CloseNotificatinButton, ConfirmNotificationButtons } from "@/utils/NotificationActions";

interface Props {
    not: Notification;
    index: number;
}

export const NotificationInfo: FC<Props> = memo(({ not, index }) => {

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
                        <CloseNotificatinButton id={not.id} />
                    )
                }
            </div>
        </div>
    )
})
