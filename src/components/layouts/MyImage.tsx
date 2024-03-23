import { useState, type CSSProperties, type FC, type TargetedEvent } from "preact/compat";

import style from "./MyImage.module.css";

type sizes = "xm" | "sm" | "lg" | "xl";

interface Props {
    src: string;
    alt: string;
    center?: boolean;
    classes?: string;
    styles?: CSSProperties;
    size?: sizes;
}

const SIZES_DICT: Record<sizes, string> = {
    xm: style.container_xm,
    sm: style.container_sm,
    lg: style.container_lg,
    xl: style.container_xl,
}

export const MyImage: FC<Props> = ({ src, alt, center = false, styles = {}, size = "xl", classes = "", children }) => {

    const [loaded, setLoaded] = useState(false);

    const handleError = (e: TargetedEvent<HTMLImageElement, Event>) => {
        // @ts-ignore
        e.target.setAttribute("src", "/default-image.png")
    };

    return (
        <div className={`${style.img_container} ${style.asp_rat_1_1} ${SIZES_DICT[size]} ${center ? "m-center-element" : ""}`}>
            <img src={src} alt={alt} style={{ ...styles }} class={`${loaded ? style.show_img : ""} ${classes}`} onLoad={() => setLoaded(true)} onError={handleError} />
            {children}
        </div>
    );
};
