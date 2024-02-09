import type { APIRoute } from "astro";

import { DbClient } from "@/database/Db";
import { EndpointErrorHandler } from "@errors/index";
import { CustomResponse, type ApiResponsePayload, ZApiPagination, type ApiResponse } from "@customTypes/Api";
import { type IUserInfo } from "@customTypes/Pet";
import { safeCheckUserValidSession } from "@/utils/JWT";
import type { IPetInfo } from "@/types/User";
import type { TPetCount } from "@/stores/DataLoaded";


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

        let [petsInfo, usersInfo] = await DbClient.$transaction([petsQuery, usersQuery]);

        // TODO: REMOVER ESTO
        if (usersInfo.length < 9) usersInfo = [...usersInfo, ...Array(9 - usersInfo.length).fill({
            id: 5,
            name: "Jean Fasanella",
            image: "/src/assets/rabbit-1.jpg",
        })]

        if (petsInfo.length < 9) petsInfo = [...petsInfo, ...Array(9 - petsInfo.length).fill({
            behaviors: ['funny', 'happy'],
            createdAt: "2024-01-25T22:58:40.172Z",
            id: 4,
            image: "/src/assets/dog-2.jpg",
            name: "Mancha",
            petType: "dog"
        })]

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


let cachingCount: TPetCount = {};

export const PATCH: APIRoute = async ({ url, cookies }) => {
    try {
        const dogCountQuery = DbClient.pet.aggregate({
            _count: {
                petType: true,
            },
            where: {
                petType: "dog"
            }
        });

        const catCountQuery = DbClient.pet.aggregate({
            _count: {
                petType: true,
            },
            where: {
                petType: "cat"
            }
        });

        const horseCountQuery = DbClient.pet.aggregate({
            _count: {
                petType: true,
            },
            where: {
                petType: "horse"
            }
        });

        const rabbitCountQuery = DbClient.pet.aggregate({
            _count: {
                petType: true,
            },
            where: {
                petType: "rabbit"
            }
        });

        const monkeyCountQuery = DbClient.pet.aggregate({
            _count: {
                petType: true,
            },
            where: {
                petType: "monkey"
            }
        });

        const turtleCountQuery = DbClient.pet.aggregate({
            _count: {
                petType: true,
            },
            where: {
                petType: "turtle"
            }
        });

        const goatCountQuery = DbClient.pet.aggregate({
            _count: {
                petType: true,
            },
            where: {
                petType: "goat"
            }
        });

        const birdCountQuery = DbClient.pet.aggregate({
            _count: {
                petType: true,
            },
            where: {
                petType: "bird"
            }
        });

        const fishCountQuery = DbClient.pet.aggregate({
            _count: {
                petType: true,
            },
            where: {
                petType: "fish"
            }
        });

        const pigCountQuery = DbClient.pet.aggregate({
            _count: {
                petType: true,
            },
            where: {
                petType: "pig"
            }
        });

        const hedgehogCountQuery = DbClient.pet.aggregate({
            _count: {
                petType: true,
            },
            where: {
                petType: "hedgehog"
            }
        });

        const otherCountQuery = DbClient.pet.aggregate({
            _count: {
                petType: true,
            },
            where: {
                petType: "other"
            }
        });

        let [
            dogCount,
            catCount,
            horseCount,
            rabbitCount,
            monkeyCount,
            turtleCount,
            goatCount,
            birdCount,
            fishCount,
            pigCount,
            hedgehogCount,
            otherCount,
        ] = await DbClient.$transaction([
            dogCountQuery,
            catCountQuery,
            horseCountQuery,
            rabbitCountQuery,
            monkeyCountQuery,
            turtleCountQuery,
            goatCountQuery,
            birdCountQuery,
            fishCountQuery,
            pigCountQuery,
            hedgehogCountQuery,
            otherCountQuery,
        ]);

        return CustomResponse<ApiResponsePayload<{ count: TPetCount }>>({
            error: false,
            message: ["Información obtenida"],
            payload: {
                count: {
                    dogCount: dogCount._count.petType,
                    catCount: catCount._count.petType,
                    horseCount: horseCount._count.petType,
                    rabbitCount: rabbitCount._count.petType,
                    monkeyCount: monkeyCount._count.petType,
                    turtleCount: turtleCount._count.petType,
                    goatCount: goatCount._count.petType,
                    birdCount: birdCount._count.petType,
                    fishCount: fishCount._count.petType,
                    pigCount: pigCount._count.petType,
                    hedgehogCount: hedgehogCount._count.petType,
                    otherCount: otherCount._count.petType,
                }
            },
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: 'Ocurrió un error contando las mascotas' });
    };
};
