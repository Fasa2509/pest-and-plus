import { type FC } from "preact/compat";
import { useStore } from "@nanostores/preact";

import { $userInfo } from "@/stores/UserInfo";
import "./Perfil.css";

interface Props {

}

export const PerfilRecent: FC<Props> = () => {

    const userInfo = useStore($userInfo);

    return (
        <aside class="sub-container thirst-element">
            <div class="content-container">
                <h3>Publicaciones más recientes</h3>
                <p>
                    Fugiat ipsum laborum incididunt consequat Lorem. Do
                    cupidatat consectetur tempor velit aute fugiat id culpa
                    dolor ex adipisicing nulla aliquip. Cillum nisi consectetur
                    minim aute officia ad sit dolor velit irure ipsum. Dolore
                    cillum ut sunt eu.
                </p>
            </div>
        </aside>
    )
};
