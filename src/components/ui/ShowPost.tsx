import { type FC } from "preact/compat";

import { Slider } from "./Slider";
import { PetInfo } from "./PetInfo";
import { ModalButton } from "../hoc/ModalButton";
import type { IPost } from "@/types/Post";
import { getTimeToNow } from "@/utils/StringFormatters";
import "./PostsStyles.css";

interface Props {
    post: IPost;
    authorInfo?: boolean;
}

export const ShowPost: FC<Props> = ({ post, authorInfo = true }) => {


    return (
        <article class="post-article">
            {
                authorInfo && (
                    <div class="author-info">
                        <div className="img-container">
                            <img src={post.author.image || "/default-image.png"} alt={post.author.name} />
                        </div>
                        <span>{post.author.name}</span>
                    </div>
                )
            }
            {
                (post.images.length === 0)
                    ? <></>
                    : (post.images.length === 1)
                        ? (
                            <div className="img-container post-img-container">
                                <img src={post.images[0] || "/default-image.png"} alt="Imagen del post" />
                            </div>
                        )
                        : <div class="post-slider-container"><Slider identifier={"id-" + post.id} autorun={false} children={post.images.map((img) => <div className="img-container post-img-container">
                            <img src={img || "/default-image.png"} alt="Imagen del post" />
                        </div>)} /></div>
            }
            <p>{post.description}</p>
            <div className="post-info">
                {post.pet && <ModalButton children={<PetInfo pet={post.pet} />} textButton={post.pet.name} textTitle={post.pet.name} round full />}
                <span style={{ justifySelf: "flex-end" }}>{getTimeToNow(post.createdAt)}</span>
            </div>
        </article>
    )
};
