import type { FC } from "preact/compat";
import { useEffect } from "preact/hooks";
import { useStore } from "@nanostores/preact";

import { $updateUserInfo, $userInfo } from "@/stores/UserInfo";
import { useNotifications } from "@/hooks/useNotifications";
import { PromiseConfirmHelper } from "@/stores/Notifications";
import { frontGetUserInfo } from "@/database/DbUser";
import { PostContainer } from "./PostsContainer";
import { SliderOptions } from "./SliderOptions";
import { ModalCardButton } from "./ModalCardButton";
import { $updateTasks } from "@/stores/Loading";
import { $updateCachedPets, $updatePets } from "@/stores/PetsLoaded";
import { getInfo } from "@/database/DbInfo";
import "./Feed.css";

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

    useEffect(() => {
        (async () => {
            $updateTasks("Buscando mascotas...")
            const res = await getInfo();
            $updateTasks("Buscando mascotas...")

            console.log(res)

            !res.error && $updateCachedPets(res.payload.petsInfo);
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
            <div class="asides-container">
                <aside>
                    <h3>Últimos usuarios</h3>
                    <SliderOptions children={Array(10).fill(0).map(() => <div class="slider-option"><ModalCardButton textTitle="Hola" children={<></>} textButton="Prueba" imgSrc={null} /></div>)} />
                    <h3>Últimas mascotas</h3>
                    <SliderOptions children={Array(10).fill(0).map(() => <div class="slider-option"><ModalCardButton textTitle="Hola" children={<></>} textButton="Prueba" imgSrc={null} /></div>)} />
                </aside>
                <aside>
                    <h3>En PetsAnd+ hay...</h3>
                    <p>🐶 123</p>
                    <p>🐱 123</p>
                    <p>🐵 123</p>
                    <p>🐴 123</p>
                </aside>
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