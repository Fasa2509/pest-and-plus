import type { FC } from "preact/compat";
import { useStore } from "@nanostores/preact";

import { $dataLoaded } from "@/stores/DataLoaded";

interface Props {

}

export const AsideData: FC<Props> = () => {

    const cachedInfo = useStore($dataLoaded);

    return (
        <aside>
            <h3>En PetsAnd+ hay...</h3>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐶 {cachedInfo.count.dogCount ?? "..."}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐱 {cachedInfo.count.catCount ?? "..."}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐴 {cachedInfo.count.horseCount ?? "..."}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐰 {cachedInfo.count.rabbitCount ?? "..."}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐵 {cachedInfo.count.monkeyCount ?? "..."}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐢 {cachedInfo.count.turtleCount ?? "..."}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐐 {cachedInfo.count.goatCount ?? "..."}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐦 {cachedInfo.count.birdCount ?? "..."}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐟 {cachedInfo.count.fishCount ?? "..."}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐷 {cachedInfo.count.pigCount ?? "..."}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🦔 {cachedInfo.count.hedgehogCount ?? "..."}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>❔ {cachedInfo.count.otherCount ?? "..."}</p>
        </aside>
    );
};
