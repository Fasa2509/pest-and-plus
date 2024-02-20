import { type FC } from "preact/compat";

import { SliderOptions } from "../hoc/SliderOptions";
import { ModalCardButton } from "../hoc/ModalCardButton";
import { PetInfo } from "../ui/PetInfo";
import type { IUser } from "@/types/User";
import "./Perfil.css";

interface Props {
    user: IUser;
}

export const OtherProfilePets: FC<Props> = ({ user }) => {

    return (
        <article class="sub-container second-element">
            <div class="content-container my-pets-container">
                <h3>Mascotas de {user.name}</h3>
                {
                    (user.pets.length === 0)
                        ? <p>¡Vaya! Este usuario aún no ha publicado ninguna mascota.</p>
                        : <SliderOptions children={user.pets.map((pet) => <div class="slider-option"><ModalCardButton children={<PetInfo pet={pet} />} textTitle={pet.name} textButton={pet.name} imgSrc={pet.image} /></div>)} />
                }
                <div style={{ flexGrow: 1 }}></div>
            </div>
        </article>
    )
};
