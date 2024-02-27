import type { APIRoute } from "astro";

import { DbClient } from "@/database/Db";
import { AuthError, EndpointErrorHandler, ParsingError, ValidationError } from "@/errors";
import { CustomResponse, type ApiResponsePayload, ZApiPagination, type ApiResponse } from "@/types/Api";
import { ZNewPost, type IPost, type IPostFollowedPet } from "@customTypes/Post";
import { checkUserValidSession, decodeToken } from "@/utils/JWT";
import type { IPostInfo } from "@/types/User";


export const GET: APIRoute = async ({ url, cookies }) => {
    try {
        const paginationParams = Object.fromEntries(url.searchParams.entries());

        if (!Number(paginationParams.max) || Number(paginationParams.max) > new Date().getTime()) throw new ParsingError("Paginación no válida", 400);

        const pagination = ZApiPagination.parse({ limit: paginationParams.limit, offset: paginationParams.offset });

        const token = cookies.get("auth-token");

        const userId = token ? (await decodeToken(token.value))?.id : 0;

        const posts = await DbClient.post.findMany({
            where: {
                authorId: {
                    not: userId,
                },
                createdAt: {
                    lt: new Date(Number(paginationParams.max)),
                },
            },
            skip: pagination.offset,
            take: pagination.limit,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                pet: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        petType: true,
                        createdAt: true,
                        behaviors: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return CustomResponse<ApiResponsePayload<{ posts: IPost[] }>>({
            error: false,
            message: ["Publicaciones obtenidas"],
            payload: {
                posts,
            },
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: "Ocurrió un error buscando las publicaciones" });
    };
};


export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const data = ZNewPost.parse(await request.json());

        const userInfo = await checkUserValidSession({ cookies });

        if (data.authorId !== userInfo.id) throw new ValidationError("El usuario autor y el creador no coinciden", 400);

        const post = await DbClient.post.create({
            data,
        });

        return CustomResponse<ApiResponsePayload<{ post: IPostInfo }>>({
            error: false,
            message: ["La publicación fue creada"],
            payload: {
                post,
            }
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: 'Ocurrió un error creando la publicación' });
    };
};


export const PATCH: APIRoute = async ({ request, cookies, url }) => {
    try {
        const paginationParams = Object.fromEntries(url.searchParams.entries());

        if (isNaN(Number(paginationParams.max)) || Number(paginationParams.max) > new Date().getTime()) throw new ParsingError("Paginación no válida", 400);

        const pagination = ZApiPagination.parse({ limit: paginationParams.limit, offset: paginationParams.offset });

        const userInfo = await checkUserValidSession({ cookies });

        const user = await DbClient.user.findUnique({
            where: {
                id: userInfo.id,
                createdAt: {
                    lt: new Date(Number(paginationParams.max)),
                },
            },
            select: {
                following: {
                    select: {
                        id: true,
                    }
                },
            }
        });

        if (!user) throw new AuthError("No se encontró el usuario", 404);

        const posts = await DbClient.post.findMany({
            where: {
                petId: {
                    in: user.following.map((followed) => followed.id),
                },
            },
            take: pagination.limit,
            skip: pagination.offset,
            select: {
                id: true,
                createdAt: true,
                description: true,
                images: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                },
                pet: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        createdAt: true,
                        petType: true,
                        behaviors: true,
                    }
                }
            }
        });

        return CustomResponse<ApiResponsePayload<{ posts: IPostFollowedPet[] }>>({
            error: false,
            message: ["Publicaciones de seguidos obtenidas"],
            payload: {
                posts,
            }
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: 'Ocurrió un error obteniendo las publicaciones de seguidos' });
    };
};
