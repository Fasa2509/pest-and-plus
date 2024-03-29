import { ApiErrorHandler, ValidationError } from "@/errors";
import type { ApiResponse } from "@/types/Api";
import { AxiosApi } from "@/utils/AxiosApi";
import { isValidEmail } from "@/utils/validations";

export const requestLogin = async (method: 'POST' | 'PATCH', { email, name }: { email: string; name?: string; }): Promise<ApiResponse> => {
    try {
        if (!isValidEmail(email)) throw new ValidationError("El correo no es válido", 400);

        let response: ApiResponse;

        if (method === 'POST') {
            if (!name || name.length < 2) throw new ValidationError("El nombre no es válido", 400);
            if (/[^a-zA-ZáéíóúÁÉÍÓÚ ]/.test(name)) throw new ValidationError("El nombre contiene caracteres no válidos", 400);

            const { data } = await AxiosApi.post<ApiResponse>(`/user.json`, { email, name });
            response = data;
        } else {
            const { data } = await AxiosApi.patch<ApiResponse>(`/login.json`, { email });
            response = data;
        };

        // TODO
        // console.log(response)

        return response;
    } catch (error: unknown) {
        return ApiErrorHandler({ error, defaultErrorMessage: 'Error solicitando login', noPrintError: true });
    };
};