import { useStore } from "@nanostores/preact";
import { useEffect, useRef, useState } from "preact/hooks";

import { $menu, $toggleMenu } from "@/stores/Menu";
import "./Menu.css";
import { useNotifications } from "@/hooks/useNotifications";
import { PromiseConfirmHelper } from "@/stores/Notifications";
import { $userInfo } from "@/stores/UserInfo";

export const Menu = () => {

    const menuState = useStore($menu);
    const userInfo = useStore($userInfo);

    const [disableLinks, setDisableLinks] = useState(false);

    const { createNotification } = useNotifications();

    const firstRef = useRef<HTMLButtonElement>(null)!;
    const secondRef = useRef<HTMLAnchorElement>(null)!;
    const thirdRef = useRef<HTMLAnchorElement>(null)!;
    const fourthRef = useRef<HTMLAnchorElement>(null)!;
    const fifthRef = useRef<HTMLAnchorElement>(null)!;
    const svgContainerRef = useRef<HTMLDivElement>(null)!;


    useEffect(() => {
        const $buttons = [
            firstRef.current!,
            secondRef.current!,
            thirdRef.current!,
            fourthRef.current!,
            fifthRef.current!,
        ];

        $buttons.forEach(
            (el, i) =>
                i !== 0 &&
                el.addEventListener("click", (e) => {
                    $toggleMenu(false);
                }),
        );

        if (
            window.navigator.userAgent.match(/Android/i) ||
            window.navigator.userAgent.match(/webOS/i) ||
            window.navigator.userAgent.match(/iPhone/i) ||
            window.navigator.userAgent.match(/iPad/i) ||
            window.navigator.userAgent.match(/iPod/i) ||
            window.navigator.userAgent.match(/BlackBerry/i) ||
            window.navigator.userAgent.match(/Windows Phone/i)
        ) {
            setDisableLinks(true);
        };
    }, []);

    const handleCloseSession = async (e: MouseEvent) => {
        e.preventDefault();

        if (userInfo.id === undefined) {
            createNotification({ type: "info", content: "No has iniciado sesión" });
            return;
        }

        const notId = createNotification({
            type: "info",
            content: "¿Quieres cerrar sesión?",
            confirmation: true,
        });

        const accepted = await PromiseConfirmHelper(notId);

        if (!accepted) return;

        // TODO: corregir direccion
        window.location.replace("http://localhost:4321/logout");
    };

    return (
        <section class="menu-container">
            <nav class="menu">
                <button ref={firstRef} class={`first ${menuState ? "active" : "hide-btn"}`} onClick={() => $toggleMenu(!menuState)}>
                    <div ref={svgContainerRef} class={`svg-container ${menuState ? "rotate" : ""}`}>
                        <svg class="svg-icon open-icon" viewBox="0 0 20 20">
                            <path
                                fill="none"
                                d="M8.388,10.049l4.76-4.873c0.303-0.31,0.297-0.804-0.012-1.105c-0.309-0.304-0.803-0.293-1.105,0.012L6.726,9.516c-0.303,0.31-0.296,0.805,0.012,1.105l5.433,5.307c0.152,0.148,0.35,0.223,0.547,0.223c0.203,0,0.406-0.08,0.559-0.236c0.303-0.309,0.295-0.803-0.012-1.104L8.388,10.049z"
                            ></path>
                        </svg>
                    </div>
                    <span>{!menuState ? "Abrir Menú" : "Cerrar Menú"}</span>
                </button>
                <a ref={secondRef} href="/feed" class={`${menuState ? "active" : disableLinks ? "disabled" : ""}`}>
                    <div class="svg-container">
                        <svg class="svg-icon feed-icon" viewBox="0 0 20 20">
                            <path
                                d="M17.896,12.706v-0.005v-0.003L15.855,2.507c-0.046-0.24-0.255-0.413-0.5-0.413H4.899c-0.24,0-0.447,0.166-0.498,0.4L2.106,12.696c-0.008,0.035-0.013,0.071-0.013,0.107v4.593c0,0.28,0.229,0.51,0.51,0.51h14.792c0.28,0,0.51-0.229,0.51-0.51v-4.593C17.906,12.77,17.904,12.737,17.896,12.706 M5.31,3.114h9.625l1.842,9.179h-4.481c-0.28,0-0.51,0.229-0.51,0.511c0,0.703-1.081,1.546-1.785,1.546c-0.704,0-1.785-0.843-1.785-1.546c0-0.281-0.229-0.511-0.51-0.511H3.239L5.31,3.114zM16.886,16.886H3.114v-3.572H7.25c0.235,1.021,1.658,2.032,2.75,2.032c1.092,0,2.515-1.012,2.749-2.032h4.137V16.886z"
                            ></path>
                        </svg>
                    </div>
                    <span>Feed</span>
                </a>
                <a ref={thirdRef} href={"/profile"} class={`${menuState ? "active" : disableLinks ? "disabled" : ""}`}>
                    <div class="svg-container">
                        <svg class="svg-icon perfil-icon" viewBox="0 0 20 20">
                            <path
                                fill="none"
                                d="M14.023,12.154c1.514-1.192,2.488-3.038,2.488-5.114c0-3.597-2.914-6.512-6.512-6.512
                        c-3.597,0-6.512,2.916-6.512,6.512c0,2.076,0.975,3.922,2.489,5.114c-2.714,1.385-4.625,4.117-4.836,7.318h1.186
                        c0.229-2.998,2.177-5.512,4.86-6.566c0.853,0.41,1.804,0.646,2.813,0.646c1.01,0,1.961-0.236,2.812-0.646
                        c2.684,1.055,4.633,3.568,4.859,6.566h1.188C18.648,16.271,16.736,13.539,14.023,12.154z M10,12.367
                        c-2.943,0-5.328-2.385-5.328-5.327c0-2.943,2.385-5.328,5.328-5.328c2.943,0,5.328,2.385,5.328,5.328
                        C15.328,9.982,12.943,12.367,10,12.367z"
                            ></path>
                        </svg>
                    </div>
                    <span>{(userInfo.id !== undefined) ? "Mi Perfil" : "Iniciar sesión"}</span>
                </a>
                <a ref={fourthRef} href="/petsandplus" class={`${menuState ? "active" : disableLinks ? "disabled" : ""}`}>
                    <div class="svg-container">
                        <svg class="svg-icon self-icon" viewBox="0 0 20 20">
                            <path
                                fill="none"
                                d="M10,4.75c-5.316,0-9.625,4.505-9.625,10.062c0,0.241,0.196,0.438,0.438,0.438h7.875c0.242,0,0.438-0.196,0.438-0.438c0-0.725,0.392-1.312,0.875-1.312s0.875,0.588,0.875,1.312c0,0.241,0.195,0.438,0.438,0.438h7.875c0.242,0,0.438-0.196,0.438-0.438C19.625,9.255,15.316,4.75,10,4.75 M11.715,14.375c-0.162-0.998-0.868-1.75-1.715-1.75s-1.553,0.752-1.715,1.75H6.523c0.193-1.968,1.676-3.5,3.477-3.5c1.801,0,3.284,1.532,3.477,3.5H11.715z M14.354,14.375C14.153,11.923,12.282,10,10,10s-4.154,1.923-4.355,4.375h-1.75C4.106,10.957,6.755,8.25,10,8.25s5.894,2.707,6.104,6.125H14.354zM16.979,14.375c-0.214-3.902-3.252-7-6.979-7s-6.765,3.098-6.979,7h-1.75C1.49,9.505,5.308,5.625,10,5.625c4.691,0,8.51,3.88,8.729,8.75H16.979z"
                            ></path>
                        </svg>
                    </div>
                    <span>PetsAnd+</span>
                </a>
                <a ref={fifthRef} href="/logout" class={`${menuState ? "active" : disableLinks ? "disabled" : ""}`} onClick={handleCloseSession}>
                    <div class="svg-container">
                        <svg class="svg-icon conf-icon" viewBox="0 0 20 20">
                            <path
                                d="M10,1.529c-4.679,0-8.471,3.792-8.471,8.471c0,4.68,3.792,8.471,8.471,8.471c4.68,0,8.471-3.791,8.471-8.471C18.471,5.321,14.68,1.529,10,1.529 M10,17.579c-4.18,0-7.579-3.399-7.579-7.579S5.82,2.421,10,2.421S17.579,5.82,17.579,10S14.18,17.579,10,17.579 M14.348,10c0,0.245-0.201,0.446-0.446,0.446h-5c-0.246,0-0.446-0.201-0.446-0.446s0.2-0.446,0.446-0.446h5C14.146,9.554,14.348,9.755,14.348,10 M14.348,12.675c0,0.245-0.201,0.446-0.446,0.446h-5c-0.246,0-0.446-0.201-0.446-0.446s0.2-0.445,0.446-0.445h5C14.146,12.229,14.348,12.43,14.348,12.675 M7.394,10c0,0.245-0.2,0.446-0.446,0.446H6.099c-0.245,0-0.446-0.201-0.446-0.446s0.201-0.446,0.446-0.446h0.849C7.194,9.554,7.394,9.755,7.394,10 M7.394,12.675c0,0.245-0.2,0.446-0.446,0.446H6.099c-0.245,0-0.446-0.201-0.446-0.446s0.201-0.445,0.446-0.445h0.849C7.194,12.229,7.394,12.43,7.394,12.675 M14.348,7.325c0,0.246-0.201,0.446-0.446,0.446h-5c-0.246,0-0.446-0.2-0.446-0.446c0-0.245,0.2-0.446,0.446-0.446h5C14.146,6.879,14.348,7.08,14.348,7.325 M7.394,7.325c0,0.246-0.2,0.446-0.446,0.446H6.099c-0.245,0-0.446-0.2-0.446-0.446c0-0.245,0.201-0.446,0.446-0.446h0.849C7.194,6.879,7.394,7.08,7.394,7.325"
                            ></path>
                        </svg>
                    </div>
                    <span>Cerrar sesión</span>
                </a>
            </nav>
        </section>
    );
};
{/* <script>

    const $buttons = document.querySelectorAll(".menu > *");
    const $firstButton = document.querySelector(".first > span")!;
    const $svgWing = document.querySelector(".first .svg-container")!;

    $buttons[0]!.addEventListener("click", (e) => {
        if ($menu.get()) {
            $toggleMenu(false);
            $buttons.forEach((el, i) => {
                if (i === 0) e.preventDefault();
                if (
                    i === 0 &&
                    (navigator.userAgent.match(/Android/i) ||
                        navigator.userAgent.match(/webOS/i) ||
                        navigator.userAgent.match(/iPhone/i) ||
                        navigator.userAgent.match(/iPad/i) ||
                        navigator.userAgent.match(/iPod/i) ||
                        navigator.userAgent.match(/BlackBerry/i) ||
                        navigator.userAgent.match(/Windows Phone/i))
                )
                    el.classList.add("inactive");
                el.classList.remove("active");
            });
            $svgWing.classList.remove("rotate");
            $firstButton.textContent = "Abrir Menú";
        } else {
            $toggleMenu(true);
            $buttons.forEach((el, i) => {
                if (i === 0) el.classList.remove("inactive");
                el.classList.add("active");
            });
            $svgWing.classList.add("rotate");
            $firstButton.textContent = "Cerrar Menú";
        }
    });

    $buttons.forEach(
        (el, i) =>
            i !== 0 &&
            el.addEventListener("click", (e) => {
                $toggleMenu(false);
            }),
    );

    if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
    ) {
        $buttons.forEach((el, i) => i !== 0 && el.classList.add("disabled"));
    }
</script> */}