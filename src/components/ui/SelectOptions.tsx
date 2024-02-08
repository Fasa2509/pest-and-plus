import { useState, useEffect, type FC } from "preact/compat";

import "./SelectOptions.css";

interface Opt {
    value: string;
    text?: string;
}

interface Props {
    id: string;
    options: Opt[];
    selected: string | string[];
    setSelected: Function;
    defaultValue?: string;
    defaultText?: string;
    multiple?: boolean;
}

export const SelectOptions: FC<Props> = ({ id, options, selected, setSelected, defaultValue, defaultText, multiple = false }) => {

    const [display, setDisplay] = useState(false);

    useEffect(() => {

        const callback = (e: MouseEvent) => {
            // @ts-ignore
            (!e.target.matches(`#${id}.select-clickable`) && !e.target.matches(`#${id} .select-clickable`))
                ? setDisplay(false)
                : setDisplay(true)

            if (!multiple) document.querySelectorAll(`#${id} .select-clickable.active`).forEach((el) => el.classList.remove("active"));
        };

        document.addEventListener("click", callback);

        return () => document.removeEventListener("click", callback);
    }, []);

    return (
        <div id={id} class={`select-container select-clickable ${(display) ? "z-index" : ""}`}>
            <div className="open-b-icon-container select-clickable">
                <svg class="svg-icon open-select-icon pet-create-icon select-clickable" viewBox="0 0 20 20">
                    <path
                        class="select-clickable"
                        fill="none"
                        d="M8.388,10.049l4.76-4.873c0.303-0.31,0.297-0.804-0.012-1.105c-0.309-0.304-0.803-0.293-1.105,0.012L6.726,9.516c-0.303,0.31-0.296,0.805,0.012,1.105l5.433,5.307c0.152,0.148,0.35,0.223,0.547,0.223c0.203,0,0.406-0.08,0.559-0.236c0.303-0.309,0.295-0.803-0.012-1.104L8.388,10.049z"
                    ></path>
                </svg>
            </div>
            <span class="select-selected select-clickable">{(selected instanceof Array) ? (selected.at(-1) || defaultText || "------") : (selected || defaultText || "------")}</span>
            {
                display && <div className={`options-container fadeIn ${multiple ? "select-clickable" : ""}`}>
                    {
                        options.map((opt) => <span class={((typeof selected === "string" && selected === opt.value) ? "active" : (selected instanceof Array && selected.includes(opt.value)) ? "active" : "") + (multiple ? " select-clickable" : "")} onClick={() => setSelected((prevState: string[]) => {
                            if (selected instanceof Array) {
                                return (prevState.includes(opt.value))
                                    ? prevState.filter((el) => el !== opt.value)
                                    : [...prevState, opt.value]
                            } else {
                                return opt.value
                            }
                        })
                        }>{opt.text ?? opt.value}</span>)
                    }
                </div>
            }
        </div>
    )
};
