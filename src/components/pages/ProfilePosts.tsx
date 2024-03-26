import { type FC, useState } from "preact/compat";
import { useStore } from "@nanostores/preact";

import { $userInfo } from "@/stores/UserInfo";
import { MyPost } from "@/components/ui/MyPost";
import { MyTexts } from "@components/ui/MyTexts";
import { ModalButton } from "@components/hoc/ModalButton";
import { UploadPostForm } from "@components/ui/UploadPostForm";
import { Skeleton } from "../layouts/Skeleton";
import "./Perfil.css";

interface Props {

}

export const ProfilePosts: FC<Props> = () => {

    const userInfo = useStore($userInfo);

    const [displayPosts, setDisplayPosts] = useState(false);

    // const textPosts = useMemo(() => !userInfo.id ? [] : userInfo.posts.filter((post) => post.images.length === 0), [userInfo.posts]);
    const textPosts = !userInfo.id ? [] : userInfo.posts.filter((post) => post.images.length === 0);
    // const imagePosts = useMemo(() => !userInfo.id ? [] : userInfo.posts.filter((post) => post.images.length > 0), [userInfo.posts]);
    const imagePosts = !userInfo.id ? [] : userInfo.posts.filter((post) => post.images.length > 0);

    return (
        <main class="sub-container fourth-element">
            {
                (!userInfo.id)
                    ? <Skeleton classes="content-container" />
                    : (
                        <div class="content-container">
                            <div>
                                <div className="title-container title-container-texts">
                                    <h3>Mi Muro</h3>
                                    <ModalButton textButton="+" extendClass="bg-secondary" textTitle="Subir publicación" children={<UploadPostForm />} full />
                                </div>
                                <div className="texts-container">
                                    {
                                        (textPosts.length === 0)
                                            ? <p style={{ alignSelf: "flex-start", paddingLeft: "1rem" }}>¡Vaya! Aún no has subido ninguna publicación. Intenta subir una.</p>
                                            : (textPosts.length <= 5)
                                                ? textPosts.map((p) => <MyTexts post={p} userInfo={userInfo} mine />)
                                                : (displayPosts)
                                                    ? textPosts.map((p) => <MyTexts post={p} userInfo={userInfo} mine />)
                                                    : textPosts.slice(0, 5).map((p) => <MyTexts post={p} userInfo={userInfo} mine />)
                                    }
                                    {
                                        (textPosts.length > 5) && <button className="button bg-secondary fadeIn" id="show" onClick={() => setDisplayPosts(!displayPosts)}>Mostrar {displayPosts ? 'menos' : 'más'}</button>
                                    }
                                </div>
                            </div>
                            {/* <div style={{ flexGrow: "1" }}></div> */}
                            <div>
                                <div className="title-container">
                                    <h3>Mis publicaciones</h3>
                                </div>
                                <div className="posts-container">
                                    {
                                        imagePosts.map((post) => <MyPost key={post.id} post={post} userInfo={userInfo} mine />)
                                    }
                                </div>
                            </div>
                        </div>
                    )
            }
        </main>
    )
};
