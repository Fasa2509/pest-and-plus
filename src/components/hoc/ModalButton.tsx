import type { CSSProperties, FC, JSX } from "preact/compat";
import { useEffect, useState } from "preact/hooks";

import { ModalWindow } from "./ModalWindow";
import { ModalFull } from "./ModalFull";

interface Props {
    children: JSX.Element;
    textButton: string;
    textTitle?: string;
    initialState?: boolean;
    extendClass?: string;
    extendStyles?: CSSProperties;
    full?: boolean;
    round?: boolean;
}

export const ModalButton: FC<Props> = ({ children, textButton, textTitle, initialState = false, extendClass = "", extendStyles = {}, full = false, round = false }) => {

    if (full && !textTitle) console.error("No se proveyó título de modal full");

    const [isOpen, setIsOpen] = useState(initialState);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        (isOpen)
            ? document.querySelector("body")!.classList.add("disable-body")
            : document.querySelector("body")!.classList.remove("disable-body")
    }, [isOpen]);

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setClosing(true);
        setIsOpen(false);
        setTimeout(() => setClosing(false), 500);
    };

    return (
        <>
            <button class={`button modal-button ${round ? "button-round" : ""} ${extendClass}`} style={extendStyles} onClick={openModal}>{textButton}</button>
            {
                (full && (isOpen || closing)) &&
                <ModalFull closeModal={closeModal} isOpen={isOpen} title={textTitle || ""} closing={closing}>
                    {
                        children
                    }
                </ModalFull>
            }
            {
                (!full && (isOpen || closing)) &&
                <ModalWindow closeModal={closeModal} title={textTitle} closing={closing}>
                    {
                        children
                    }
                </ModalWindow>
            }
        </>
    );
};

/*
{
    (isOpen && !full) ?
        (
            <ModalWindow closeModal={closeModal} title={textTitle}>
                {
                    children
                }
            </ModalWindow>
        ) : (
            <ModalFull closeModal={closeModal} isOpen={isOpen} title={textTitle || ""} closing={closing}>
                {
                    children
                }
            </ModalFull>
        )
}
*/