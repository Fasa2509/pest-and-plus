import { type FC } from "preact/compat";
import { useStore } from "@nanostores/preact";

import { $userInfo } from "@/stores/UserInfo";
import { MyPetsInfo } from "@/components/ui/MyPetsInfo";
import { UploadPetForm } from "@/components/ui/UploadPetForm";
import { ModalButton } from "@components/hoc/ModalButton";
import "./Perfil.css";

interface Props {

}

export const PerfilPets: FC<Props> = () => {

    const userInfo = useStore($userInfo);

    if (!userInfo.id) return <></>;

    return (
        <article class="sub-container second-element">
            <div class="content-container my-pets-container">
                <h3>Mis mascotas</h3>
                {
                    (userInfo.pets.length === 0)
                        ? <p>¡Vaya! ún no has publicado ninguna mascota. Intenta subir una.</p>
                        : <MyPetsInfo pets={userInfo.pets} />
                }
                {
                    (userInfo.pets.length > 0) && <p>He aquí todas tus mascotas, ¡cuéntanos algo nuevo de ellas o sube una nueva!</p>
                }
                <div style={{ flexGrow: 1 }}></div>
                <ModalButton textButton="Subir mascota" textTitle="Subir nueva mascota" children={<UploadPetForm userInfo={userInfo} />} extendClass="full-width bg-third" full />
            </div>
        </article>
    )
};
