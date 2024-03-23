import { useState, type FC } from "preact/compat";
import { useStore } from "@nanostores/preact";

import type { IPetInfo, IUser } from "@/types/User";
import { $tasks, $updateTasks } from "@/stores/Loading";
import { useNotifications } from "@/hooks/useNotifications";
import { PromiseConfirmHelper } from "@/stores/Notifications";
import { ModalButton } from "../hoc/ModalButton";
import { PetInfo } from "./PetInfo";
import type { IResponseLinkRequest } from "@/types/LinkRequest";
import { responseLinkRequest } from "@/database/DbLink";
import { $responseLinkRequest } from "@/stores/UserInfo";
import "./DisplayLinkRequest.css";

interface Props {
    userInfo: IUser;
}

export const DisplayLinkRequests: FC<Props> = ({ userInfo }) => {

    const tasks = useStore($tasks);

    const [alreadyDisplayed, setAlreadyDisplayed] = useState(false);
    const [disappear, setDisappear] = useState("");

    const { createNotification } = useNotifications();

    const handleResponse = async (resInfo: IResponseLinkRequest & { petInfo: IPetInfo }) => {
        setAlreadyDisplayed(true);
        let notId = createNotification({
            type: (resInfo.response === "accept") ? "info" : "warning",
            content: `¿${(resInfo.response === "accept") ? "Aceptar" : "Rechazar"} la solicitud para ser dueño de ${resInfo.petInfo.name}?`,
            confirmation: true,
        });

        let accepted = await PromiseConfirmHelper(notId);

        if (!accepted) return;

        $updateTasks("Respondiendo solicitud");
        const res = await responseLinkRequest({ id: resInfo.id, response: resInfo.response });
        $updateTasks("Respondiendo solicitud");

        setDisappear(`link-request-${resInfo.id}`);
        !res.error && setTimeout(() => $responseLinkRequest(resInfo.id, resInfo.petInfo, resInfo.response), 450);

        createNotification({ type: res.error ? "error" : (resInfo.response === "accept") ? "success" : "info", content: res.message[0] });
    };

    return (
        <section class="modal-child-container request-main-container">
            {
                userInfo.linkRequests.map((req, index) => (
                    <div className={`request-bar ${(!alreadyDisplayed) ? "request-slide-in" : ""} ${disappear === `link-request-${req.id}` ? "fade-out-request" : ""}`} style={{ animationDelay: `${Number(index) * 200}ms` }} id={`link-request-${req.id}`}>
                        {
                            <div className="bar-img-container">
                                <img src={req.askedPet.creator.image || "/default-image.png"} alt={`Solicitud de ${req.requestingUser.name}`} />
                            </div>
                        }
                        <span class="bar-title">
                            ¡{req.askedPet.creator.name} quiere enlazarte con <ModalButton children={<PetInfo pet={req.askedPet} />} textButton={req.askedPet.name} textTitle={req.askedPet.name} round full />!
                            <div style={{ display: "flex", columnGap: "1rem" }}>
                                <button disabled={tasks.includes("Respondiendo solicitud")} className="button" style={{ backgroundColor: "var(--success-color)", color: "#fff", padding: ".4rem .8rem", borderRadius: "5rem" }} onClick={() => handleResponse({ id: req.id, petInfo: req.askedPet, response: "accept" })}>Aceptar</button>
                                <button disabled={tasks.includes("Respondiendo solicitud")} className="button" style={{ backgroundColor: "var(--error-color)", color: "#fff", padding: ".4rem .8rem", borderRadius: "5rem" }} onClick={() => handleResponse({ id: req.id, petInfo: req.askedPet, response: "reject" })}>Rechazar</button>
                            </div>
                        </span>

                    </div>
                ))
            }
        </section>
    );
};
