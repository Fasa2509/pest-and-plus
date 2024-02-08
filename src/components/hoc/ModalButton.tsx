import type { FC, JSX } from "preact/compat";
import { useEffect, useState } from "preact/hooks"
import { ModalWindow } from "./ModalWindow";
import { ModalFull } from "./ModalFull";

interface Props {
    children: JSX.Element;
    textButton: string;
    textTitle?: string;
    initialState?: boolean;
    extendClass?: string;
    full?: boolean;
    round?: boolean;
}

export const ModalButton: FC<Props> = ({ children, textButton, textTitle, initialState = false, extendClass = "", full = false, round = false }) => {

    if (full && !textTitle) console.error("No se proveyó título de modal full");

    const [isOpen, setIsOpen] = useState(initialState);
    // const [didMount, setIsOpen] = useState(initialState);

    useEffect(() => {
        (isOpen)
            ? document.querySelector("body")!.classList.add("disable-body")
            : document.querySelector("body")!.classList.remove("disable-body")
    }, [isOpen]);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <>
            <button class={`button ${round ? "button-round" : ""} ${extendClass}`} onClick={openModal}>{textButton}</button>
            {
                (isOpen && !full) ?
                    (
                        <ModalWindow closeModal={closeModal} title={textTitle}>
                            {
                                children
                            }
                        </ModalWindow>
                    ) : (
                        <ModalFull closeModal={closeModal} isOpen={isOpen} title={textTitle || ""}>
                            {
                                children
                            }
                        </ModalFull>
                    )
            }
        </>
    )
}
