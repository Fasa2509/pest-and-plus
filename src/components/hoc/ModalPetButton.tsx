import type { CSSProperties, FC, JSX } from "preact/compat";
import { useState } from "preact/hooks"
import { ModalWindow } from "./ModalWindow";
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
    full?: boolean;
}

export const ModalPetButton: FC<Props> = ({ children, textButton, imgSrc, textTitle, initialState = false, extendClass = "", styles, full = true }) => {

    if (full && !textTitle) console.error("No se proveyó título de modal full");

    const [isOpen, setIsOpen] = useState(initialState);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <>
            <button class={`button button-pet ${extendClass}`} style={styles} onClick={openModal}>
                <div className="img-container pet-modal-img">
                    <img src={imgSrc || "/default-image.png"} alt={textTitle} />
                </div>
                {(textButton.length < 12) ? textButton : textButton.slice(0, 9) + '...'}
            </button>
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
