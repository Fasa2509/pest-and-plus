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
        <section class="sub-container thirst-element">
            <aside class="content-container">
                <h3>En PetsAnd+ hay...</h3>
                <p>🐶 {count.dogCount ?? "..."} perro{(count.dogCount !== 1) ? "s" : ""}</p>
                <p>🐱 {count.catCount ?? "..."} gato{(count.catCount !== 1) ? "s" : ""}</p>
                <p>🐴 {count.horseCount ?? "..."} caballo{(count.horseCount !== 1) ? "s" : ""}</p>
                <p>🐰 {count.rabbitCount ?? "..."} conejo{(count.rabbitCount !== 1) ? "s" : ""}</p>
                <p>🐵 {count.monkeyCount ?? "..."} mono{(count.monkeyCount !== 1) ? "s" : ""}</p>
                <p>🐢 {count.turtleCount ?? "..."} tortuga{(count.turtleCount !== 1) ? "s" : ""}</p>
                <p>🐐 {count.goatCount ?? "..."} cabra{(count.goatCount !== 1) ? "s" : ""}</p>
                <p>🐦 {count.birdCount ?? "..."} ave{(count.birdCount !== 1) ? "s" : ""}</p>
                <p>🐟 {count.fishCount ?? "..."} {(count.fishCount === 1) ? "pez" : "peces"}</p>
                <p>🐷 {count.pigCount ?? "..."} cerdo{(count.pigCount !== 1) ? "s" : ""}</p>
                <p>🦔 {count.hedgehogCount ?? "..."} erizo{(count.hedgehogCount !== 1) ? "s" : ""}</p>
                <p>❔ {count.otherCount ?? "..."} otro{(count.otherCount !== 1) ? "s" : ""}</p>
            </aside>
        </section>
    );
};
