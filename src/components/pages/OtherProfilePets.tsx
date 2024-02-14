import { type FC } from "preact/compat";
import { useStore } from "@nanostores/preact";

import { $userInfo } from "@/stores/UserInfo";
import { UploadPetForm } from "@/components/ui/UploadPetForm";
import { ModalButton } from "@components/hoc/ModalButton";
import { SliderOptions } from "../hoc/SliderOptions";
import { ModalCardButton } from "../hoc/ModalCardButton";
import { PetInfo } from "../ui/PetInfo";
import { TModalFullType } from "@/hooks/useModalFull";
import type { IUser } from "@/types/User";
import "./Perfil.css";

interface Props {
    user: IUser;
}

export const OtherProfilePets: FC<Props> = ({ user }) => {

    // const userInfo = useStore($userInfo);

    // if (!userInfo.id) return <></>;

    return (
        <article class="sub-container second-element">
            <div class="content-container my-pets-container">
                <h3>Mascotas de {user.name}</h3>
                {
                    (user.pets.length === 0)
                        ? <p>¡Vaya! Este usuario aún no ha publicado ninguna mascota.</p>
                        : <SliderOptions children={user.pets.map((pet) => <div class="slider-option"><ModalCardButton children={<PetInfo pet={pet} />} textTitle={pet.name} textButton={pet.name} imgSrc={pet.image} /></div>)} />
                    // : <MyPetsInfo pets={user.pets} />
                }
                <div style={{ flexGrow: 1 }}></div>
                {/* <ModalButton textButton="Subir mascota" textTitle="Subir nueva mascota" children={<UploadPetForm user={user} />} extendClass="full-width bg-third" full /> */}
            </div>
        </article>
    )
};
