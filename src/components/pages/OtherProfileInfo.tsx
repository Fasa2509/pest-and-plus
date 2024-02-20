import { useEffect, type FC } from "preact/compat";

import { useNotifications } from "@/hooks/useNotifications";
import type { IUser } from "@/types/User";
import "./Perfil.css";

interface Props {
    user: IUser;
}

export const OtherProfileInfo: FC<Props> = ({ user }) => {

    const { createNotification } = useNotifications();

    useEffect(() => {

    }, []);

    return (
        <article class="sub-container first-element">
            <div class="content-container">
                <section class="perfil-info">
                    <div className="perfil-img">
                        <div className="img-container">
                            <img src={(user.image) ? user.image : "/default-image.png"} alt="Perfil" />
                        </div>
                    </div>
                    <div className="perfil-data">
                        <div className="name">
                            {user.name}
                        </div>
                        <div className="all-data">
                            <div className="data pets">
                                <span className="number">{user.pets.length}</span>
                                <span className="text">Mascotas</span>
                            </div>
                            <div className="data following">
                                <span className="number">{user.following.length}</span>
                                <span className="text">Siguiendo</span>
                            </div>
                            <div className="data posts">
                                <span className="number">{user.posts.length}</span>
                                <span className="text">Posts</span>
                            </div>
                        </div>
                    </div>
                    <div className="bio">
                        {
                            (!user.bio)
                                ? "El usuario no proveyó ninguna descripción."
                                : <p>{user.bio}</p>
                        }
                    </div>
                </section>
            </div>
        </article>
    )
};
