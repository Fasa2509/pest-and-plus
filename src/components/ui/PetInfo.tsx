import { useEffect, type FC, useState } from "preact/compat";
import { useStore } from "@nanostores/preact";

import type { IPetInfo } from "@/types/User";
import { petBehaviorTranslations, type IPet, petTypeTranslations } from "@/types/Pet";
import { $updateTasks } from "@/stores/Loading";
import { $petsLoaded, $updatePets } from "@/stores/PetsLoaded";
import { getNewPet } from "@/database/DbPet";
import { $userInfo } from "@/stores/UserInfo";
import "./PetsInfo.css";

interface Props {
    pet: IPetInfo;
}

export const PetInfo: FC<Props> = ({ pet }) => {

    const allPets = useStore($petsLoaded);
    const userInfo = useStore($userInfo);

    const [petInfo, setPetInfo] = useState<IPet | undefined>(undefined);

    if (!userInfo.id) return <></>;

    useEffect(() => {
        (async () => {
            const isMyPetLoaded = allPets.myPets.some((p) => p.id === pet.id);
            const isOtherPetLoaded = allPets.otherPets.some((p) => p.id === pet.id);

            if (isMyPetLoaded) {
                setPetInfo(allPets.myPets.find((p) => p.id === pet.id));
                return;
            } else if (isOtherPetLoaded) {
                setPetInfo(allPets.otherPets.find((p) => p.id === pet.id));
                return;
            };

            $updateTasks("Buscando mascota");
            const res = await getNewPet(pet.id);
            $updateTasks("Buscando mascota");

            !res.error && $updatePets(res.payload.pet, res.payload.pet.owners.some((owner) => owner.id === userInfo.id));
            !res.error && setPetInfo(res.payload.pet);
        })();
    }, []);

    if (!petInfo) return <></>;

    return (
        <section class="pet-info-section fadeIn">
            <span class="pet-type">{petTypeTranslations[petInfo.petType]}</span>
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
            </div>
        </section>
    )
};
