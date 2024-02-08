import type { FC, JSX } from "preact/compat";

interface Props {
    children: JSX.Element;
};

export const Main: FC<Props> = ({ children }) => {

    return (
        <div>
            <h1>Hola Mundo</h1>
            {
                children
            }
        </div>
    );
};
