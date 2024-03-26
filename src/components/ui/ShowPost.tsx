import { type FC } from "preact/compat";

import { Slider } from "./Slider";
import { PetInfo } from "./PetInfo";
import { ModalButton } from "../hoc/ModalButton";
import type { IPost } from "@/types/Post";
import { getTimeToNow } from "@/utils/StringFormatters";
import { MyImage } from "../layouts/MyImage";
import "./PostsStyles.css";

interface Props {
    post: IPost;
    authorActions?: boolean;
}

export const ShowPost: FC<Props> = ({ post, authorActions = true }) => {


    return (
        <article class="post-article">
            {
                authorActions && (
                    <a class="author-info" href={`/profile/${post.author.id}`}>
                        <MyImage src={post.author.image || "/default-image.png"} alt={post.author.name} classes="img-author-container" />
                        <span>{post.author.name}</span>
                    </a>
                )
            }
            {
                (post.images.length === 0)
                    ? <></>
                    : (post.images.length === 1)
                        ? (
                            <MyImage src={post.images[0] || "/default-image.png"} alt="Imagen del post" center classes="post-img-container" />
                        )
                        : <div class="post-slider-container"><Slider identifier={"id-" + post.id} autorun={false} duration={10000000}
                            children={post.images.map((img) =>
                                <div class="slider-element">
                                    <MyImage src={img || "/default-image.png"} alt="Imagen" />
                                </div>
                            )} /></div>
            }
            <p>{post.description}</p>
            <div className="post-info">
                {post.pet && <ModalButton children={<PetInfo pet={post.pet} />} textButton={post.pet.name} textTitle={post.pet.name} extendClass="modal-button-less" round full />}
                <span style={{ justifySelf: "flex-end" }}>{getTimeToNow(post.createdAt)}</span>
            </div>
        </article>
    )
};
