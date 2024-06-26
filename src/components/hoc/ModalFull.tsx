import { createPortal, useState, type FC, type JSX, useEffect, } from "preact/compat";

import "./Modal.css";

interface Props {
    children: JSX.Element | JSX.Element[];
    closeModal: Function;
    isOpen: boolean;
    title: string;
    closing: boolean;
};

export const ModalFull: FC<Props> = ({ children, isOpen, closeModal, title, closing }) => {

    const [didMount, setDidMount] = useState(false);

    useEffect(() => setDidMount(true), []);

    useEffect(() => {
        const cb = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeModal();
            };
        }

        document.addEventListener("keyup", cb);

        return () => document.removeEventListener("keyup", cb);
    }, []);

    const handleClose = (e: MouseEvent) => {
        // @ts-ignore
        if (e.target.matches(".modal-full .modal-close *")) {
            closeModal();
        };
    };

    return !didMount
        ? <></>
        : createPortal(
            <section class={`modal-full ${closing ? "closing" : ""}`} onClick={handleClose}>
                <div className="modal-full-title-container" style={{ justifyContent: title ? 'flex-between' : 'flex-end' }}>
                    <span>{title}</span>
                    <div className="modal-close" onClick={handleClose}>
                        <svg class="svg-icon icon-close" viewBox="0 0 20 20">
                            <path fill="none" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
                        </svg>
                    </div>
                </div>
                {
                    (isOpen || closing) && children
                }
            </section>
            , document.getElementById("window-root")!
        );
};




















// import { createPortal, useState, type FC, type JSX, useEffect, } from "preact/compat";

// import "./Modal.css";
// import { useModalFull } from "@/hooks/useModalFull";

// interface Props {
//     // children: JSX.Element | JSX.Element[];
//     // closeModal: Function;
//     // isOpen: boolean;
//     // title: string;
// };

// export const ModalFull: FC<Props> = () => {

//     const { isOpen, closeModal, modalFullProps } = useModalFull();

//     const [didMount, setDidMount] = useState(false);
//     // console.log({ isOpen, modalFullProps, didMount })
//     console.log("renderer")
//     useEffect(() => setDidMount(true), []);

//     useEffect(() => {
//         document.addEventListener("keyup", (e: KeyboardEvent) => {
//             if (e.key === "Escape") closeModal();
//         });
//     }, []);

//     const handleClose = (e: MouseEvent) => {
//         // @ts-ignore
//         if (e.target.matches(".modal-full .modal-close *")) closeModal();
//     };

//     return !didMount
//         ? <></>
//         : createPortal(
//             <section class={`modal-full ${isOpen ? "opened" : ""}`} onClick={handleClose}>
//                 <div className="modal-full-title-container" style={{ justifyContent: modalFullProps.title ? 'flex-between' : 'flex-end' }}>
//                     <span>{modalFullProps.title}</span>
//                     <div className="modal-close" onClick={closeModal}>
//                         <svg class="svg-icon icon-close" viewBox="0 0 20 20">
//                             <path fill="none" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
//                         </svg>
//                     </div>
//                 </div>
//                 {
//                     // isOpen && children
//                     <></>
//                 }
//             </section>
//             , document.getElementById("window-root")!
//         );
// };

















/*
import { createPortal, useState, type FC, type JSX, useEffect, } from "preact/compat";

import "./Modal.css";

interface Props {
    children: JSX.Element | JSX.Element[];
    closeModal: Function;
    isOpen: boolean;
    title: string;
};

export const ModalFull: FC<Props> = ({ children, isOpen, closeModal, title }) => {

    const [didMount, setDidMount] = useState(false);

    useEffect(() => setDidMount(true), []);

    useEffect(() => {
        document.addEventListener("keyup", (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        });
    }, []);

    const handleClose = (e: MouseEvent) => {
        // @ts-ignore
        if (e.target.matches(".modal-full .modal-close *")) closeModal();
    };

    return !didMount
        ? <></>
        : createPortal(
            <section class={`modal-full ${isOpen ? "opened" : ""}`} onClick={handleClose}>
                <div className="modal-full-title-container" style={{ justifyContent: title ? 'flex-between' : 'flex-end' }}>
                    <span>{title}</span>
                    <div className="modal-close" onClick={handleClose}>
                        <svg class="svg-icon icon-close" viewBox="0 0 20 20">
                            <path fill="none" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
                        </svg>
                    </div>
                </div>
                {
                    isOpen && children
                }
            </section>
            , document.getElementById("window-root")!
        );
};
*/