import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

import { signToken } from "@/utils/JWT";
import { AuthError, EndpointErrorHandler, ParsingError, ValidationError } from "@/errors";
import { CustomResponse, type ApiResponsePayload, type ApiResponse } from "@/types/Api";
import { cookiesLifeTime, type IUser } from "@/types/User";
import { isValidEmail } from "@/utils/validations";
import { DbClient } from "@/database/Db";


// ESTE METODO NO HACE NADA
// export const POST: APIRoute = async ({ cookies, request }) => {
//     try {
//         let { email } = await request.json() as { email: string };

//         const user = await DbClient.user.findUnique({
//             where: {
//                 email,
//             },
//             include: {
//                 pets: {
//                     select: {
//                         id: true,
//                         name: true,
//                         image: true,
//                         petType: true,
//                         behaviors: true,
//                     }
//                 },
//                 posts: {
//                     select: {
//                         id: true,
//                         description: true,
//                         images: true,
//                         createdAt: true,
//                         petId: true,
//                     }
//                 },
//                 following: true,
//             },
//         });

//         if (!user) throw new AuthError("No se encontró usuario con ese correo", 403);

//         const token = signToken({
//             id: user.id,
//             email: user.email,
//             name: user.name,
//             role: user.role,
//         }, true);

//         if (!token) throw new AuthError("Ocurrió firmando el token", 500);

//         cookies.set('auth-token', token, {
//             httpOnly: true,
//             maxAge: cookiesLifeTime,
//             path: "/", // esto no estaba antes!!!
//         });

//         cookies.set('user-id', "user.id", {
//             maxAge: cookiesLifeTime,
//             path: "/",
//         });

//         return CustomResponse<ApiResponsePayload<{ user: IUser }>>({
//             error: false,
//             message: ['Bienvenid@'],
//             payload: {
//                 user,
//             },
//         });
//     } catch (error: unknown) {
//         return EndpointErrorHandler({ error, defaultErrorMessage: 'Ocurrió un error iniciando sesión' });
//     };
// };


const USERS_LOGGED: Record<string, number> = {};


export const PATCH: APIRoute = async ({ request, cookies }) => {
    try {
        let { email } = await request.json() as { email: string };

        if (!isValidEmail(email)) throw new ValidationError("El correo no es válido", 400);

        email = email.trim().toLocaleLowerCase();

        if (USERS_LOGGED[email] && USERS_LOGGED[email] > new Date().getTime() - 3_600_000) {
            return CustomResponse<ApiResponse>({
                error: false,
                message: ["Podrás solicitar otro en una hora", "Ya te enviamos un correo de validación recientemente"],
            });
        };

        const user = await DbClient.user.findUnique({
            where: {
                email,
            },
        });

        if (!user || !user.isAble) {
            cookies.delete("auth-token");
            throw new ValidationError("No existe un usuario con ese correo", 400);
        }

        const token = signToken({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        }, false);

        if (!token) throw new ParsingError("Ocurrió un error generando el token", 500);

        if (process.env.NODE_ENV === "development") {
            console.log({ token })
        } else {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: process.env.MAILER__USER,
                    pass: process.env.MAILER__PASS,
                },
                tls: {
                    rejectUnauthorized: true,
                },
            });

            await transporter.sendMail({
                from: 'PetsAndPlus+',
                to: email,
                subject: "PetsAnd+ - Inicio de Sesión",
                text: `¡Hola de nuevo, ${user.name.split(' ')[0]}!. Hemos recibido una solicitud para iniciar sesión en PetsAndPlus.

                Haz click en el siguiente enlace en todos los dispositivos donde quieres iniciar sesión para ver tu cuenta desde cualquier parte.

                ${globalThis.process.env.DOMAIN_NAME}/login/${token}`
            });

            /*await transporter.sendMail({
                from: 'PetsAndPlus+',
                to: email,
                subject: "PetsAnd+ - Inicio de Sesión",
                html: `
        <head>
            <style>
                .container {
                    font-family: sans-serif;
                    margin: 0;
                    padding: 0;
                    font-size: 15px;
                }
        
                .container * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    font-size: 1em;
                }
        
                .header {
                    background-color: #00286e;
                    padding: 0 1em;
                    position: relative;
                    margin-bottom: 1em;
                }
        
                .header p {
                    display: inline-block;
                    color: #fafafa;
                    font-size: 2em;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    position: absolute;
                    margin: auto;
                    height: 1em;
                    margin-left: calc(min(100px, 25%) + 1em);
                }
        
                .img__container {
                    aspect-ratio: 1;
                    width: min(100px, 25%);
                    display: inline-block;
                }
        
                img {
                    max-width: 100%;
                    transform: scale(1.5);
                }
        
                @media screen and (min-width: 740px) {
                    .container {
                        font-size: 18px;
                    }
                }
        
                .subcontainer {
                    width: 90%;
                    max-width: 600px;
                    margin: 0 auto;
                }
        
                .subcontainer>p {
                    margin-bottom: 1.5em;
                }
            </style>
        </head>
        
        <body>
            <section class="container">
                <header class="header">
                    <div class="img__container">
                        <img src="https://nezt.dev/nezt_isotipo_negativo.png" alt="Nezt Logo">
                    </div>
                    <p>Nezt Agency</p>
                </header>
        
                <section class="subcontainer">
                    <p>¡Hola de nuevo, ${user.name.split(' ')[0]}!. Hemos recibido una solicitud para iniciar sesión.</p>
        
                    <p>Haz click <a href="${globalThis.process.env.DOMAIN_NAME}/login/${token}" target="_blank" rel="noreferrer">aquí</a> en todos los dispositivos donde quieres iniciar sesión para ver tu cuenta desde cualquier parte.</p>
                </section>
            </section>
        </body>
                    `
            });*/
        };

        USERS_LOGGED[email] = new Date().getTime();

        return CustomResponse<ApiResponsePayload<{ production: boolean }>>({
            error: false,
            message: ["Hemos enviado un correo eléctronico de inicio de sesión"],
            payload: {
                production: process.env.NODE_ENV === "production",
            },
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: 'Ocurrió un error iniciando sesión' });
    };
};
