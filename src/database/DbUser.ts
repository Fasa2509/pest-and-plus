import { ApiErrorHandler, CustomError } from "@/errors";
import { CustomResponse, type ApiResponse, type ApiResponsePayload } from "@/types/Api";
import type { IUserInfo } from "@/types/Pet";
import type { IUser, IEditUser } from "@/types/User";
import { AxiosApi } from "@/utils/AxiosApi";
import { DbClient } from "./Db";


export const frontGetUserInfo = async (userId: number): Promise<ApiResponsePayload<{ user: IUser }>> => {
    try {
        // const { data } = await AxiosApi.patch<ApiResponsePayload<{ user: IUser }>>(`/user/${userId}.json`);
        const { data } = await AxiosApi.patch<ApiResponsePayload<{ user: IUser }>>(`/user/${userId}.json`);

        return data;
    } catch (error: unknown) {
        return ApiErrorHandler({ error, defaultErrorMessage: 'Error solicitando login', noPrintError: true });
    };
};


export const backGetUserInfo = async (userId: number): Promise<{ user: IUser } | undefined> => {
    try {
        const user = await DbClient.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                pets: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        petType: true,
                        behaviors: true,
                        createdAt: true,
                    }
                },
                following: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        petType: true,
                        behaviors: true,
                        createdAt: true,
                    }
                },
                posts: {
                    select: {
                        id: true,
                        description: true,
                        images: true,
                        createdAt: true,
                        petId: true,
                    }
                },
            },
        });

        if (!user) throw new CustomError("No se encontró usuario por ese id", 404);

        return { user }
    } catch (error: unknown) {
        return undefined;
    };
};


export const updateUserInfo = async (userId: number, body: IEditUser): Promise<ApiResponse> => {
    try {
        const { data } = await AxiosApi.put<ApiResponse>(`/user/${userId}.json`, body);

        return data;
    } catch (error: unknown) {
        return ApiErrorHandler({ error, defaultErrorMessage: 'Error solicitando login', noPrintError: true });
    };
};

export const frontGetUsers = async (userId: number): Promise<ApiResponsePayload<{ user: IUserInfo }>> => {
    try {
        const { data } = await AxiosApi.get<ApiResponsePayload<{ user: IUserInfo }>>(`/user.json`);

        return data;
    } catch (error: unknown) {
        return ApiErrorHandler({ error, defaultErrorMessage: 'Error solicitando login', noPrintError: true });
    };
};
