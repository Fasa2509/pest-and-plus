import { useEffect, type FC } from "preact/compat";
import { useStore } from "@nanostores/preact";

import { $dataLoaded, $updateCounts } from "@/stores/DataLoaded";
import { $updateTasks } from "@/stores/Loading";
import { getData } from "@/database/DbInfo";
import { useNotifications } from "@/hooks/useNotifications";

interface Props {

}

export const AsideData: FC<Props> = () => {

    const count = useStore($dataLoaded).count;

    const { createNotification } = useNotifications();

    useEffect(() => {
        (async () => {
            if (Object.keys(count).length > 1) return;

            $updateTasks("Buscando data...")
            const res = await getData();
            $updateTasks("Buscando data...")

            !res.error && $updateCounts(res.payload.count);
            res.error && createNotification({ type: "error", content: res.message[0] });
        })();
    }, []);

    return (
        <aside>
            <h3>En PetsAnd+ hay...</h3>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐶 {count.dogCount ?? "..."} perro{(count.dogCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐱 {count.catCount ?? "..."} gato{(count.catCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐴 {count.horseCount ?? "..."} caballo{(count.horseCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐰 {count.rabbitCount ?? "..."} conejo{(count.rabbitCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐵 {count.monkeyCount ?? "..."} mono{(count.monkeyCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐢 {count.turtleCount ?? "..."} tortuga{(count.turtleCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐐 {count.goatCount ?? "..."} cabra{(count.goatCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐦 {count.birdCount ?? "..."} ave{(count.birdCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐟 {count.fishCount ?? "..."} {(count.fishCount === 1) ? "pez" : "peces"}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🐷 {count.pigCount ?? "..."} cerdo{(count.pigCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>🦔 {count.hedgehogCount ?? "..."} erizo{(count.hedgehogCount !== 1) ? "s" : ""}</p>
            <p style={{ padding: "0 1rem 4px", fontSize: "1.5rem" }}>❔ {count.otherCount ?? "..."} otro{(count.otherCount !== 1) ? "s" : ""}</p>
        </aside>
    );
};
