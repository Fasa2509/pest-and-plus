import { useEffect, useRef, type FC, useState, type TargetedEvent } from "preact/compat";
import { useStore } from "@nanostores/preact";

import { $updateUserPosts, $userInfo } from "@/stores/UserInfo";
import { useNotifications } from "@/hooks/useNotifications";
import { getPetAttitude } from "@/types/User";
import { $tasks, $updateTasks } from "@/stores/Loading";
import { uploadNewPost } from "@/database/DbPost";
import { SelectOptions } from "./SelectOptions";
import { ValidExtensions } from "@/types/Api";
import { uploadImageToS3 } from "@/database/DbImages";
import "./UploadPostForm.css";
import { Slider } from "./Slider";
import { MyImage } from "../layouts/MyImage";

interface Props {

}

export const UploadPostForm: FC<Props> = () => {

    const userInfo = useStore($userInfo);
    const tasks = useStore($tasks);

    const [linkedPet, setLinkedPet] = useState("");
    const [auxImg, setAuxImg] = useState<string[]>([]);

    const { createNotification } = useNotifications();

    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    if (!userInfo.id) return <></>;

    useEffect(() => {
        if (userInfo.pets.length > 0 && descriptionRef.current!.value.startsWith("Hoy mi ") && descriptionRef.current!.value.slice(-3) === "...") {
            const lastPet = (linkedPet === "") ? userInfo.pets.at(-1) : userInfo.pets.find((pet) => pet.name === linkedPet);
            descriptionRef.current!.value = getPetAttitude(lastPet);
        }
    }, [linkedPet]);

    const handleFile = async (e: TargetedEvent<HTMLInputElement>) => {
        if (!fileRef.current || !fileRef.current.files || !fileRef.current.files[0]) return;

        $updateTasks("Subiendo imagen");

        for (let i = 0; i < fileRef.current.files.length; i++) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(fileRef.current.files[i]);
            fileReader.addEventListener("load", (e) => {
                const result = e.target!.result;

                if (!result) return createNotification({ type: "error", content: "Ocurrió un error cargando una imagen" });

                setAuxImg((prevState) => [result as string, ...prevState]);

                if (i === fileRef.current!.files!.length - 1) $updateTasks("Subiendo imagen");
            });

            fileReader.addEventListener('error', () => {
                createNotification({ type: "error", content: "Ocurrió un error cargando una imagen" });
                if (i === fileRef.current!.files!.length - 1) $updateTasks("Subiendo imagen");
            });
        }

    };

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();

        let images: Array<string> = [];

        $updateTasks("Creando mascota");

        if (auxImg && fileRef.current && fileRef.current.files && fileRef.current.files.length > 0) {
            $updateTasks("Subiendo imagen");

            const imagesUploading = await Promise.all(Array.from(fileRef.current.files).map((file) => uploadImageToS3(file, "post")));

            $updateTasks("Subiendo imagen");

            imagesUploading.forEach((res) => !res.error && images.push(res.payload.imgUrl));
        };

        const res = await uploadNewPost({ authorId: userInfo.id, description: descriptionRef.current!.value.trim(), images, petId: userInfo.pets.find((p) => p.name === linkedPet)?.id, published: true });
        $updateTasks("Creando mascota");

        createNotification({ type: !res.error ? "success" : "error", content: res.message[0] });
        !res.error && $updateUserPosts(res.payload.post);
    };

    return (
        <div className="upload-form">
            <form onSubmit={handleSubmit}>
                <p>Toda <span style={{ fontWeight: '600' }}>publicación sin imágenes</span> irá a tu muro.</p>

                <div>
                    <label for="post-description">Contenido</label>
                    <textarea ref={descriptionRef} data-space name="description" id="post-description" rows={6} placeholder="Escribe aquí" defaultValue={
                        (userInfo.pets.length > 0) ? getPetAttitude(userInfo.pets.at(-1)!) : ""
                    }></textarea>
                </div>

                <div data-space>
                    <label style={{ marginRight: "1rem" }}>¿Enlazar a alguna mascota?</label>
                    <SelectOptions id="link-pet" options={[{ value: "", text: "-----" }, ...userInfo.pets.map((pet) => ({ value: pet.name }))]} selected={linkedPet} setSelected={setLinkedPet} />
                </div>

                <div style={{ margin: "0 auto 1rem", width: "clamp(300px, 100%, 450px)" }}>
                    {
                        (auxImg) && (auxImg.length === 1)
                            ? <div data-space class="img-container aux-img-container fadeIn"><img class="aux-img" src={auxImg[0]} alt="Nueva imagen de publicación" /></div>
                            : (auxImg.length > 1)
                                ? (
                                    <Slider identifier="aux-imgs" autorun duration={70000} children={auxImg.map((img) =>
                                        <div class="slider-element">
                                            <div class="img-container aux-img-container fadeIn"><img class="aux-img" src={img} alt="Nueva imagen de perfil" /></div>
                                        </div>
                                    )} />
                                )
                                : <></>
                    }
                </div>

                <input ref={fileRef} type="file" style={{ display: "none" }} accept={ValidExtensions.join(", ").slice(0, -2)} multiple onChange={handleFile} />
                <button data-space type="button" id="button-post-imgs" className="button" disabled={tasks.includes("Creando mascota")} onClick={() => fileRef.current!.click()}>Subir imágenes</button>

                <div data-stretch></div>

                <button type="submit" class="button bg-secondary upload-submit-button" disabled={tasks.includes("Creando mascota")}>Subir publicación</button>
            </form>
        </div>
    );
};
