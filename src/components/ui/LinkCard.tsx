import { useRef, type CSSProperties, type FC } from "preact/compat";

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

    const linkRef = useRef<HTMLAnchorElement>(null);

    return (
        <div class="link-container button bg-third" onClick={() => linkRef.current!.click()}>
            <a ref={linkRef} href={href} class={`link-card ${extendClass || ""}`} style={styles}>
                <div className="img-container card-img">
                    <img src={imgSrc || "/default-image.png"} alt={textLink} />
                </div>
                {/* <span>{(textLink.length < 8) ? textLink : textLink.slice(0, 7) + '...'}</span> */}
                <span>{textLink}</span>
            </a>
        </div>
    );
};
