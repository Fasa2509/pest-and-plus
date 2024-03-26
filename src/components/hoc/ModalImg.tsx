import type { FC, JSX } from "preact/compat";
import { useEffect, useState } from "preact/hooks";

import { ModalFull } from "./ModalFull";
import { MyImage } from "../layouts/MyImage";
import "./Modal.css";

interface Props {
    children: JSX.Element | JSX.Element[];
    imgSrc: string;
    initialState?: boolean;
    textTitle?: string;
}

export const ModalImg: FC<Props> = ({ children, imgSrc, textTitle, initialState = false }) => {

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
            <button class="button-img-container" onClick={openModal}>
                {
                    <MyImage src={imgSrc} alt={"Button image"} size="md" noBorder />
                }
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
            <ModalFull closeModal={closeModal} isOpen={isOpen} title={textTitle || ""}>
                {
                    children
                }
            </ModalFull>
        )
}
*/