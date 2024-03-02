import type { APIRoute } from "astro";

import { DbClient } from "@/database/Db";
import { EndpointErrorHandler, ValidationError } from "@errors/index";
import { CustomResponse, type ApiResponsePayload, ZApiPagination, type ApiResponse } from "@customTypes/Api";
import { type IPet, ZNewPet } from "@customTypes/Pet";
import { checkUserValidSession } from "@/utils/JWT";
import type { IPetInfo } from "@/types/User";


export const GET: APIRoute = async ({ url }) => {
    try {
        const pagination = ZApiPagination.parse(Object.fromEntries(url.searchParams.entries()));

        const pets = await DbClient.pet.findMany({
            skip: pagination.offset,
            take: pagination.limit,
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
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        return CustomResponse<ApiResponsePayload<{ pets: IPet[] }>>({
            error: false,
            message: ["Mascotas obtenidas"],
            payload: {
                pets,
            },
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: 'Ocurrió un error buscando las mascotas' });
    };
};


export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const data = ZNewPet.parse(await request.json());

        const userInfo = await checkUserValidSession({ cookies });

        if (!data.owners.includes(userInfo.id)) throw new ValidationError("Los dueños de la mascota no son válidos", 400);

        const res = await DbClient.pet.create({
            data: {
                ...data,
                owners: {
                    connect: data.owners.map((owner) => ({ id: owner })),
                },
            },
        });

        return CustomResponse<ApiResponsePayload<{ petId: number }>>({
            error: false,
            message: ["La mascota fue creada"],
            payload: {
                petId: res.id,
            }
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: 'Ocurrió un error creando la mascota' });
    };
};
