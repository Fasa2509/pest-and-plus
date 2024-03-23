import { useEffect, useRef, type FC, useState } from "preact/compat";
import { useStore } from "@nanostores/preact";

import type { IPetInfo } from "@/types/User";
import { petBehaviorTranslations, type IPet, petTypeTranslations, ValidPetBehavior, type TPetBehavior } from "@/types/Pet";
import { $tasks, $updateTasks } from "@/stores/Loading";
import { $dataLoaded, $updatePets } from "@/stores/DataLoaded";
import { getNewPet, updatePetInfo } from "@/database/DbPet";
import { toggleFollowNewPet } from "@/database/DbFollow";
import { $toggleFollowingPet, $updateUserPetInfo, $userInfo } from "@/stores/UserInfo";
import { SliderOptions } from "../hoc/SliderOptions";
import { LinkCard } from "./LinkCard";
import { useNotifications } from "@/hooks/useNotifications";
import { PromiseConfirmHelper } from "@/stores/Notifications";
import { ModalButton } from "../hoc/ModalButton";
import { LinkPetForm } from "./LinkPetForm";
import { SelectOptions } from "./SelectOptions";
import { MyImage } from "../layouts/MyImage";
import "./PetsInfo.css";

interface Props {
    pet: IPetInfo;
}

