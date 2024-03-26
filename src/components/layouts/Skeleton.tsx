import type { FC } from "preact/compat";

interface Props {
    classes?: string;
    widthClamp?: number;
    heightClamp?: string;
    borderRadius?: string;
    long?: boolean;
}

export const Skeleton: FC<Props> = ({ classes = "", widthClamp = "", heightClamp = "", borderRadius, long = false }) => {

    return (
        <div class={`skeleton ${classes}`} style={{ width: widthClamp, height: heightClamp, borderRadius: borderRadius || "" }}>
            <div className={`flash ${long ? "long" : ""}`}></div>
        </div>
    )
};
