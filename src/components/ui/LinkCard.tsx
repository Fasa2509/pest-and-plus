import { useRef, type CSSProperties, type FC } from "preact/compat";

import { MyImage } from "../layouts/MyImage";
import "./Cards.css";

interface Props {
    textLink: string;
    href: string;
    imgSrc: string | null;
    extendClass?: string;
    styles?: CSSProperties;
};

export const LinkCard: FC<Props> = ({ textLink, href, imgSrc, extendClass, styles }) => {

    const linkRef = useRef<HTMLAnchorElement>(null);

    return (
        <div class="link-container button bg-third" onClick={() => linkRef.current!.click()}>
            <a ref={linkRef} href={href} class={`link-card ${extendClass || ""}`} style={styles}>
                <MyImage src={imgSrc || "/default-image.png"} alt={textLink} classes="card-img" />
                <span>{textLink}</span>
            </a>
        </div>
    );
};