export const PetInfo: FC<Props> = ({ pet }) => {

    const allPets = useStore($dataLoaded);
    const userInfo = useStore($userInfo);
    const tasks = useStore($tasks);

    const [petInfo, setPetInfo] = useState<IPet | undefined>(undefined);
    const [selectedBehaviors, setSelectedBehaviors] = useState<Array<TPetBehavior>>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [auxImg, setAuxImg] = useState<string | undefined>(undefined);

    const nameRef = useRef<HTMLInputElement>(null);
    const bioRef = useRef<HTMLTextAreaElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const { createNotification } = useNotifications();

    useEffect(() => {
        (async () => {
            const isMyPetLoaded = userInfo.id && allPets.myPets.find((p) => p.id === pet.id);
            const isOtherPetLoaded = allPets.otherPets.find((p) => p.id === pet.id);

            if (isMyPetLoaded) {
                setSelectedBehaviors(isMyPetLoaded.behaviors)
                setPetInfo(isMyPetLoaded);
                return;
            } else if (isOtherPetLoaded) {
                setPetInfo(isOtherPetLoaded);
                return;
            };

            $updateTasks("Buscando mascota");
            const res = await getNewPet(pet.id);
            $updateTasks("Buscando mascota");

            !res.error && $updatePets(res.payload.pet, res.payload.pet.owners.some((owner) => owner.id === userInfo.id));
            !res.error && setSelectedBehaviors(res.payload.pet.behaviors);
            !res.error && setPetInfo(res.payload.pet);
        })();
    }, []);

    if (!petInfo) return <></>;

    const toggleFollowPet = async () => {
        if (!userInfo.id) return createNotification({ type: "error", content: "Inicia sesión para seguir a esta mascota" });
        if (petInfo.creator.id === userInfo.id) return createNotification({ type: "error", content: "No puedes seguir una mascota que tú subiste" });

        let isFollowed = userInfo.following.some((p) => p.id === pet.id);

        if (isFollowed) {
            const notId = createNotification({
                type: "info",
                content: `¿Quieres dejar de seguir a ${pet.name}?`,
                confirmation: true,
            });

            const accepted = await PromiseConfirmHelper(notId);

            if (!accepted) return;
        }

        $updateTasks("Siguiendo mascota...");
        const res = await toggleFollowNewPet(pet.id);
        $updateTasks("Siguiendo mascota...");

        createNotification({ type: res.error ? "error" : (isFollowed) ? "info" : "success", content: res.message[0] });
        !res.error && $toggleFollowingPet(pet, isFollowed);
    };

    const handleUpdatePetInfo = async () => {
        const notId = createNotification({
            type: "info",
            content: `¿Actualizar la información de ${petInfo.name}?`,
            confirmation: true,
        });

        const accepted = await PromiseConfirmHelper(notId);

        if (!accepted) return;

        $updateTasks("Actualizando informaición...");
        const res = await updatePetInfo(pet.id, { name: nameRef.current!.value, image: (auxImg === null) ? null : (typeof auxImg === "string") ? auxImg : petInfo.image, bio: bioRef.current!.value, behaviors: selectedBehaviors });
        $updateTasks("Actualizando informaición...");

        createNotification({ type: !res.error ? "success" : "error", content: res.message[0] });
        if (!res.error) {
            $updateUserPetInfo(pet.id, { name: nameRef.current!.value, image: (auxImg === null) ? null : (typeof auxImg === "string") ? auxImg : petInfo.image, bio: bioRef.current!.value, behaviors: selectedBehaviors });
            setPetInfo({ ...petInfo, name: nameRef.current!.value, image: (auxImg === null) ? null : (typeof auxImg === "string") ? auxImg : petInfo.image, bio: bioRef.current!.value, behaviors: selectedBehaviors });
            setIsEditing(false);
        }
    };

    return (
        <section class="pet-info-section">
            <div style={{ display: "flex", marginBottom: ".5rem" }}>
                <span class="pet-type" style={{ flexGrow: "1" }}>{petTypeTranslations[petInfo.petType]}</span>
                <div style={{ marginRight: "1rem" }}>
                    {
                        (!userInfo.id)
                            ? (
                                <button class="button follow-pet-button fadeIn" onClick={() => createNotification({ type: "info", content: "Inicia sesión para seguir a una mascota" })}>
                                    <div class="follow-pet-icon-container">
                                        <svg class="svg-icon icon-follow-pet" viewBox="0 0 20 20">
                                            <path fill="none" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
                                        </svg>
                                    </div>
                                    <span>
                                        Seguir
                                    </span>
                                </button>
                            )
                            : (petInfo.creator.id === userInfo.id)
                                ? <button class={`button fadeIn ${isEditing ? "bg-secondary" : ""}`} disabled={tasks.includes("Actualizando informaición...")} onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Cancelar" : "Actualizar"}</button>
                                : (petInfo.owners.some(({ id }) => userInfo.id === id))
                                    ? <></>
                                    : (
                                        <button class={`button follow-pet-button fadeIn ${userInfo.following.some((p) => p.id === pet.id) ? "pet-followed" : ""}`} disabled={tasks.includes("Siguiendo mascota...")} onClick={toggleFollowPet}>
                                            <div class="follow-pet-icon-container">
                                                <svg class="svg-icon icon-follow-pet" viewBox="0 0 20 20">
                                                    <path fill="none" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
                                                </svg>
                                            </div>
                                            <span>
                                                {(userInfo.following.some((p) => p.id === pet.id))
                                                    ? "Siguiendo"
                                                    : "Seguir"
                                                }
                                            </span>
                                        </button>
                                    )
                    }
                </div>
            </div>
            <div className="pet-info-first">
                <div>
                    <MyImage src={petInfo.image || "/default-image.png"} alt={pet.name} size="lg" center>
                        {
                            isEditing && (
                                <div className="img-editing fadeIn" onClick={() => fileRef.current!.click()}>
                                    <input ref={fileRef} type="file" style={{ display: "none" }} />
                                    {
                                        (auxImg)
                                            ? <img src="" alt="" />
                                            : '+'
                                    }
                                </div>
                            )
                        }
                    </MyImage>
                </div>
                <div className="behaviors-container">
                    {
                        (!isEditing)
                            ? petInfo.behaviors.map((b) => <span class="button bg-third">{petBehaviorTranslations[b]}</span>)
                            : selectedBehaviors.map((b) => <span class={`button bg-third ${!petInfo.behaviors.includes(b) ? "fadeIn" : ""}`}>{petBehaviorTranslations[b]}</span>)
                    }
                </div>
                <div style={{ padding: "0 3px" }}>
                    {
                        (!isEditing)
                            ? (
                                <p>
                                    {(petInfo.bio) ? petInfo.bio : "No hay bio de esta mascota :("}
                                </p>
                            )
                            : (
                                <>
                                    <div style={{ display: "flex", flexDirection: "column", rowGap: "1rem", marginBottom: "1rem" }}>
                                        <SelectOptions id="pet-behavior" options={ValidPetBehavior.map((opt) => ({ value: opt, text: petBehaviorTranslations[opt] }))} selected={selectedBehaviors} setSelected={setSelectedBehaviors} lastValue={petBehaviorTranslations[selectedBehaviors.at(-1) || "happy"]} multiple />
                                        <input ref={nameRef} name="name" rows={5} defaultValue={petInfo.name} placeholder="Nombre de tu mascota" />
                                        <textarea ref={bioRef} name="bio" id="textarea-bio" rows={5} placeholder="Bio de tu mascota">{petInfo.bio || ""}</textarea>
                                        <button className="button full-width" disabled={tasks.includes("Actualizando informaición...")} onClick={handleUpdatePetInfo}>Guardar cambios</button>
                                    </div>
                                </>
                            )
                    }
                </div>
                {
                    (!isEditing) && (
                        <div class="fadeIn" style={{ display: "flex", flexDirection: "column" }}>
                            <h3>Otros dueños de {pet.name}</h3>
                            <SliderOptions children={petInfo.owners.map((user) => <div class="slider-option"><LinkCard href={`/profile/${user.id}`} imgSrc={user.image} textLink={user.name} /></div>)} />
                            {(userInfo.id && petInfo.creator.id === userInfo.id) &&
                                <ModalButton children={<LinkPetForm petInfo={pet} />} textButton={`Enlazar ${pet.name} a otro usuario`} textTitle={`Enlazar ${pet.name}`} extendClass="bg-secondary button-round" extendStyles={{ alignSelf: "flex-end", color: "#fafafa" }} full />
                            }
                        </div>
                    )
                }
            </div>
        </section>
    );
};
