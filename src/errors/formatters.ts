import { ZodError } from 'zod';
import { isAxiosError } from 'axios';

import { CustomError } from '.';
import type { ApiResponseError } from '@customTypes/Api';

export const ZodErrorFormatter = (errorObj: unknown): ApiResponseError => {

    if (errorObj instanceof ZodError) {
        let message = errorObj.issues.map((err) => err.message);

        return {
            error: true,
            message,
        };
    };

    return {
        error: true,
        message: ['Error formateando error de Zod'],
    };
};

export const AxiosErrorFormatter = (error: unknown): ApiResponseError => {

    if (isAxiosError(error)) {
        return {
            error: true,
            message: error.response?.data.message,
        };
    };

    return {
        error: true,
        message: ['Error formateando error de Axios'],
    };
};

export const CustomErrorFormatter = (error: unknown): ApiResponseError => {

    if (error instanceof CustomError) {
        return {
            error: true,
            message: [error.message],
        };
    };

    return {
        error: true,
        message: ['Error formateando error de Axios'],
    };
}

export const ErrorFormatter = (error: unknown): ApiResponseError => {

    if (error instanceof ZodError) return ZodErrorFormatter(error);
    if (error instanceof CustomError) return CustomErrorFormatter(error);
    if (isAxiosError(error)) return AxiosErrorFormatter(error);

    return {
        error: true,
        message: ['Error formateando error personalizado'],
    };
};
