import type { IUserInfo } from "@/types/Pet";
import type { IPost } from "@/types/Post";
import type { IPetInfo, IUser } from "@/types/User";
import { useState } from "preact/hooks";

export enum TModalFullType {
    "" = "",
    "UploadPetForm" = "UploadPetForm",
    "UploadPostForm" = "UploadPostForm",
    "ShowPost" = "ShowPost",
    "PetInfo" = "PetInfo",
    "UserInfo" = "UserInfo",
};

// export type TModalFullType = typeof ModalFullType[keyof typeof ModalFullType];

type ModalFullProps =
    | {
        type: "";
        payload: any;
        title: "";
    } | {
        type: TModalFullType.PetInfo;
        payload: IPetInfo;
        title: string;
    } | {
        type: TModalFullType.UserInfo;
        payload: IUserInfo;
        title: string;
    } | {
        type: TModalFullType.ShowPost;
        payload: {
            post: IPost;
            authorInfo?: boolean;
        };
        title: string;
    } | {
        type: TModalFullType.UploadPetForm;
        payload: IUser;
        title: string;
    } | {
        type: TModalFullType.UploadPostForm;
        payload: any;
        title: string;
    }


export const useModalFull = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [modalFullProps, setModalFullProps] = useState<ModalFullProps>({
        type: "",
        payload: undefined,
        title: "",
    });

    const openModal = (data: ModalFullProps) => {
        console.log(data)
        setModalFullProps(data);
        setIsOpen(true);
    };

    const closeModal = () => setIsOpen(false);

    return { modalFullProps, isOpen, openModal, closeModal };
};
