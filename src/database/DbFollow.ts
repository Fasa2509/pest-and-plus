import { ApiErrorHandler, ValidationError } from "@/errors";
import type { ApiResponse } from "@/types/Api";
import { AxiosApi } from "@/utils/AxiosApi";


export const toggleFollowNewPet = async (petId: number): Promise<ApiResponse> => {
    try {
        if (!petId || isNaN(Number(petId)) || Number(petId) < 1) throw new ValidationError("El id de la mascota no es válido", 400);

        const { data } = await AxiosApi.patch<ApiResponse>(`/follow.json?petId=${petId}`);

        return data;
    } catch (error: unknown) {
        return ApiErrorHandler({ error, defaultErrorMessage: 'Ocurrió un error', noPrintError: true });
    };
};