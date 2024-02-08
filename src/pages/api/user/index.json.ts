import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

import { DbError, EndpointErrorHandler, ParsingError, ValidationError } from "@errors/index";
import { CustomResponse, type ApiResponse, type ApiResponsePayload, ZApiPagination } from "@customTypes/Api";
import { ZNewUser, type IUser } from "@customTypes/User";
import { DbClient } from "@/database/Db";
import { checkUserValidSession, decodeToken, signToken } from "@/utils/JWT";
import type { IUserInfo } from "@/types/Pet";


export const GET: APIRoute = async ({ url, cookies }) => {
    try {
        // const paginationParams = Object.fromEntries(url.searchParams.entries());

        // if (!Number(paginationParams.max) || Number(paginationParams.max) > new Date().getTime()) throw new ParsingError("Paginación no válida", 400);

        const pagination = ZApiPagination.parse(Object.fromEntries(url.searchParams.entries()));

        const token = cookies.get("auth-token");

        const userId = token ? (await decodeToken(token.value))?.id : 0;

        // const pagination = ZApiPagination.parse(Object.fromEntries(url.searchParams.entries()));

        const users = await DbClient.user.findMany({
            where: {
                id: {
                    not: Number(userId)
                }
            },
            select: {
                id: true,
                name: true,
                image: true,
            },
            skip: pagination.offset,
            take: pagination.limit,
            // include: {
            //     pets: {
            //         select: {
            //             id: true,
            //             name: true,
            //             image: true,
            //             petType: true,
            //             behaviors: true,
            //             createdAt: true,
            //         }
            //     },
            //     following: {
            //         select: {
            //             id: true,
            //             name: true,
            //             image: true,
            //             petType: true,
            //             behaviors: true,
            //             createdAt: true,
            //         }
            //     },
            //     posts: {
            //         select: {
            //             id: true,
            //             description: true,
            //             images: true,
            //             createdAt: true,
            //             petId: true,
            //         }
            //     },
            // },
        });

        return CustomResponse<ApiResponsePayload<{ users: IUserInfo[] }>>({
            error: false,
            message: ["Usuarios obtenidos"],
            payload: {
                users,
            },
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: "Ocurrió un error obteniendo los usuarios" });
    };
};


export const POST: APIRoute = async ({ request }) => {
    try {
        const data = ZNewUser.parse(await request.json());

        const userExists = await DbClient.user.findUnique({
            where: {
                email: data.email,
            },
            select: {
                id: true,
            },
        });

        if (userExists) throw new ValidationError("Ya existe un usuario con ese correo", 400);

        const user = await DbClient.user.create({
            data,
        });

        const token = signToken({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        }, false);

        if (!token) throw new ParsingError("Ocurrió un error generando el token", 500);

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: globalThis.process.env.MAILER__USER,
                pass: globalThis.process.env.MAILER__PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        await transporter.sendMail({
            from: 'PetsAndPlus+',
            to: data.email,
            subject: "PetsAnd+ - Creación de Usuario",
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
            <p>¡Hola ${data.name.split(' ')[0]}! Bienvenido a PetsAnd+. Hemos recibido una solicitud para crear una cuenta.</p>

            <p>Haz click <a href="${globalThis.process.env.DOMAIN_NAME}/login/${token}" target="_blank" rel="noreferrer">aquí</a> en todos los dispositivos donde quieres iniciar sesión para ver tu cuenta desde cualquier parte.</p>
        </section>
    </section>
</body>
            `
        });

        return CustomResponse<ApiResponse>({
            error: false,
            message: ["El usuario fue creado con éxito", "Enviamos un correo eléctronico de inicio de sesión"],
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: "Ocurrió un error creando el usuario" });
    };
};


export const PATCH: APIRoute = async ({ request, cookies }) => {
    try {
        let { petId } = await request.json() as { petId: string | number };

        petId = Number(petId);

        if (!petId || isNaN(petId) || petId < 1) throw new ValidationError("El id de usuario no es válido", 400);

        const userInfo = await checkUserValidSession({ cookies });

        const toFollow = await DbClient.pet.findUnique({
            where: {
                id: petId,
            },
            select: {
                id: true,
                name: true,
            },
        });

        if (!toFollow) throw new DbError("No existe mascota por ese id", 400);

        await DbClient.user.update({
            where: {
                id: userInfo.id,
            },
            data: {
                following: {
                    connect: {
                        id: petId,
                    },
                },
            },
        });

        return CustomResponse<ApiResponse>({
            error: false,
            message: [`¡Ahora sigues a ${toFollow.name}!`],
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: "Ocurrió realizando la acción" });
    };
};
