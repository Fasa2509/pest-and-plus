import { ApiErrorHandler } from "@/errors";
import type { ApiResponsePayload } from "@/types/Api";
import type { IUserInfo } from "@/types/Pet";
import type { IPetInfo } from "@/types/User";
import { AxiosApi } from "@/utils/AxiosApi";


export const getInfo = async (): Promise<ApiResponsePayload<{ petsInfo: IPetInfo[], usersInfo: IUserInfo[] }>> => {
    try {
        const { data } = await AxiosApi.get<ApiResponsePayload<{ petsInfo: IPetInfo[], usersInfo: IUserInfo[] }>>(`/info.json?limit=9&offset=0`);

        return data;
    } catch (error: unknown) {
        return ApiErrorHandler({ error, defaultErrorMessage: 'Error buscando mascotas', noPrintError: true });
    };
};