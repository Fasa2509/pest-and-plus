import { createPortal, type FC, type JSX } from "preact/compat";

import "./Modal.css";


interface Props {
    children: JSX.Element | JSX.Element[];
    closeModal: Function;
    title?: string;
    restrict?: boolean;
};

export const ModalWindow: FC<Props> = ({ children, closeModal, title, restrict }) => {

    const handleClose = (e: MouseEvent) => {
        let closables = [".modal", ".modal .modal-close *", ".modal .modal-close-restrict *", ".modal-window-restrict", ".followed-posts-container"]
        // @ts-ignore
        if (closables.some((str) => e.target.matches(str))) closeModal();
    };

    return createPortal(
        <section class={`modal fadeIn ${restrict ? "modal-restrict" : ""}`} onClick={handleClose}>
            <div class={`modal-window modal-window-slice ${restrict ? "modal-window-restrict" : ""}`}>
                <div className="modal-title-container" style={{ justifyContent: (restrict) ? "flex-start" : (title) ? 'flex-between' : 'flex-end' }}>
                    {title && <span>{title}</span>}
                    {
                        (!restrict)
                            ? (
                                <div className="modal-close" onClick={handleClose}>
                                    <svg class="svg-icon icon-close" viewBox="0 0 20 20">
                                        <path fill="none" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
                                    </svg>
                                </div>
                            ) : (
                                <div className="modal-close-restrict" onClick={handleClose}>
                                    <svg class="svg-icon icon-close icon-close-restrict" viewBox="0 0 20 20">
                                        <path fill="none" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
                                    </svg>
                                </div>
                            )
                    }
                </div>
                {
                    children
                }
            </div>
        </section>
        , document.getElementById("modal-root")!
    );
};
