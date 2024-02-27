import { type FC, useEffect, useState, useMemo } from "preact/compat";
import { useStore } from "@nanostores/preact";

import { $userInfo } from "@/stores/UserInfo";
import { $dataLoaded, $updateFollowedPosts } from "@/stores/DataLoaded";
import { $updateTasks } from "@/stores/Loading";
import { getFollowedPetPosts } from "@/database/DbPost";
import { useNotifications } from "@/hooks/useNotifications";
import { ModalBar } from "../hoc/ModalBar";
import { ShowPost } from "../ui/ShowPost";
import type { IPost } from "@/types/Post";

interface Props {

}

export const RecentPosts: FC<Props> = () => {

    const userInfo = useStore($userInfo);
    const { cachedPosts } = useStore($dataLoaded);

    let postsToMap = useMemo(() => {
        let petsIds = new Set(cachedPosts.map((post) => post.pet!.id));
        return Array.from(petsIds).map((id) => cachedPosts.filter((post) => post.pet!.id === id));
    }, [cachedPosts]);

    const [selectedPosts, setSelectedPosts] = useState<IPost[]>([]);

    const { createNotification } = useNotifications();

    useEffect(() => {
        (async () => {
            // const lastCachedPost = cachedPosts.at(1);
            if (cachedPosts.length > 0) return;
            $updateTasks("Buscando publicaciones de seguidos...");
            const res = await getFollowedPetPosts({ limit: 9, offset: 0, max: new Date().getTime() });
            $updateTasks("Buscando publicaciones de seguidos...");

            res.error && createNotification({ type: "error", content: res.message[0] });
            !res.error && $updateFollowedPosts(res.payload.posts);
        })();
    }, []);

    const selectChild = (idx: number) => {
        setSelectedPosts(postsToMap[idx]);
    };

    return (
        <aside class="recent-posts pad">
            <h3 class="h3">Publicaciones de mis seguidos</h3>
            {
                (!userInfo.id) &&
                <p><a href="/">Inicia sesión</a> para ver las últimas publicaciones de las mascotas que sigues.</p>
            }
            {
                (userInfo.id && userInfo.following.length === 0) &&
                <p>¡No sigues a ninguna mascota! Empieza a explorar opciones y sigue a las mascotas que te llamen la atención.</p>
            }
            {
                !(userInfo.id && userInfo.following.length > 0)
                    ? <></>
                    : (postsToMap.length === 0)
                        ? <span>Loading...</span>
                        : postsToMap.map((posts, i) => <ModalBar children={
                            <section class="followed-posts-container">
                                {
                                    posts.map((p) => <ShowPost post={p} />)
                                }
                            </section>
                        } textButton={posts.at(0)!.pet!.name} selectChild={selectChild} imgSrc={posts.find((p) => p.images.length > 0) ? posts.find((p) => p.images.length > 0)!.images.at(0) as string : null} count={posts.length} index={i} />)
            }
        </aside>
    );
};

/*
: cachedPosts.map((post, i) => <ModalBar children={
    <section class="followed-posts-container">
        <ShowPost post={selectedPosts} />
    </section>
} selectChild={selectChild} imgSrc={post.images[0]} count={3} textButton={post.pet!.name} index={i} />)


} selectChild={selectChild} imgSrc={posts.find((p) => p.images.length > 0) ? posts.find((p) => p.images.length > 0)!.images.at(0) as string : null} count={cachedPosts.reduce((acc, curr) => acc + Number(curr.pet?.id === post.pet?.id), 0)} textButton={post.pet!.name} index={i} />)
*/