import { type FC, useMemo, useState } from "preact/compat";
import { useStore } from "@nanostores/preact";

import { MyPost } from "@/components/ui/MyPost";
import { MyTexts } from "@components/ui/MyTexts";
// import { ModalButton } from "@components/hoc/ModalButton";
import type { IUser } from "@/types/User";
import "./Perfil.css";

interface Props {
    user: IUser;
}

export const OtherProfilePosts: FC<Props> = ({ user }) => {

    // const userInfo = useStore($userInfo);

    const [displayPosts, setDisplayPosts] = useState(false);

    // if (!userInfo.id) return <></>;

    const textPosts = useMemo(() => user.posts.filter((post) => post.images.length === 0), [user.posts]);

    return (
        <main class="sub-container fourth-element">
            <div class="content-container">
                <div>
                    <div className="title-container">
                        <h3>Muro de {user.name}</h3>
                    </div>
                    <div className="texts-container">
                        {
                            (textPosts.length === 0)
                                ? <p style={{ alignSelf: "flex-start", paddingLeft: "1rem" }}>¡Vaya! Este usuario aún no ha subido ninguna publicación.</p>
                                : (textPosts.length <= 5)
                                    ? textPosts.map((p) => <MyTexts post={p} userInfo={user} />)
                                    : (displayPosts)
                                        ? textPosts.map((p) => <MyTexts post={p} userInfo={user} />)
                                        : textPosts.slice(0, 5).map((p) => <MyTexts post={p} userInfo={user} />)
                        }
                        {
                            (textPosts.length > 5) && <button className="button bg-secondary fadeIn" id="show" onClick={() => setDisplayPosts(!displayPosts)}>Mostrar {displayPosts ? 'menos' : 'más'}</button>
                        }
                    </div>
                </div>
                {/* <div style={{ flexGrow: "1" }}></div> */}
                <div>
                    <div className="title-container">
                        <h3>Publicaciones de {user.name}</h3>
                    </div>
                    {
                        (user.posts.length === 0)
                            ? (
                                <p style={{ padding: "0 1rem", marginBottom: "1rem" }}>Parece que este usuario aún no ha publicado nada.</p>
                            ) : (
                                <div className="posts-container">
                                    {
                                        user.posts.filter((post) => post.images.length > 0).map((post) => <MyPost key={post.id} post={post} userInfo={user} />)
                                    }
                                </div>
                            )
                    }
                </div>
            </div>
        </main>
    )
};
