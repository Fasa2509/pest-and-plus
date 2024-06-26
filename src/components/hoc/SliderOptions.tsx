import { type FC, type JSX, useRef } from "preact/compat";

import "./SliderOptions.css";

interface Props {
    children: JSX.Element[];
}

export const SliderOptions: FC<Props> = ({ children }) => {

    const optionsRef = useRef<HTMLDivElement>(null);

    const updateChunk = (direction: -1 | 1) => {
        let scrolled = optionsRef.current!.scrollLeft;
        let boxWidth = Number(window.getComputedStyle(optionsRef.current!).width.slice(0, -2));

        if (((boxWidth * 2) - (scrolled + boxWidth * direction)) < 10) {
            optionsRef.current!.scroll({
                left: scrolled + boxWidth * direction + 10,
                behavior: "smooth",
            });

            return;
        }

        optionsRef.current!.scroll({
            left: scrolled + boxWidth * direction,
            behavior: "smooth",
        });
    };

    return (
        <div className="slider-info-container">
            <div className="slider-info-button-container" onClick={() => updateChunk(-1)}>
                <button className="open-icon-container">
                    <svg class="svg-icon open-icon-pet" viewBox="0 0 20 20">
                        <path
                            fill="none"
                            d="M8.388,10.049l4.76-4.873c0.303-0.31,0.297-0.804-0.012-1.105c-0.309-0.304-0.803-0.293-1.105,0.012L6.726,9.516c-0.303,0.31-0.296,0.805,0.012,1.105l5.433,5.307c0.152,0.148,0.35,0.223,0.547,0.223c0.203,0,0.406-0.08,0.559-0.236c0.303-0.309,0.295-0.803-0.012-1.104L8.388,10.049z"
                        ></path>
                    </svg>
                </button>
            </div>

            <div ref={optionsRef} className="all-options">
                {children}
            </div>

            <div className="slider-info-button-container" onClick={() => updateChunk(1)}>
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
