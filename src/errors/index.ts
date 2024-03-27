import { ZodError } from "zod";
import { isAxiosError } from "axios";

import { AxiosErrorFormatter, CustomErrorFormatter, ZodErrorFormatter } from "./formatters";
// import { DbClient } from "../database/Db";
import type { ApiResponseError } from "@/types/Api";

export const ERROR_NAMES = {
    CustomError: 'CustomError',
    ConnectionError: 'ConnectionError',
    DbError: 'DbError',
    ParsingError: 'ParsingError',
    AuthError: 'AuthError',
    ValidationError: 'ValidationError',
} as const;

type TObjectValues<T> = T[keyof T];

export type TErrorNames = TObjectValues<typeof ERROR_NAMES>;

export type SuccessStatusCode = 200 | 201 | 202

export type ErrorStatusCode = 400 | 401 | 403 | 404 | 500;

export type StatusCode = SuccessStatusCode | ErrorStatusCode;


export class CustomError extends Error {
    errorCode: ErrorStatusCode = 400;
    constructor(message: string, errorCode: ErrorStatusCode) {
        super(message);
        this.name = ERROR_NAMES.CustomError;
        this.errorCode = errorCode;
    };

};

export class ConnectionError extends CustomError {
    constructor(message: string, errorCode: ErrorStatusCode) {
        super(message, errorCode)
        this.name = ERROR_NAMES.ConnectionError;
    };

};

export class DbError extends CustomError {
    constructor(message: string, errorCode: ErrorStatusCode) {
        super(message, errorCode)
        this.name = ERROR_NAMES.DbError;
    };

};

export class ParsingError extends CustomError {
    constructor(message: string, errorCode: ErrorStatusCode) {
        super(message, errorCode)
        this.name = ERROR_NAMES.ParsingError;
    };

};

export class AuthError extends CustomError {
    constructor(message: string, errorCode: ErrorStatusCode) {
        super(message, errorCode)
        this.name = ERROR_NAMES.AuthError;
    };

};

export class ValidationError extends CustomError {
    constructor(message: string, errorCode: ErrorStatusCode) {
        super(message, errorCode)
        this.name = ERROR_NAMES.ValidationError;
    };

};

type EndpointErrorHandlerParams = {
    error: unknown;
    defaultErrorMessage: string;
    errorCode?: StatusCode;
    noPrintError?: boolean;
    disconnectDb?: boolean;
}

export const EndpointErrorHandler = async (params: EndpointErrorHandlerParams): Promise<Response> => {
    params.noPrintError || console.log(params.error);

    // params.disconnectDb ?? await DbClient.$disconnect();

    if (params.error instanceof ZodError) return new Response(JSON.stringify(ZodErrorFormatter(params.error)), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 400,
    });

    if (isAxiosError(params.error)) return new Response(JSON.stringify(AxiosErrorFormatter(params.error)), {
        headers: {
            "Content-Type": "application/json",
        },
        status: params.errorCode || 400,
    });

    if (params.error instanceof CustomError) return new Response(JSON.stringify(CustomErrorFormatter(params.error)), {
        headers: {
            "Content-Type": "application/json",
        },
        status: params.error.errorCode,
    });


    return new Response(JSON.stringify({
        error: true,
        message: [params.defaultErrorMessage],
    }), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 500,
    });
};

type ApiErrorHandlerParams = {
    error: unknown;
    defaultErrorMessage: string;
    noPrintError?: boolean;
}

export const ApiErrorHandler = async (params: ApiErrorHandlerParams): Promise<ApiResponseError> => {
    params.noPrintError || console.log(params.error);

    if (params.error instanceof ZodError) return ZodErrorFormatter(params.error)

    if (isAxiosError(params.error)) return AxiosErrorFormatter(params.error)

    if (params.error instanceof CustomError) return CustomErrorFormatter(params.error)


    return {
        error: true,
        message: [params.defaultErrorMessage],
    };
};
