import { type FC } from "preact/compat";
import { useStore } from "@nanostores/preact";

import { $userInfo } from "@/stores/UserInfo";
import { UploadPetForm } from "@/components/ui/UploadPetForm";
import { ModalButton } from "@components/hoc/ModalButton";
import { SliderOptions } from "../hoc/SliderOptions";
import { ModalCardButton } from "../hoc/ModalCardButton";
import { PetInfo } from "../ui/PetInfo";
import { DisplayLinkRequests } from "../ui/DisplayLinkRequests";
import "./Perfil.css";
import { Skeleton } from "../layouts/Skeleton";

interface Props {

}

export const ProfilePets: FC<Props> = () => {

    const userInfo = useStore($userInfo);

    return (
        <article class="sub-container second-element">
            {
                (userInfo.id === undefined || userInfo.id === null) && (
                    <Skeleton classes="content-container my-pets-container" heightClamp="400px" />
                )
            }
            {
                (userInfo.id) && (
                    <div class="content-container my-pets-container">
                        <h3>Mis mascotas</h3>
                        {
                            (userInfo.pets.length === 0)
                                ? <p>¡Vaya! ún no has publicado ninguna mascota. Intenta subir una.</p>
                                : <SliderOptions children={userInfo.pets.map((pet) => <div class="slider-option"><ModalCardButton children={<PetInfo pet={pet} />} textTitle={pet.name} textButton={pet.name} imgSrc={pet.image} /></div>)} />
                            // : <MyPetsInfo pets={userInfo.pets} />
                        }
                        {/* {
                    (userInfo.pets.length > 0) && <p>He aquí todas tus mascotas, ¡cuéntanos algo nuevo de ellas o sube una nueva!</p>
                } */}
                        <p>¿Quieres recibir una solicitud de enlace de mascotas de alguien más? Envíale tu <b>id de usuario: {userInfo.id ? userInfo.id : "..."}</b>.</p>
                        {
                            (userInfo.linkRequests.length > 0) && (
                                <p style={{ display: "flex", alignItems: "center" }}>¡Tienes
                                    <ModalButton textButton={String(userInfo.linkRequests.length)} textTitle="Solicitudes de enlace" children={<DisplayLinkRequests userInfo={userInfo} />} extendClass="bg-secondary" extendStyles={{ display: "flex", justifyContent: "center", alignItems: "center", width: "1.6rem", height: "1.6rem", borderRadius: "50%", margin: "0 .5rem", color: "#fff" }} full />
                                    solicitud{(userInfo.linkRequests.length > 1) ? "es" : ""} de enlace!</p>
                            )
                        }
                        <div style={{ flexGrow: 1 }}></div>
                        <ModalButton textButton="Subir mascota" textTitle="Subir nueva mascota" children={<UploadPetForm userInfo={userInfo} />} extendClass="bg-third" full />
                    </div>
                )
            }
        </article>
    )
};


// el extendClass del modalbutton tenia full-width 