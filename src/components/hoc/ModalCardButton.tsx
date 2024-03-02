import type { CSSProperties, FC, JSX } from "preact/compat";
import { useEffect, useState } from "preact/hooks";

import { ModalFull } from "./ModalFull";
import "./Modal.css";

interface Props {
    children: JSX.Element;
    textButton: string;
    imgSrc: string | null;
    textTitle?: string;
    initialState?: boolean;
    extendClass?: string;
    styles?: CSSProperties;
}

export const ModalCardButton: FC<Props> = ({ children, textButton, imgSrc, textTitle, extendClass = "", styles }) => {

    if (!textTitle) console.error("No se proveyó título de modal full");

    const [isOpen, setIsOpen] = useState(false);
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
            <button class={`button bg-third button-card ${extendClass}`} style={styles} onClick={openModal}>
                <div className="img-container card-modal-img">
                    <img src={imgSrc || "/default-image.png"} alt={textTitle} />
                </div>
                <span>
                    {textButton}
                </span>
            </button>
            {
                (isOpen || closing) && (
                    <ModalFull closeModal={closeModal} isOpen={isOpen} title={textTitle || ""} closing={closing}>
                        {
                            children
                        }
                    </ModalFull>
                )
            }
        </>
    )
}






/*
import type { CSSProperties, FC, JSX } from "preact/compat";
import { useState } from "preact/hooks"
import { ModalFull } from "./ModalFull";

import "./Modal.css";

interface Props {
    children: JSX.Element;
    textButton: string;
    imgSrc: string | null;
    textTitle?: string;
    initialState?: boolean;
    extendClass?: string;
    styles?: CSSProperties;
}

export const ModalCardButton: FC<Props> = ({ children, textButton, imgSrc, textTitle, initialState = false, extendClass = "", styles }) => {

    if (!textTitle) console.error("No se proveyó título de modal full");

    const [isOpen, setIsOpen] = useState(initialState);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <>
            <button class={`button button-card ${extendClass}`} style={styles} onClick={openModal}>
                <div className="img-container card-modal-img">
                    <img src={imgSrc || "/default-image.png"} alt={textTitle} />
                </div>
                {(textButton.length < 12) ? textButton : textButton.slice(0, 9) + '...'}
            </button>
            {
                (isOpen) && (
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
*/