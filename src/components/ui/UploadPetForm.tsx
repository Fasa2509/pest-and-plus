import { useRef, type FC, useState } from "preact/compat";
import { useStore } from "@nanostores/preact";

import { $updateUserPets } from "@/stores/UserInfo";
import { $tasks, $updateTasks } from "@/stores/Loading";
import { SelectOptions } from "./SelectOptions";
import type { IUser } from "@/types/User";
import { uploadNewPet } from "@/database/DbPet";
import { ValidPetBehavior, ValidPetType, petBehaviorTranslations, petTypeTranslations, getRandomImg, type INewPet, EnumPetTypeTranslations, EnumPetBehaviorTranslations, reversePetTypeTranslations, reversePetBehaviorTranslations } from "@/types/Pet";
import "./UploadPostForm.css";
import { useNotifications } from "@/hooks/useNotifications";

interface Props {
    userInfo: IUser;
}

export const UploadPetForm: FC<Props> = ({ userInfo }) => {

    const tasks = useStore($tasks);

    const [selectedPetType, setSelectedPetType] = useState<EnumPetTypeTranslations | "">("");
    const [selectedBehaviors, setSelectedBehaviors] = useState<Array<EnumPetBehaviorTranslations>>([]);

    const { createNotification } = useNotifications();

    const nameRef = useRef<HTMLInputElement>(null);
    const bioRef = useRef<HTMLTextAreaElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    if (!userInfo.id) return <></>;

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();

        if (!nameRef.current || !bioRef.current) return;
        if (!selectedPetType) return createNotification({ type: "error", content: "No has seleccionado el tipo de mascota" });
        if (selectedBehaviors.length < 1) return createNotification({ type: "error", content: "No has seleccionado actitudes de tu mascota" });

        const data: INewPet = {
            name: nameRef.current.value,
            image: getRandomImg(),
            petType: reversePetTypeTranslations[selectedPetType],
            bio: bioRef.current.value ? bioRef.current.value : undefined,
            behaviors: selectedBehaviors.map((b) => reversePetBehaviorTranslations[b]),
            owners: [userInfo.id],
        };

        $updateTasks("Creando mascota");
        const res = await uploadNewPet(data);
        $updateTasks("Creando mascota");

        createNotification({ type: !res.error ? "success" : "error", content: res.message[0] });

        if (!res.error) {
            $updateUserPets({ id: res.payload.petId, name: data.name, petType: data.petType, image: data.image, behaviors: data.behaviors, createdAt: new Date() });
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
        <div className="upload-form-container upload-pet-form-container">
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

                <input ref={fileRef} class="input" type="file" style={{ display: "none" }} />
                <button type="button" id="button-pet-img" className="button" disabled={tasks.includes("Creando mascota")} onClick={() => fileRef.current!.click()}>Subir imagen</button>

                <button type="submit" class="button bg-secondary upload-submit-button" disabled={tasks.includes("Creando mascota")}>Subir mascota</button>
            </form>
        </div>
    );
};
