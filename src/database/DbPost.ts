
import { AxiosApi } from "@/utils/AxiosApi";
import { ApiErrorHandler, ParsingError, ValidationError } from "@/errors";
import { DbClient } from "./Db";
import { ZApiPagination, type ApiResponse, type ApiResponsePayload, type ApiPagination } from "@/types/Api";
import type { INewPost, IPost } from "@/types/Post";
import type { IPostInfo } from "@/types/User";

export const PAGINATION_POST = 9;


export const backGetInitialPosts = async (userId: number): Promise<IPost[] | undefined> => {
    const posts = await DbClient.post.findMany({
        where: {
            authorId: {
                not: userId,
            },
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
                }
            }
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: PAGINATION_POST,
    });

    return posts;
};


export const frontGetMorePosts = async (pagination: ApiPagination & { max: number }): Promise<ApiResponsePayload<{ posts: IPost[] }>> => {
    try {
        if (pagination.limit > PAGINATION_POST || pagination.max > new Date().getTime()) throw new ParsingError("Paginación no válida", 400);

        const { limit, offset } = ZApiPagination.parse({ limit: String(pagination.limit), offset: String(pagination.offset) });

        const { data } = await AxiosApi.get<ApiResponsePayload<{ posts: IPost[] }>>(`/post.json?limit=${limit}&offset=${offset}&max=${pagination.max}`);

        return data;
    } catch (error: unknown) {
        return ApiErrorHandler({ error, defaultErrorMessage: 'Error solicitando login', noPrintError: true });
    };
};


export const uploadNewPost = async (body: INewPost): Promise<ApiResponsePayload<{ post: IPostInfo }>> => {
    try {
        const { data } = await AxiosApi.post<ApiResponsePayload<{ post: IPostInfo }>>(`/post.json`, body);

        return data;
    } catch (error: unknown) {
        return ApiErrorHandler({ error, defaultErrorMessage: 'Error solicitando login', noPrintError: true });
    };
};


export const deletePostById = async (postId: number): Promise<ApiResponse> => {
    try {
        if (!postId || isNaN(Number(postId)) || Number(postId) < 1) throw new ValidationError("El id del post no es válido", 400);

        const { data } = await AxiosApi.delete<ApiResponse>(`/post/${postId}.json`);

        return data;
    } catch (error: unknown) {
        return ApiErrorHandler({ error, defaultErrorMessage: 'Error solicitando login', noPrintError: true });
    };
};
