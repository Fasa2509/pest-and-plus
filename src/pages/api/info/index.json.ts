import type { APIRoute } from "astro";

import { DbClient } from "@/database/Db";
import { EndpointErrorHandler, ValidationError } from "@errors/index";
import { CustomResponse, type ApiResponsePayload, ZApiPagination, type ApiResponse } from "@customTypes/Api";
import { type IPet, ZNewPet, type IUserInfo } from "@customTypes/Pet";
import { checkUserValidSession, safeCheckUserValidSession } from "@/utils/JWT";
import type { IPetInfo } from "@/types/User";


export const GET: APIRoute = async ({ url, cookies }) => {
    try {
        const pagination = ZApiPagination.parse(Object.fromEntries(url.searchParams.entries()));

        const userInfo = await safeCheckUserValidSession({ cookies });

        const petsQuery = DbClient.pet.findMany({
            ...(userInfo) ? { where: { owners: { none: { id: userInfo.id } } } } : {},
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
            },
        });

        const usersQuery = DbClient.user.findMany({
            ...(userInfo) ? { where: { id: { not: userInfo.id } } } : {},
            skip: pagination.offset,
            take: pagination.limit,
            select: {
                id: true,
                name: true,
                image: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const [petsInfo, usersInfo] = await DbClient.$transaction([petsQuery, usersQuery]);

        return CustomResponse<ApiResponsePayload<{ petsInfo: IPetInfo[], usersInfo: IUserInfo[] }>>({
            error: false,
            message: ["Información obtenida"],
            payload: {
                petsInfo,
                usersInfo,
            },
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: 'Ocurrió un error buscando las mascotas' });
    };
};
