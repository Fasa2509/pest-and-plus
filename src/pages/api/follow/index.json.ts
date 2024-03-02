import { DbClient } from "@/database/Db";
import { DbError, EndpointErrorHandler, ParsingError, ValidationError } from "@/errors";
import { CustomResponse, type ApiResponse } from "@/types/Api";
import { checkUserValidSession } from "@/utils/JWT";
import type { APIRoute } from "astro";


export const PATCH: APIRoute = async ({ cookies, url }) => {
    try {
        let petId = Number(Object.fromEntries(url.searchParams.entries()).petId);

        if (isNaN(petId)) throw new ParsingError("El id de la mascota no es válido", 400);

        const userInfo = await checkUserValidSession({ cookies });

        const user = await DbClient.user.findUnique({
            where: {
                id: userInfo.id,
            },
            include: {
                following: true
            },
        });

        if (!user) throw new ValidationError("No se encontró su usuario", 404);

        // const petExists = await DbClient.pet.findUnique({
        //     where: {
        //         id: petId,
        //     },
        //     select: {
        //         id: true,
        //         name: true,
        //     },
        // });

        // if (!petExists) throw new ValidationError("No se encontró la mascota", 404);

        let isFollowing = user.following.find((pet) => pet.id === petId);

        await DbClient.user.update({
            where: {
                id: userInfo.id,
            },
            data: {
                following: {
                    ...((isFollowing) ? { disconnect: { id: petId } } : { connect: { id: petId } })
                }
            }
        });

        return CustomResponse<ApiResponse>({
            error: false,
            message: [(isFollowing) ? `Dejaste de seguir a ${isFollowing.name}` : `¡Ahora sigues a esta mascota!`],
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: "Ocurrió un error siguiendo la mascota" });
    };
};