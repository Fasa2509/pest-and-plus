import type { APIRoute } from "astro";

import { DbClient } from "@/database/Db";
import { CustomError, DbError, ParsingError, EndpointErrorHandler, AuthError } from "@/errors";
import { CustomResponse, type ApiResponsePayload, type ApiResponse } from "@/types/Api";
import type { IPost } from "@/types/Post";
import { checkUserValidSession } from "@/utils/JWT";


export const GET: APIRoute = async ({ params }) => {
    try {
        let postId = Number(params.postId);

        const post = await DbClient.post.findUnique({
            where: {
                id: postId,
            },
            include: {
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
                        petType: true,
                        behaviors: true,
                    },
                },
            },
        });

        if (!post) throw new CustomError("No se encontró publicación por ese id", 404);

        return CustomResponse<ApiResponsePayload<{ post: IPost }>>({
            error: false,
            message: ["Publicación obtenida"],
            payload: {
                post,
            },
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: 'Ocurrió un error buscando la publicación' });
    };
};


export const DELETE: APIRoute = async ({ cookies, params }) => {
    try {
        let postId = Number(params.postId);

        if (!postId || isNaN(Number(postId)) || Number(postId) < 1) throw new ParsingError("El id de la publicación no es válido", 400);

        const userInfo = await checkUserValidSession({ cookies });

        const post = await DbClient.post.findUnique({
            where: {
                id: postId,
            },
            select: {
                id: true,
                authorId: true,
            },
        });

        if (!post) throw new DbError("No se encontró publicación por ese id", 404);
        if (post.authorId !== userInfo.id && userInfo.role !== "ADMIN") throw new AuthError("No tiene permiso para realizar esa acción", 400);

        await DbClient.post.delete({
            where: {
                id: postId,
            },
        });

        return CustomResponse<ApiResponse>({
            error: false,
            message: ["La publicación fue eliminada"],
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: "Ocurrió un error eliminando la publicación" });
    };
};
