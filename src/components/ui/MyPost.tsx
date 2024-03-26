import { type FC } from "preact/compat";
import { ModalImg } from "../hoc/ModalImg";

import { $updateTasks } from "@/stores/Loading";
import { $removeUserPost } from "@/stores/UserInfo";
import { useNotifications } from "@/hooks/useNotifications";
import { PromiseConfirmHelper } from "@/stores/Notifications";
import type { IPostInfo, IUser } from "@/types/User";
import { deletePostById } from "@/database/DbPost";
import { getTimeToNow } from "@/utils/StringFormatters";
import { Slider } from "./Slider";
import { MyImage } from "../layouts/MyImage";
import "./MyPerfilInfo.css";

interface Props {
    post: IPostInfo;
    userInfo: IUser;
    mine?: boolean;
}

export const MyPost: FC<Props> = ({ post, userInfo, mine }) => {

    const { createNotification } = useNotifications();

    const pet = userInfo.pets.find((p) => p.id === post.petId)!;

    const handleDeletePost = async (e: MouseEvent) => {
        const notId = createNotification({
            type: "info",
            content: "¿Estás segur@ que quieres eliminar esta publicación?",
            confirmation: true,
        });

        const accepted = await PromiseConfirmHelper(notId);

        if (!accepted) return;

        $updateTasks("Eliminando");
        const res = await deletePostById(post.id);
        $updateTasks("Eliminando");

        createNotification({ type: !res.error ? "info" : "error", content: res.message[0] });

        (!res.error) && $removeUserPost(post.id);
    };

    return (
        <div class="post-container">
            <ModalImg imgSrc={post.images[0]} textTitle={mine ? "Mis publicaciones" : `Publicación de ${userInfo.name}`}>
                <div class="post-data-container">
                    {
                        (post.images.length === 1)
                            ? (
                                <div className="post-img-container">
                                    <MyImage src={post.images[0] || "/default-image.png"} alt="Imagen del post" center />
                                </div>
                            )
                            : (
                                <div class="post-slider-container">
                                    <Slider identifier={"id-" + post.id} autorun={false} duration={10000} children={post.images.map((img) =>
                                        <div class="slider-element">
                                            <MyImage src={img || "/default-image.png"} alt="Imagen del post" />
                                        </div>
                                    )} />
                                </div>
                            )
                    }
                    <p>{post.description}</p>
                    <div style={{ flexGrow: '1' }}></div>
                    <div id="post-info" class="post-info">
                        {pet && <span class="chip">{pet.name}</span>}
                        <div>
                            {
                                (mine) && <button className="button bg-secondary delete-btn" onClick={handleDeletePost}>Eliminar</button>
                            }
                            <span class={!pet ? "span-justify" : ""}>{getTimeToNow(post.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </ModalImg>
        </div>
    )
};


