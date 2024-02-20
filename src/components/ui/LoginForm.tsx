import { useState, useRef, type FC } from "preact/compat";
import { useStore } from "@nanostores/preact";

import { $tasks, $updateTasks } from "@/stores/Loading";
import { useNotifications } from "@/hooks/useNotifications";
import { requestLogin } from "@/database/DbLogin";
import "./LoginForm.css";

export const LoginForm: FC = () => {

    const tasks = useStore($tasks);

    const [isNew, setIsNew] = useState(true);

    const { createNotification } = useNotifications();

    const oldRef = useRef<HTMLInputElement>(null);
    const newRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();

        const method = !isNew ? "PATCH" : "POST";

        const email = (!isNew)
            ?
            oldRef.current!.value.toLocaleLowerCase()
            :
            newRef.current!.value.toLocaleLowerCase();

        const body: { email: string; name?: string; } = { email };

        if (isNew) {
            body.name = nameRef.current!.value;
        };

        $updateTasks('login');
        const res = await requestLogin(method, body);
        $updateTasks('login');

        res.message.map((r) => createNotification({ type: !res.error ? "info" : "error", content: r, duration: 100000 }));
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                {
                    isNew ? (
                        <>
                            <label for="new">¿Eres nuev@? Inscríbete aquí</label>
                            <input required ref={newRef} id="new" type="email" placeholder="Correo" />
                            <label for="name">Pon tu nombre aquí</label>
                            <input ref={nameRef} id="name" type="text" placeholder="Nombre público" />
                        </>
                    ) : (
                        <>
                            <label for="old">Ya tengo una cuenta</label>
                            <input required ref={oldRef} id="old" type="email" placeholder="Usuario ya existente" />
                        </>
                    )
                }
                <input type="submit" disabled={tasks.includes('iniciando')} />
            </form>

            <button disabled={tasks.includes('iniciando')} onClick={() => setIsNew(!isNew)}>{isNew ? 'Ya tengo una cuenta' : 'Crear una cuenta'}</button>
        </>
    )
}
