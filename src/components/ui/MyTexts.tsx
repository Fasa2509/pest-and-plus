import type { IPostInfo, IUser } from "@/types/User";
import { type FC } from "preact/compat";

import { getTimeToNow } from "@/utils/StringFormatters";
import { $removeUserPost } from "@/stores/UserInfo";
import { $updateTasks } from "@/stores/Loading";
import { deletePostById } from "@/database/DbPost";
import "./MyPerfilInfo.css";
import { useNotifications } from "@/hooks/useNotifications";
import { PromiseConfirmHelper } from "@/stores/Notifications";

interface Props {
    post: IPostInfo;
    userInfo: IUser;
    mine?: boolean;
}

export const MyTexts: FC<Props> = ({ post, userInfo, mine }) => {

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
        <article id={`post-${post.id}`} className="text-container fadeIn">
            <p>
                {post.description}
            </p>
            <div className="post-info">
                {pet && <span class="chip">{pet.name}</span>}
                <div>
                    {mine && <button className="button bg-secondary delete-btn" onClick={handleDeletePost}>Eliminar</button>}
                    <span>{getTimeToNow(post.createdAt)}</span>
                </div>
            </div>
        </article>
    );
};
