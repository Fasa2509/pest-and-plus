import { DbClient } from "@/database/Db";
import { DbError, EndpointErrorHandler, ValidationError } from "@/errors";
import { CustomResponse, type ApiResponse, type ApiResponsePayload } from "@/types/Api";
import { ZResponseLinkRequest } from "@/types/LinkRequest";
import { checkUserValidSession } from "@/utils/JWT";
import type { APIRoute } from "astro";


export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        let body = await request.json() as { usersIds: number[], petId: number };
        let usersIds = body.usersIds.map((n) => Number(n));
        let { petId } = body;

        if (isNaN(Number(petId)) || Number(petId) < 1) throw new ValidationError("El id de la mascota no es válido", 400);

        if (usersIds.some((id) => isNaN(id) || id < 1 || !Number.isInteger(id))) throw new ValidationError("Hay ids no válidos", 400);

        const userInfo = await checkUserValidSession({ cookies });

        if (usersIds.includes(userInfo.id)) throw new ValidationError("No puedes enlazar tu mascota a ti mism@", 400);

        // TODO: chequear si el usuario ya sigue a esa mascota

        const petInfo = await DbClient.pet.findUnique({
            where: {
                id: petId,
            },
            select: {
                owners: {
                    select: {
                        id: true,
                    },
                },
                creatorId: true,
            },
        });

        if (!petInfo) throw new DbError("No se encontró la mascota", 400);

        // if (!petInfo.owners.some(({ id }) => id === userInfo.id)) throw new ValidationError("No eres dueño de esta mascota", 400);
        if (petInfo.creatorId !== userInfo.id) throw new ValidationError("Solo el creador de una mascota pueden solicitar enlaces", 400);

        for (let { id } of petInfo.owners) {
            if (usersIds.includes(id)) usersIds = usersIds.filter((n) => n !== id);
        }

        // const usersToConnect = await DbClient.user.findMany({
        //     where: {
        //         id: {
        //             in: usersIds,
        //         },
        //     },
        //     select: {
        //         id: true,
        //         pets: {
        //             select: {
        //                 id: true,
        //             },
        //         },
        //     },
        // });

        await DbClient.linkRequest.createMany({
            data: usersIds.map((userId) => ({ petId, userId })),
        });

        // await DbClient.pet.update({
        //     where: {
        //         id: petId,
        //     },
        //     data: {
        //         owners: {
        //             connect: usersIds.map((userId) => ({ id: userId })),
        //         },
        //     },
        // });

        return CustomResponse<ApiResponse>({
            error: false,
            message: ["Las solicitudes fueron enviadas"],
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: "Ocurrió un error enlazando la mascota" });
    };
};

export const PATCH: APIRoute = async ({ request, cookies }) => {
    try {
        const body = ZResponseLinkRequest.parse(await request.json());

        const userInfo = await checkUserValidSession({ cookies });

        const userExists = await DbClient.user.findUnique({
            where: {
                id: userInfo.id,
            },
            select: {
                id: true,
            },
        });

        // TODO: chequear si el usuario ya sigue a esa mascota

        if (!userExists) throw new ValidationError("No se encontró el usuario", 404);

        const linkRequest = await DbClient.linkRequest.findUnique({
            where: {
                id: body.id,
            },
        });

        console.log(linkRequest)

        if (!linkRequest) throw new ValidationError("No se encontró la solicitud de enlace", 404);

        if (body.response === "accept") {
            await DbClient.pet.update({
                where: {
                    id: linkRequest.petId
                },
                data: {
                    owners: {
                        connect: [{ id: linkRequest.userId }],
                    },
                },
            });
        }

        let res = await DbClient.linkRequest.delete({
            where: {
                id: body.id
            },
        });

        console.log(res)

        return CustomResponse<ApiResponse>({
            error: false,
            message: [`La solicitud fue ${(body.response === "accept" ? "aceptada" : "rechazada")}`],
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: "Ocurrió un error aceptando la solicitud de enlace" });
    }
};
