import { useState, type FC } from "preact/compat";

import type { IPetInfo } from "@/types/User";
import { ModalPetButton } from "../hoc/ModalPetButton";
import { PetInfo } from "./PetInfo";
import "./PetsInfo.css";

interface Props {
    pets: IPetInfo[];
}

export const MyPetsInfo: FC<Props> = ({ pets }) => {

    const [chunk, setChunk] = useState(1);

    const updateChunk = (direction: "left" | "right") => {
        let max = Math.floor(pets.length / 3);

        if (chunk === max && direction === "right") return;
        if ((chunk * 3 + 3) - pets.length === 0 && direction === "right") return;
        if (chunk === 1 && direction === "left") return;

        setChunk(chunk + ((direction === "left") ? -1 : 1));
    };

    return (
        <div className="pets-info-container">
            <div className="slider-info-button-container" onClick={() => updateChunk("left")}>
                <button className="open-icon-container">
                    <svg class="svg-icon open-icon-pet" viewBox="0 0 20 20">
                        <path
                            fill="none"
                            d="M8.388,10.049l4.76-4.873c0.303-0.31,0.297-0.804-0.012-1.105c-0.309-0.304-0.803-0.293-1.105,0.012L6.726,9.516c-0.303,0.31-0.296,0.805,0.012,1.105l5.433,5.307c0.152,0.148,0.35,0.223,0.547,0.223c0.203,0,0.406-0.08,0.559-0.236c0.303-0.309,0.295-0.803-0.012-1.104L8.388,10.049z"
                        ></path>
                    </svg>
                </button>
            </div>

            <div className="all-pets">
                {pets.map((pet) => <div style={{ transform: `translateX(-${chunk * 300}%)` }} class="button-pet-info-container"><ModalPetButton children={<PetInfo pet={pet} />} textButton={pet.name} imgSrc={pet.image} textTitle={pet.name} /></div>)}
            </div>

            <div className="slider-info-button-container" onClick={() => updateChunk("right")}>
                <button className="close-icon-container">
                    <svg class="svg-icon close-icon-pet" viewBox="0 0 20 20">
                        <path
                            fill="none"
                            d="M8.388,10.049l4.76-4.873c0.303-0.31,0.297-0.804-0.012-1.105c-0.309-0.304-0.803-0.293-1.105,0.012L6.726,9.516c-0.303,0.31-0.296,0.805,0.012,1.105l5.433,5.307c0.152,0.148,0.35,0.223,0.547,0.223c0.203,0,0.406-0.08,0.559-0.236c0.303-0.309,0.295-0.803-0.012-1.104L8.388,10.049z"
                        ></path>
                    </svg>
                </button>
            </div>
        </div>
    )
};
