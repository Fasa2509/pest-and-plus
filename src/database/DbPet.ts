import { ApiErrorHandler, ParsingError, ValidationError } from "@/errors";
import type { ApiResponse, ApiResponsePayload } from "@/types/Api";
import { ZNewPet, type INewPet, type IPet, type IUpdatePet, ZUpdatePet } from "@/types/Pet";
import { AxiosApi } from "@/utils/AxiosApi";


// export const createNewPet = async (body: INewPet): Promise<ApiResponse> => {
//     try {
//         const { data } = await AxiosApi.put<ApiResponse>("/pet.json", body);

//         return data;
//     } catch (error: unknown) {
//         return ApiErrorHandler({ error, defaultErrorMessage: 'Error solicitando login', noPrintError: true });
//     };
// };


export const getNewPet = async (petId: number): Promise<ApiResponsePayload<{ pet: IPet }>> => {
    try {
        if (!petId || isNaN(Number(petId)) || Number(petId) < 1) throw new ValidationError("El id de la mascota no es válido", 400);

        const { data } = await AxiosApi.get<ApiResponsePayload<{ pet: IPet }>>(`/pet/${petId}.json`);

        return data;
    } catch (error: unknown) {
        return ApiErrorHandler({ error, defaultErrorMessage: 'Ocurrió un error buscando la mascota', noPrintError: true });
    };
};


// export const frontGetPets = async (): Promise<ApiResponsePayload<{ pets: IPetInfo[] }>> => {
//     try {
//         const { data } = await AxiosApi.get<ApiResponsePayload<{ pets: IPetInfo[] }>>(`/pet/info.json?limit=9&offset=0`);

//         return data;
//     } catch (error: unknown) {
//         return ApiErrorHandler({ error, defaultErrorMessage: 'Error buscando mascotas', noPrintError: true });
//     };
// };


export const uploadNewPet = async (petInfo: INewPet): Promise<ApiResponsePayload<{ petId: number }>> => {
    try {
        const body = ZNewPet.parse(petInfo);

        const { data } = await AxiosApi.post<ApiResponsePayload<{ petId: number }>>("/pet.json", body);

        return data;
    } catch (error: unknown) {
        return ApiErrorHandler({ error, defaultErrorMessage: 'Error subiendo la mascota', noPrintError: true });
    };
};


export const updatePetInfo = async (petId: number, petInfo: IUpdatePet): Promise<ApiResponse> => {
    try {
        if (!Number.isInteger(petId) || petId < 1) throw new ParsingError("El id de la mascota no es válido", 400);
        const body = ZUpdatePet.parse(petInfo);

        const { data } = await AxiosApi.put<ApiResponse>(`/pet/${petId}.json`, body);

        return data;
    } catch (error: unknown) {
        return ApiErrorHandler({ error, defaultErrorMessage: 'Error actualizando la mascota', noPrintError: true });
    };
};
