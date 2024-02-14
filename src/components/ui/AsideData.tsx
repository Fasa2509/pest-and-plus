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
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐶 {cachedInfo.count.dogCount ?? "..."} perro{(cachedInfo.count.dogCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐱 {cachedInfo.count.catCount ?? "..."} gato{(cachedInfo.count.catCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐴 {cachedInfo.count.horseCount ?? "..."} caballo{(cachedInfo.count.horseCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐰 {cachedInfo.count.rabbitCount ?? "..."} conejo{(cachedInfo.count.rabbitCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐵 {cachedInfo.count.monkeyCount ?? "..."} mono{(cachedInfo.count.monkeyCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐢 {cachedInfo.count.turtleCount ?? "..."} tortuga{(cachedInfo.count.turtleCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐐 {cachedInfo.count.goatCount ?? "..."} cabra{(cachedInfo.count.goatCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐦 {cachedInfo.count.birdCount ?? "..."} ave{(cachedInfo.count.birdCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐟 {cachedInfo.count.fishCount ?? "..."} {(cachedInfo.count.fishCount === 1) ? "pez" : "peces"}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐷 {cachedInfo.count.pigCount ?? "..."} cerdo{(cachedInfo.count.pigCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🦔 {cachedInfo.count.hedgehogCount ?? "..."} erizo{(cachedInfo.count.hedgehogCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>❔ {cachedInfo.count.otherCount ?? "..."} otro{(cachedInfo.count.otherCount !== 1) ? "s" : ""}</p>
        </aside>
    );
};
