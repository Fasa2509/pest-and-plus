import type { FC, JSX } from "preact/compat";
import { useEffect, useState } from "preact/hooks"

import { ModalWindow } from "./ModalWindow";

interface Props {
    children: JSX.Element;
    textButton: string;
    imgSrc: string | null;
    selectChild: Function;
    textTitle?: string;
    count?: number;
    initialState?: boolean;
    extendClass?: string;
    index?: number;
}

export const ModalBar: FC<Props> = ({ children, textButton, imgSrc, selectChild, textTitle, count, initialState = false, extendClass = "", index }) => {

    const [isOpen, setIsOpen] = useState(initialState);

    useEffect(() => {
        (isOpen)
            ? document.querySelector("body")!.classList.add("disable-body")
            : document.querySelector("body")!.classList.remove("disable-body")
    }, [isOpen]);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <>
            <button class={`button modal-bar ${extendClass}`} style={{ animationDelay: `${Number(index) * 150}ms` }} onClick={() => {
                selectChild(index);
                openModal();
            }}>
                <div className="bar-img-container">
                    <img src={imgSrc || "/default-image.png"} alt={textButton} />
                </div>
                <span class="bar-title">
                    {textButton}
                </span>
                {
                    count && (
                        <span class="bar-count">
                            {count}
                        </span>
                    )
                }
            </button>
            {
                (isOpen) &&
                (
                    <ModalWindow closeModal={closeModal} title={textTitle} restrict>
                        {
                            children
                        }
                    </ModalWindow>
                )
            }
        </>
    )
}
