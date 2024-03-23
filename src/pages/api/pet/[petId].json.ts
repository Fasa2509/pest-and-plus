import type { APIRoute } from "astro";

import { DbClient } from "@/database/Db";
import { CustomError, DbError, ParsingError, EndpointErrorHandler, ValidationError } from "@errors/index";
import { CustomResponse, type ApiResponsePayload, type ApiResponse } from "@customTypes/Api";
import { ZUpdatePet, type IPet } from "@customTypes/Pet";
import { checkUserValidSession } from "@/utils/JWT";


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
                    },
                },
                creator: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
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

export const PUT: APIRoute = async ({ params, cookies, request }) => {
    try {
        let petId = Number(params.petId);

        if (!petId || isNaN(Number(petId)) || Number(petId) < 1) throw new ValidationError("El id no es válido", 400);

        const userInfo = await checkUserValidSession({ cookies });

        const petInfo = ZUpdatePet.parse(await request.json());

        const pet = await DbClient.pet.findUnique({
            where: {
                id: petId,
            },
            select: {
                id: true,
                creatorId: true,
            },
        });

        console.log({ petInfo })

        if (!pet) throw new CustomError("No se encontró mascota por ese id", 404);
        if (pet.creatorId !== userInfo.id) throw new CustomError("No puedes actualizar esta mascota", 400);

        await DbClient.pet.update({
            where: {
                id: petId,
            },
            data: petInfo,
        });

        return CustomResponse<ApiResponse>({
            error: false,
            message: ["La mascota fue actualizada"],
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: 'Ocurrió un error actualizando la mascota' });
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
