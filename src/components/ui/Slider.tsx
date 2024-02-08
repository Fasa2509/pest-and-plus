import { type FC, useEffect, useState, useRef, type JSX } from "preact/compat";
import "./Slider.css";

interface Props {
    children: JSX.Element[];
    identifier: string;
    duration?: number;
    autorun?: boolean;
}

export const Slider: FC<Props> = ({ children, identifier, duration = 7500, autorun = true }) => {

    const [elements, setElements] = useState<HTMLElement[]>([]);
    const [active, setActive] = useState(0);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

    useEffect(() => {
        clearInterval(intervalRef.current ? intervalRef.current : setInterval(() => { }));
        // @ts-ignore
        intervalRef.current = setInterval(() => setActive((prevState) => (prevState === children.length - 1)
            ? 0
            : prevState += 1
        ), duration);

        return () => {
            clearInterval(intervalRef.current ? intervalRef.current : setInterval(() => { }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const els = document.querySelectorAll(`#${identifier} > div`);
        // @ts-ignore
        setElements(Array.from(els));
        els[0] && els[0].classList.add("active");

        if (!autorun) setActive((els.length - 1 >= 0) ? (els.length - 1) : 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [children])

    useEffect(() =>
        elements.forEach((el, index) =>
            (index === active)
                ? el.classList.add("active")
                : el.classList.remove("active")
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [active]);

    const passElement = (pass: 1 | -1) => {
        clearInterval(intervalRef.current!);
        setButtonsDisabled(true);
        setTimeout(() => setButtonsDisabled(false), 500);
        setActive((prevState) => {
            if (prevState === children.length - 1 && pass === 1) return 0;
            if (prevState === 0 && pass === -1) return children.length - 1;

            return prevState += pass;
        });
        // @ts-ignore
        if (intervalRef.current && autorun) intervalRef.current = setInterval(() => setActive((prevState) => (prevState === children.length - 1)
            ? 0
            : prevState += 1
        ), duration);
    }

    return (
        <section id={identifier} className="slider-container">
            {children}
            <section className="buttons__container">
                <button className="pass__button left" disabled={buttonsDisabled} onClick={() => passElement(-1)}>
                    <svg class="svg-icon slider-icon" viewBox="0 0 20 20">
                        <path
                            fill="none"
                            d="M8.388,10.049l4.76-4.873c0.303-0.31,0.297-0.804-0.012-1.105c-0.309-0.304-0.803-0.293-1.105,0.012L6.726,9.516c-0.303,0.31-0.296,0.805,0.012,1.105l5.433,5.307c0.152,0.148,0.35,0.223,0.547,0.223c0.203,0,0.406-0.08,0.559-0.236c0.303-0.309,0.295-0.803-0.012-1.104L8.388,10.049z"
                        ></path>
                    </svg>
                </button>
                <button className="pass__button right" disabled={buttonsDisabled} onClick={() => passElement(1)}>
                    <svg class="svg-icon slider-icon slider-icon-right" viewBox="0 0 20 20">
                        <path
                            fill="none"
                            d="M8.388,10.049l4.76-4.873c0.303-0.31,0.297-0.804-0.012-1.105c-0.309-0.304-0.803-0.293-1.105,0.012L6.726,9.516c-0.303,0.31-0.296,0.805,0.012,1.105l5.433,5.307c0.152,0.148,0.35,0.223,0.547,0.223c0.203,0,0.406-0.08,0.559-0.236c0.303-0.309,0.295-0.803-0.012-1.104L8.388,10.049z"
                        ></path>
                    </svg>
                </button>
            </section>
        </section>
    )
}
