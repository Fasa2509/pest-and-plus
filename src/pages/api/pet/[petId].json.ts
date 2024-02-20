import type { APIRoute } from "astro";

import { DbClient } from "@/database/Db";
import { CustomError, DbError, ParsingError, EndpointErrorHandler, ValidationError } from "@errors/index";
import { CustomResponse, type ApiResponsePayload, type ApiResponse } from "@customTypes/Api";
import type { IPet } from "@customTypes/Pet";
import { checkUserValidCookies } from "@/utils/JWT";


export const GET: APIRoute = async ({ params }) => {
    try {
        let petId = Number(params.petId);

        if (!petId || isNaN(Number(petId)) || Number(petId) < 1) throw new ValidationError("El id no es válido", 400);

        const pet = await DbClient.pet.findUnique({
            where: {
                id: petId,
            },
            include: {
                owners: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                followers: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                posts: {
                    select: {
                        id: true,
                        description: true,
                        createdAt: true,
                        images: true,
                        authorId: true,
                    }
                }
            },
        });

        if (!pet) throw new CustomError("No se encontró mascota por ese id", 404);

        return CustomResponse<ApiResponsePayload<{ pet: IPet }>>({
            error: false,
            message: ["Mascota obtenida"],
            payload: {
                pet,
            },
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: 'Ocurrió un error buscando las mascotas' });
    };
};


export const DELETE: APIRoute = async ({ params }) => {
    try {
        let petId = Number(params.petId);

        if (isNaN(petId)) throw new ParsingError("El id de la mascota no es válido", 400);

        const pet = await DbClient.pet.findUnique({
            where: {
                id: petId,
            },
            select: {
                id: true,
            },
        });

        if (!pet) throw new DbError("No se encontró mascota por ese id", 404);

        await DbClient.pet.delete({
            where: {
                id: petId,
            },
        });

        return CustomResponse<ApiResponse>({
            error: false,
            message: ["La mascota fue eliminada"],
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: "Ocurrió un error eliminando la mascota" });
    };
};
