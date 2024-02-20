import { useEffect, type FC, useState } from "preact/compat";
import { useStore } from "@nanostores/preact";

import type { IPetInfo } from "@/types/User";
import { petBehaviorTranslations, type IPet, petTypeTranslations } from "@/types/Pet";
import { $tasks, $updateTasks } from "@/stores/Loading";
import { $dataLoaded, $updatePets } from "@/stores/DataLoaded";
import { getNewPet } from "@/database/DbPet";
import { toggleFollowNewPet } from "@/database/DbFollow";
import { $toggleFollowingPet, $userInfo } from "@/stores/UserInfo";
import { SliderOptions } from "../hoc/SliderOptions";
import { LinkCard } from "./LinkCard";
import { useNotifications } from "@/hooks/useNotifications";
import { PromiseConfirmHelper } from "@/stores/Notifications";
import "./PetsInfo.css";

interface Props {
    pet: IPetInfo;
}

export const PetInfo: FC<Props> = ({ pet }) => {

    const allPets = useStore($dataLoaded);
    const userInfo = useStore($userInfo);
    const tasks = useStore($tasks);

    const [petInfo, setPetInfo] = useState<IPet | undefined>(undefined);

    const { createNotification } = useNotifications();

    useEffect(() => {
        (async () => {
            const isMyPetLoaded = userInfo.id && allPets.myPets.find((p) => p.id === pet.id);
            const isOtherPetLoaded = allPets.otherPets.find((p) => p.id === pet.id);

            if (isMyPetLoaded) {
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
            !res.error && setPetInfo(res.payload.pet);
        })();
    }, []);

    const toggleFollowPet = async () => {
        if (!userInfo.id) return createNotification({ type: "error", content: "Inicia sesión para seguir a esta mascota" });
        if (userInfo.pets.some((p) => p.id === pet.id)) return createNotification({ type: "error", content: "Esta mascota es tuya" });

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

    if (!petInfo) return <></>;

    return (
        <section class="pet-info-section fadeIn">
            <div style={{ display: "flex", marginBottom: ".5rem" }}>
                <span class="pet-type" style={{ flexGrow: "1" }}>{petTypeTranslations[petInfo.petType]}</span>
                <div style={{ marginRight: "1rem" }}>
                    {
                        (!userInfo.id)
                            ? (
                                <button class="button follow-pet-button fadeIn" onClick={() => {
                                    createNotification({ type: "info", content: "Inicia sesión para seguir a una mascota" })
                                    console.log(userInfo)
                                }}>
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
                            : (userInfo.pets.some((p) => p.id === pet.id))
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
                <div className="img-container">
                    <img src={petInfo.image || "/default-image.png"} alt={pet.name} />
                </div>
                <div className="behaviors-container">
                    {
                        petInfo.behaviors.map((b) => <span class="button bg-third">{petBehaviorTranslations[b]}</span>)
                    }
                </div>
                <div>
                    <p>
                        {(petInfo.bio) ? petInfo.bio : "No hay bio de esta mascota :("}
                    </p>
                </div>
                <div>
                    <h3>Otros dueños de {pet.name}</h3>
                    <SliderOptions children={petInfo.owners.map((user) => <div class="slider-option"><LinkCard href={`/profile/${user.id}`} imgSrc={user.image} textLink={user.name} /></div>)} />
                </div>
            </div>
        </section>
    )
};
