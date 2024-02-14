import type { FC } from "preact/compat";

import { SliderOptions } from "../hoc/SliderOptions";
import { useStore } from "@nanostores/preact";
import { $dataLoaded } from "@/stores/DataLoaded";
import { ModalCardButton } from "../hoc/ModalCardButton";
import { PetInfo } from "./PetInfo";
import { LinkCard } from "./LinkCard";

interface Props {

}

export const AsideInfo: FC<Props> = () => {

    const cachedInfo = useStore($dataLoaded);

    return (
        <aside>
            <h3>Últimos usuarios</h3>
            <SliderOptions children={cachedInfo.cachedUsers.map((user) => <div class="slider-option"><LinkCard href={`/profile/${user.id}`} imgSrc={user.image} textLink={user.name} /></div>)} />
            <h3>Últimas mascotas</h3>
            <SliderOptions children={cachedInfo.cachedPets.map((pet) => <div class="slider-option"><ModalCardButton textTitle={pet.name} children={<PetInfo pet={pet} />} textButton={pet.name} imgSrc={pet.image} extendClass="bg-third" /></div>)} />
        </aside>
    );
};
