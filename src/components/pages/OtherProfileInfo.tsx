import { type FC } from "preact/compat";

import type { IUser } from "@/types/User";
import { MyImage } from "../layouts/MyImage";
import "./Perfil.css";

interface Props {
    user: IUser;
}

export const OtherProfileInfo: FC<Props> = ({ user }) => {

    return (
        <article class="sub-container first-element">
            <div class="content-container">
                <section class="perfil-info">
                    <div className="perfil-img">
                        <MyImage src={(user.image) ? user.image : "/default-image.png"} alt={`Perfil de ${user.name}`} />
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
