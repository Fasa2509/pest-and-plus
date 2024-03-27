import { useEffect, type FC } from "preact/compat";
import { useStore } from "@nanostores/preact";

import { $postsLoaded, $updatePosts } from "@/stores/PostsLoaded";
import { $tasks, $updateTasks } from "@/stores/Loading";
import { useNotifications } from "@/hooks/useNotifications";
import { PAGINATION_POST, frontGetMorePosts } from "@/database/DbPost";
import { ShowPost } from "../ui/ShowPost";
import { Skeleton } from "../layouts/Skeleton";
import "../ui/PostsStyles.css";

interface Props {

}

export const PostContainer: FC<Props> = ({ }) => {

    const tasks = useStore($tasks);
    const posts = useStore($postsLoaded);

    const { createNotification } = useNotifications();

    useEffect(() => {
        (async () => {
            if (posts.length >= PAGINATION_POST) return;
            $updateTasks("Buscando publicaciones");
            const res = await frontGetMorePosts({ limit: PAGINATION_POST, offset: 0, max: new Date().getTime() });
            $updateTasks("Buscando publicaciones");

            (res.error) && createNotification({ type: !res.error ? "info" : "error", content: res.message[0] });

            if (!res.error) {
                if (res.payload.posts.length === 0) return createNotification({ type: "info", content: "No se encontraron publicaciones" });
                $updatePosts(res.payload.posts);
            };
        })();
    }, []);

    const handleSearchPosts = async () => {
        const max = Math.min(...posts.map((p) => new Date(p.createdAt).getTime()));
        $updateTasks("Buscando publicaciones");
        const res = await frontGetMorePosts({ limit: PAGINATION_POST, offset: 0, max });
        $updateTasks("Buscando publicaciones");

        (res.error) && createNotification({ type: "error", content: res.message[0] });
        if (!res.error) {
            if (res.payload.posts.length === 0) return createNotification({ type: "info", content: "No se encontraron más publicaciones" });
            $updatePosts(res.payload.posts);
        };
    };

    return (
        <main>
            {
                (posts.length === 0)
                    ? Array(3).fill(0).map(() => <Skeleton classes="post-article" heightClamp="450px" />)
                    : posts.map((post) => <ShowPost post={post} />)
            }
            <button className="button more-posts-btn" onClick={handleSearchPosts} disabled={tasks.includes("Buscando publicaciones")}>Ver más publicaciones</button>
        </main>
    )
};
