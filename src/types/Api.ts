import * as z from 'zod';


export const ValidExtensions = ["jpg", "jpeg", "png", "webp"];
export type ImageType = "profile" | "post" | "pet";
export const ValidImageType: ImageType[] = ["profile", "post", "pet"];


export const CustomResponse = <T>(body: T, status: number = 200): Response => {
    return new Response(JSON.stringify(body), {
        headers: {
            "Content-Type": "application/json",
        },
        status,
    });
};


export interface ApiResponse {
    error: boolean;
    message: string[];
};

export interface ApiResponseWithPayload<T> extends ApiResponse {
    error: false;
    payload: T;
};

export interface ApiResponseError extends ApiResponse {
    error: true;
};

export type ApiResponsePayload<T> = ApiResponseWithPayload<T> | ApiResponseError;

export const ZApiPagination = z.object({
    limit: z.string().pipe(z.coerce.number({ required_error: 'El límite de la petición es obligatorio', invalid_type_error: 'El límite de la query debe ser un número' }).positive('El límite de entradas no es válido').lte(100, 'El límite de la query es muy grande'),),
    offset: z.string().pipe(z.coerce.number({ required_error: 'El número de partida es obligatorio', invalid_type_error: 'El inicio de la query debe ser un número' }).nonnegative('El límite de entradas no es válido'),),
});

export type ApiPagination = z.infer<typeof ZApiPagination>;
