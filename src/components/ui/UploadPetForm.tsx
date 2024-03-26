import { useRef, type FC, useState, type TargetedEvent } from "preact/compat";
import { useStore } from "@nanostores/preact";

import { $updateUserPets } from "@/stores/UserInfo";
import { $tasks, $updateTasks } from "@/stores/Loading";
import { SelectOptions } from "./SelectOptions";
import type { IUser } from "@/types/User";
import { uploadNewPet } from "@/database/DbPet";
import { ValidPetBehavior, ValidPetType, petBehaviorTranslations, petTypeTranslations, type INewPet, EnumPetTypeTranslations, EnumPetBehaviorTranslations, reversePetTypeTranslations, reversePetBehaviorTranslations } from "@/types/Pet";
import { useNotifications } from "@/hooks/useNotifications";
import { ValidExtensions } from "@/types/Api";
import { uploadImageToS3 } from "@/database/DbImages";
import "./UploadPostForm.css";

interface Props {
    userInfo: IUser;
}

export const UploadPetForm: FC<Props> = ({ userInfo }) => {

    const tasks = useStore($tasks);

    const [selectedPetType, setSelectedPetType] = useState<EnumPetTypeTranslations | "">("");
    const [selectedBehaviors, setSelectedBehaviors] = useState<Array<EnumPetBehaviorTranslations>>([]);
    const [auxImg, setAuxImg] = useState("");

    const { createNotification } = useNotifications();

    const nameRef = useRef<HTMLInputElement>(null);
    const bioRef = useRef<HTMLTextAreaElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    if (!userInfo.id) return <></>;

    const handleFile = async (e: TargetedEvent<HTMLInputElement>) => {
        if (!fileRef.current || !fileRef.current.files || !fileRef.current.files[0]) return;

        $updateTasks("Subiendo imagen");
        const fileReader = new FileReader();
        fileReader.readAsDataURL(fileRef.current.files[0]);
        fileReader.addEventListener("load", (e) => {
            const result = e.target!.result;

            if (!result) return createNotification({ type: "error", content: "Ocurrió un error cargando la imagen" });

            setAuxImg(result as string);

            $updateTasks("Subiendo imagen");
        });

        fileReader.addEventListener('error', () => {
            createNotification({ type: "error", content: "Ocurrió un error cargando la imagen" });
            $updateTasks("Subiendo imagen");
        });
    };

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();

        if (!nameRef.current || !bioRef.current) return;
        if (!selectedPetType) return createNotification({ type: "error", content: "No has seleccionado el tipo de mascota" });
        if (selectedBehaviors.length < 1) return createNotification({ type: "error", content: "No has seleccionado actitudes de tu mascota" });

        let img: string | null = null;

        if (auxImg && fileRef.current && fileRef.current.files && fileRef.current.files[0]) {
            $updateTasks("Subiendo imagen");
            const resUpload = await uploadImageToS3(fileRef.current.files[0], "pet");
            $updateTasks("Subiendo imagen");

            if (resUpload.error) return createNotification({ type: "error", content: "No se pudo subir la imagen" });
            img = resUpload.payload.imgUrl
        };

        const data: INewPet = {
            name: nameRef.current.value,
            image: img,
            petType: reversePetTypeTranslations[selectedPetType],
            bio: bioRef.current.value ? bioRef.current.value : undefined,
            behaviors: selectedBehaviors.map((b) => reversePetBehaviorTranslations[b]),
            owners: [userInfo.id],
            creatorId: userInfo.id,
        };

        $updateTasks("Creando mascota");
        const res = await uploadNewPet(data);
        $updateTasks("Creando mascota");

        createNotification({ type: !res.error ? "success" : "error", content: res.message[0] });

        if (!res.error) {
            $updateUserPets({ id: res.payload.petId, name: data.name, petType: data.petType, image: data.image, behaviors: data.behaviors });
            nameRef.current.value = "";
            bioRef.current.value = "";
            setSelectedBehaviors([]);
            setSelectedPetType("");
        };
    };

    const isMobile = (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i))

    return (
        <div className="upload-form upload-pet-form-container">
            <form class="pet-form" onSubmit={handleSubmit}>
                <p>¡Comparte con todos lo que tu mascota hace! Seguro a alguien le alegrará el día ;{")"}</p>

                <div>
                    <label for="pet-type" style={{ marginRight: "1rem" }}>Tipo de mascota</label>
                    <SelectOptions id="pet-type" options={ValidPetType.map((el) => ({ value: petTypeTranslations[el] }))} selected={selectedPetType} setSelected={setSelectedPetType} />
                </div>

                <div>
                    <label for="pet-name">Nombre de tu mascota</label>
                    <input ref={nameRef} class="input" type="text" name="name" id="pet-name" placeholder="Escribe aquí" />
                </div>

                <div>
                    <label for="pet-behavior" style={{ marginRight: "1rem" }}>Actitudes de tu mascota</label>
                    <SelectOptions id="pet-behavior" options={ValidPetBehavior.map((opt) => ({ value: petBehaviorTranslations[opt] }))} selected={selectedBehaviors} setSelected={setSelectedBehaviors} defaultValue="happy" multiple />
                </div>

                <div class="behaviors-container">
                    {
                        selectedBehaviors.map((b) => <span class="chip fadeIn">{b}</span>)
                    }
                </div>

                <div>
                    <label for="pet-bio">Bio de tu mascota</label>
                    <textarea ref={bioRef} name="description" id="pet-bio" rows={6} placeholder="Escribe aquí"></textarea>
                </div>

                {isMobile && <div data-stretch></div>}

                {
                    (auxImg) && <div class="img-container aux-img-container m-center-element fadeIn"><img class="aux-img" src={auxImg} alt="Nueva imagen de perfil" /></div>
                }

                <input ref={fileRef} type="file" style={{ display: "none" }} accept={ValidExtensions.join(", ").slice(0, -2)} onChange={handleFile} />
                <button type="button" id="button-pet-img" className="button" disabled={tasks.includes("Creando mascota")} onClick={() => fileRef.current!.click()}>Subir imagen</button>

                <button type="submit" class="button bg-secondary upload-submit-button" disabled={tasks.includes("Creando mascota")}>Subir mascota</button>
            </form>
        </div>
    );
};
