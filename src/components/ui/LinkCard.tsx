import type { CSSProperties, FC } from "preact/compat";

import "./Cards.css";

interface Props {
    textLink: string;
    href: string;
    imgSrc: string | null;
    extendClass?: string;
    styles?: CSSProperties;
    newPage?: boolean;
};

export const LinkCard: FC<Props> = ({ textLink, href, imgSrc, extendClass, styles, newPage }) => {


    return (
        <div class="link-container">
            <a href={href} class={`link-card ${extendClass || ""}`} style={styles}>
                <div className="img-container card-img">
                    <img src={imgSrc || "/default-image.png"} alt={textLink} />
                </div>
                <span>{(textLink.length < 10) ? textLink : textLink.slice(0, 9) + '...'}</span>
            </a>
        </div>
    );
};
