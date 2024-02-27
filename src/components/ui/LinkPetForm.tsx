import { useState, type FC, useRef } from "preact/compat";
import { useStore } from "@nanostores/preact";

import type { IPetInfo } from "@/types/User";
import { $tasks, $updateTasks } from "@/stores/Loading";
import { useNotifications } from "@/hooks/useNotifications";
import { requestLinkPet } from "@/database/DbLink";
// import "./UploadPostForm.css";

interface Props {
    petInfo: IPetInfo;
}

export const LinkPetForm: FC<Props> = ({ petInfo }) => {

    const tasks = useStore($tasks);

    const { createNotification } = useNotifications();

    const [ids, setIds] = useState<number[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();

        if (ids.length === 0) return createNotification({ type: "error", content: "No has agregado ningún id" });

        $updateTasks("Enlazando mascota");
        const res = await requestLinkPet({ usersIds: ids, petId: petInfo.id });
        $updateTasks("Enlazando mascota");

        res.error && createNotification({ type: "error", content: res.message[0] });
        if (!res.error) {
            res.message.map((msg) => createNotification({ type: "success", content: msg }));
            setIds([]);
            inputRef.current!.value = "";
        };
    };

    const handleAddId = () => {
        // @ts-ignore
        if (isNaN(Number(inputRef.current!.value)) || !Number.isInteger(Number(inputRef.current!.value))) return createNotification({ type: "warning", content: "El id debe ser un número" });
        if (ids.includes(Number(inputRef.current!.value))) return createNotification({ type: "warning", content: "Ese id ya fue agregado" });
        setIds((prevState) => [...prevState, Number(inputRef.current!.value)]);
    };

    // const isMobile = (navigator.userAgent.match(/Android/i) ||
    //     navigator.userAgent.match(/webOS/i) ||
    //     navigator.userAgent.match(/iPhone/i) ||
    //     navigator.userAgent.match(/iPad/i) ||
    //     navigator.userAgent.match(/iPod/i) ||
    //     navigator.userAgent.match(/BlackBerry/i) ||
    //     navigator.userAgent.match(/Windows Phone/i))

    return (
        <div className="upload-form-container">
            <form class="pet-form" onSubmit={handleSubmit}>
                <p>¡Enlaza a {petInfo.name} a alguien más! Escribe su <b>id de usuario</b> aquí y ese usuario recibirá una solicitad para ser dueño de {petInfo.name}.</p>

                <div>
                    <input ref={inputRef} class="input" type="number" name="id" id="pet-id" placeholder="ID de usuario" min={0} step={1} />
                </div>

                <div class="ids-container">
                    {
                        ids.map((id) => <button class="button chip bg-third fadeIn" onClick={(e: MouseEvent) => setIds((prevState) => prevState.filter((spanId) => spanId !== id))}>{id}</button>)
                    }
                </div>

                {
                    (ids.length > 0) && <p class="fadeIn">Haz click sobre un id para removerlo.</p>
                }

                <button class="button" type="button" onClick={handleAddId}>Agregar id</button>

                <div data-stretch></div>

                <button type="submit" class="button bg-secondary" disabled={tasks.includes("Enlazando mascota")}>Enlazar mascota</button>
            </form>
        </div>
    );
};
