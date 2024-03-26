import type { FC } from "preact/compat";
import { useEffect } from "preact/hooks";
import { useStore } from "@nanostores/preact";

import { useNotifications } from "@/hooks/useNotifications";
import { PostContainer } from "./PostsContainer";
import { $updateTasks } from "@/stores/Loading";
import { $dataLoaded, $updateCachedInfo } from "@/stores/DataLoaded";
import { getInfo } from "@/database/DbInfo";
import { AsideInfo } from "../ui/AsideInfo";
import { RecentPosts } from "../pages/RecentPosts";
import "./Feed.css";

interface Props {

}

export const FeedMain: FC<Props> = () => {

    const { cachedPets, cachedUsers } = useStore($dataLoaded);

    const { createNotification } = useNotifications();

    useEffect(() => {
        (async () => {
            if (cachedPets.length >= 1 && cachedUsers.length >= 1) return;

            $updateTasks("Buscando mascotas...")
            const res = await getInfo();
            $updateTasks("Buscando mascotas...")

            !res.error && $updateCachedInfo(res.payload);
            res.error && createNotification({ type: "error", content: res.message[0] });
        })();
    }, []);

    return (
        <section class="main-container">
            <div class="asides-container">
                <AsideInfo />
                {/* <AsideData /> */}
                <RecentPosts />
            </div>
            <PostContainer />
            <div></div>
        </section>
    )
};


/*
import type { FC } from "preact/compat";
import { useEffect } from "preact/hooks";
import { useStore } from "@nanostores/preact";

import { $updateUserInfo, $userInfo } from "@/stores/UserInfo";
import { useNotifications } from "@/hooks/useNotifications";
import { PromiseConfirmHelper } from "@/stores/Notifications";
import { frontGetUserInfo } from "@/database/DbUser";
import { PostContainer } from "./PostsContainer";
import "./Feed.css";
import { SliderOptions } from "./SliderOptions";

interface Props {
    checkForSession: Boolean;
}

export const FeedMain: FC<Props> = ({ checkForSession }) => {

    const userInfo = useStore($userInfo);

    const { createNotification } = useNotifications();

    useEffect(() => {
        (async () => {
            if (!checkForSession || userInfo.id) return;

            const id = new URLSearchParams(document.cookie).get("user-id");

            if (!id || isNaN(Number(id)) || Number(id) < 1) return;

            const res = await frontGetUserInfo(Number(id));

            !res.error && $updateUserInfo(res.payload.user);
            res.error && createNotification({ type: "error", content: res.message[0] });
        })();
    }, []);

    const handleClick = async () => {
        // const id = createNotification({
        //     type: "success",
        //     content: "Confirma que quiere cerrar la cuenta?",
        //     confirmation: true,
        //     duration: 1000,
        // });

        // const accepted = await PromiseConfirmHelper(id, 1000);

        // console.log({ accepted })
    };

    return (
        <section class="main-container">
            <aside>
                <h3>Últimos usuarios</h3>
                <SliderOptions iterable={[]} />
                <h3>Últimas mascotas</h3>
            </aside>
            <PostContainer />
            <aside>
                <h3>En PetsAnd+ hay...</h3>
                <p>🐶 123</p>
                <p>🐱 123</p>
                <p>🐵 123</p>
                <p>🐴 123</p>
            </aside>
        </section>
    )
};
*/