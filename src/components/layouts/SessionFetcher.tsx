import { type FC, useEffect } from "preact/compat";
import { useStore } from "@nanostores/preact";

import { frontGetUserInfo } from "@/database/DbUser";
import { useNotifications } from "@/hooks/useNotifications";
import { $updateUserInfo, $userInfo } from "@/stores/UserInfo";

interface Props {

}

export const SessionFetcher: FC<Props> = () => {

    const userInfo = useStore($userInfo);

    const { createNotification } = useNotifications();

    useEffect(() => {
        (async () => {
            if (userInfo.id) return;

            const id = new URLSearchParams(document.cookie.split("; ").join("&")).get("user-id");
            if (!id || isNaN(Number(id)) || Number(id) < 1) {
                // TODO
                // console.error("Otra vez el temita con el id de inicio de sesion");
                $updateUserInfo(null);
                return;
            };

            const res = await frontGetUserInfo(Number(id));

            console.log({ res })

            $updateUserInfo((!res.error) ? res.payload.user : null);
            res.error && createNotification({ type: "error", content: res.message[0] });
        })();
    }, []);

    return (
        <></>
    );
};
