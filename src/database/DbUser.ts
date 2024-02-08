import { ApiErrorHandler } from "@/errors";
import type { ApiResponse, ApiResponsePayload } from "@/types/Api";
import type { IUserInfo } from "@/types/Pet";
import type { IUser, IEditUser } from "@/types/User";
import { AxiosApi } from "@/utils/AxiosApi";


export const frontGetUserInfo = async (userId: number): Promise<ApiResponsePayload<{ user: IUser }>> => {
    try {
        // const { data } = await AxiosApi.patch<ApiResponsePayload<{ user: IUser }>>(`/user/${userId}.json`);
        const { data } = await AxiosApi.patch<ApiResponsePayload<{ user: IUser }>>(`/user/${userId}.json`);

        return data;
    } catch (error: unknown) {
        return ApiErrorHandler({ error, defaultErrorMessage: 'Error solicitando login', noPrintError: true });
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
