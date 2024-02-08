import { useEffect, useRef, type FC, useState } from "preact/compat";
import { useStore } from "@nanostores/preact";

import { $updateUserPosts, $userInfo } from "@/stores/UserInfo";
import { useNotifications } from "@/hooks/useNotifications";
import { getPetAttitude } from "@/types/User";
import { $tasks, $updateTasks } from "@/stores/Loading";
import { uploadNewPost } from "@/database/DbPost";
import { SelectOptions } from "./SelectOptions";
import "./UploadPostForm.css";

interface Props {

}

export const UploadPostForm: FC<Props> = () => {

    const userInfo = useStore($userInfo);
    const tasks = useStore($tasks);

    const [linkedPet, setLinkedPet] = useState("");

    const { createNotification } = useNotifications();

    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    if (!userInfo.id) return <></>;

    useEffect(() => {
        if (userInfo.pets.length > 0 && descriptionRef.current!.value.startsWith("Hoy mi ")) {
            const lastPet = (linkedPet === "") ? userInfo.pets.at(-1) : userInfo.pets.find((pet) => pet.name === linkedPet);
            descriptionRef.current!.value = getPetAttitude(lastPet);
        }
    }, [linkedPet]);

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();

        $updateTasks("Creando mascota");
        const res = await uploadNewPost({ authorId: userInfo.id, description: descriptionRef.current!.value.trim(), images: [], petId: userInfo.pets.find((p) => p.name === linkedPet)?.id, published: true });
        $updateTasks("Creando mascota");

        createNotification({ type: !res.error ? "success" : "error", content: res.message[0] });
        !res.error && $updateUserPosts(res.payload.post);
    };

    const isMobile = (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i))

    return (
        <div className="upload-form-container">
            <form onSubmit={handleSubmit}>
                <p>Toda <span style={{ fontWeight: '600' }}>publicación sin imágenes</span> irá a tu muro.</p>

                <div>
                    <label for="post-description">Contenido</label>
                    <textarea ref={descriptionRef} data-space name="description" id="post-description" rows={6} placeholder="Escribe aquí" value={
                        (userInfo.pets.length > 0) ? getPetAttitude(userInfo.pets.at(-1)!) : ""
                    }></textarea>
                </div>

                <div data-space>
                    <label for="post-pet" style={{ marginRight: "1rem" }}>¿Enlazar a alguna mascota?</label>
                    <SelectOptions id="link-pet" options={[{ value: "", text: "-----" }, ...userInfo.pets.map((pet) => ({ value: pet.name }))]} selected={linkedPet} setSelected={setLinkedPet} />
                </div>

                {/* <div>
                    <label for="public" style={{ marginRight: "1rem" }}>¿Público?</label>
                    <input data-space ref={publishedRef} type="checkbox" id="public" />
                </div> */}

                {isMobile && <div data-stretch></div>}

                <input ref={fileRef} type="file" style={{ display: "none" }} />
                <button data-space type="button" id="button-post-imgs" className="button" disabled={tasks.includes("Creando mascota")} onClick={() => fileRef.current!.click()}>Subir imágenes</button>

                <button type="submit" class="button bg-secondary upload-submit-button" disabled={tasks.includes("Creando mascota")}>Subir publicación</button>
            </form>
        </div>
    )
};
