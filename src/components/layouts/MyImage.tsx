import { useState, type CSSProperties, type FC, type TargetedEvent } from "preact/compat";

import style from "./MyImage.module.css";

type sizes = "xm" | "sm" | "md" | "lg" | "xl";

interface Props {
    src: string;
    alt: string;
    center?: boolean;
    classes?: string;
    styles?: CSSProperties;
    size?: sizes;
    noBorder?: boolean;
};

const SIZES_DICT: Record<sizes, string> = {
    xm: style.container_xm, // 150px
    sm: style.container_sm, // 180px
    md: style.container_md, // 320px
    lg: style.container_lg, // 400px
    xl: style.container_xl, // 450px
};

export const MyImage: FC<Props> = ({ src, alt, center = false, styles = {}, size = "xl", classes = "", noBorder = false, children }) => {

    const [loaded, setLoaded] = useState(false);

    const handleError = (e: TargetedEvent<HTMLImageElement, Event>) => {
        // @ts-ignore
        e.target.setAttribute("src", "/default-image.png")
    };

    return (
        <div className={`${style.img_container} ${style.asp_rat_1_1} ${SIZES_DICT[size]} ${noBorder ? style.no_border : ""} ${center ? "m-center-element" : ""} ${classes}`}>
            {loaded || <span className={style.flash}></span>}
            <img src={src} alt={alt} style={styles} class={`${loaded ? style.show_img : ""}`} onLoad={() => setLoaded(true)} onError={handleError} />
            {children}
        </div>
    );
};
