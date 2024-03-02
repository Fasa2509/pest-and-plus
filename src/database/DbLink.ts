import { ApiErrorHandler, ValidationError } from "@/errors";
import type { ApiResponse } from "@/types/Api";
import { ZResponseLinkRequest, type IResponseLinkRequest } from "@/types/LinkRequest";
import { AxiosApi } from "@/utils/AxiosApi";


export const requestLinkPet = async ({ usersIds, petId }: { usersIds: number[], petId: number }): Promise<ApiResponse> => {
    try {
        if (usersIds.some((id) => isNaN(id) || id < 1 || !Number.isInteger(id))) throw new ValidationError("Hay ids no válidos", 400);
        if (isNaN(Number(petId)) || Number(petId) < 1) throw new ValidationError("El id de la mascota no es válido", 400);

        const { data } = await AxiosApi.post<ApiResponse>(`/link.json`, { usersIds, petId });

        return data;
    } catch (error: unknown) {
        return ApiErrorHandler({ error, defaultErrorMessage: 'Ocurrió un error enlazando la mascota', noPrintError: true });
    };
};

export const responseLinkRequest = async (resInfo: IResponseLinkRequest): Promise<ApiResponse> => {
    try {
        const body = ZResponseLinkRequest.parse(resInfo);

        const { data } = await AxiosApi.patch<ApiResponse>(`/link.json`, body);

        return data;
    } catch (error: unknown) {
        return ApiErrorHandler({ error, defaultErrorMessage: 'Ocurrió un error aceptando la solicitud', noPrintError: true });
    };
};
