import axios from "axios";

import { AxiosApi } from "@/utils/AxiosApi";
import { ValidExtensions, type ApiResponse, type ApiResponsePayload, type ImageType } from "@/types/Api";
import { ApiErrorHandler, ValidationError } from "@/errors";


export const uploadImageToS3 = async (file: File | Blob, imageType: ImageType): Promise<ApiResponsePayload<{ imgUrl: string; }>> => {
    try {
        // let extension = file..rscname.split(".").at(-1) || "";

        // if (!ValidExtensions.includes(extension)) throw new ValidationError("La extensión del archivo no es válida", 400);
        if (file.size > 1024 * 1024 * 6) throw new ValidationError("La imagen es muy grande. Intenta comprimirla.", 400);

        const { data } = await AxiosApi.post<ApiResponsePayload<{ url: string; objectKey: string; }>>("/images.json", {
            // @ts-ignore
            rscname: file.name,
            imageType,
        });

        if (data.error) throw new ValidationError("Ocurrió un error subiendo la imagen", 400);

        const res = await axios.put(data.payload.url || '', file, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });

        if (!((res.status >= 200 && res.status < 400))) throw new ValidationError("Hubo un error subiendo la imagen", 400);

        return {
            error: false,
            message: ['La imagen fue subida'],
            payload: {
                imgUrl: data.payload.objectKey,
            },
        };
    } catch (error) {
        return ApiErrorHandler({ error, defaultErrorMessage: "Error subiendo la imagen" });
    };
};


export const deleteImageFromS3 = async (Key: string): Promise<ApiResponse> => {
    try {
        const { data } = await AxiosApi.put("/images.json", {
            Key
        });

        return data;
    } catch (error) {
        return ApiErrorHandler({ error, defaultErrorMessage: "Ocurrió un error eliminando la imagen" });
    };
};
