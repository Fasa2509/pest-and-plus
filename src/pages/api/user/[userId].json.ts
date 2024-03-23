import type { APIRoute } from "astro";

import { AuthError, CustomError, DbError, EndpointErrorHandler, ParsingError, ValidationError } from "@errors/index";
import { CustomResponse, type ApiResponse, type ApiResponsePayload } from "@customTypes/Api";
import { ZEditUser, type IUser } from "@customTypes/User";
import { DbClient } from "@/database/Db";
import { checkUserValidCookies, decodeToken } from "@/utils/JWT";


export const GET: APIRoute = async ({ params }) => {
    try {
        let userId = Number(params.userId);

        const user = await DbClient.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                pets: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        petType: true,
                        behaviors: true,
                        createdAt: true,
                    }
                },
                following: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        petType: true,
                        behaviors: true,
                        createdAt: true,
                    }
                },
                posts: {
                    select: {
                        id: true,
                        description: true,
                        images: true,
                        createdAt: true,
                        petId: true,
                    }
                },
                linkRequests: {
                    select: {
                        id: true,
                        requestingUser: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            }
                        },
                        askedPet: {
                            select: {
                                id: true,
                                name: true,
                                petType: true,
                                image: true,
                                behaviors: true,
                                creator: {
                                    select: {
                                        id: true,
                                        name: true,
                                        image: true,
                                    }
                                }
                            }
                        },
                    },
                },
            },
        });

        if (!user) throw new CustomError("No se encontró usuario por ese id", 404);

        return CustomResponse<ApiResponsePayload<{ user: IUser }>>({
            error: false,
            message: ["Usuario obtenido"],
            payload: {
                user,
            },
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: "Ocurrió un error obteniendo los usuarios" });
    };
};


export const PUT: APIRoute = async ({ request, params, cookies }) => {
    try {
        const userId = await checkUserValidCookies({ params, cookies });

        const editedInfo = ZEditUser.parse(await request.json());

        if (Object.values(editedInfo).every((val) => val === undefined)) throw new ValidationError("No se especificó campo a actualizar", 400);

        const user = await DbClient.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
            },
        });

        if (!user) throw new CustomError("No se encontró usuario por ese id", 404);

        const toUpdate: Record<string, string> = {};

        if (editedInfo.bio !== undefined) toUpdate.bio = editedInfo.bio;
        if (editedInfo.image !== undefined) toUpdate.image = editedInfo.image;

        await DbClient.user.update({
            where: {
                id: userId,
            },
            data: toUpdate,
        });

        return CustomResponse<ApiResponse>({
            error: false,
            message: [`¡Los cambios fueron aplicados!`],
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: "Ocurrió un error accediendo al usuario" });
    };
};


// solicitud para tener informacion del usuario en el estado global del cliente
export const PATCH: APIRoute = async ({ params, cookies }) => {
    try {
        const userId = await checkUserValidCookies({ cookies, params });

        const user = await DbClient.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                pets: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        petType: true,
                        behaviors: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    }
                },
                following: true,
                posts: {
                    select: {
                        id: true,
                        description: true,
                        images: true,
                        createdAt: true,
                        petId: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                linkRequests: {
                    select: {
                        id: true,
                        requestingUser: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            }
                        },
                        askedPet: {
                            select: {
                                id: true,
                                name: true,
                                petType: true,
                                image: true,
                                behaviors: true,
                                creator: {
                                    select: {
                                        id: true,
                                        name: true,
                                        image: true,
                                    }
                                }
                            }
                        },
                    },
                },
            },
        });

        if (!user) throw new CustomError("No se encontró usuario por ese id", 404);

        return CustomResponse<ApiResponsePayload<{ user: IUser }>>({
            error: false,
            message: [`¡Bienvenid@ ${user.name.split(" ")[0]}!`],
            payload: {
                user,
            },
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: "Ocurrió un error obteniendo el usuario" });
    };
};


export const DELETE: APIRoute = async ({ params }) => {
    try {
        let userId = Number(params.userId);

        if (isNaN(userId)) throw new ParsingError("El id del usuario no es válido", 400);

        const user = await DbClient.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) throw new DbError("No se encontró usuario por ese id", 404);

        await DbClient.user.delete({
            where: {
                id: userId,
            },
        });

        return CustomResponse<ApiResponse>({
            error: false,
            message: ["El usuario fue eliminado"],
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: "Ocurrió un error eliminando el usuario" });
    };
};
