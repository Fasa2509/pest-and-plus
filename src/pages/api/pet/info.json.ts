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
            select: {
                id: true,
                name: true,
                petType: true,
                image: true,
                createdAt: true,
                behaviors: true,
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        return CustomResponse<ApiResponsePayload<{ pets: IPetInfo[] }>>({
            error: false,
            message: ["Info de mascotas obtenidas"],
            payload: {
                pets,
            },
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: 'Ocurrió un error buscando las mascotas' });
    };
};
