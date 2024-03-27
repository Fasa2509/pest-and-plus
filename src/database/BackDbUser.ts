import type { IUser } from "@/types/User";
import { DbClient } from "./Db";
import { CustomError } from "@/errors";


export const backGetUserInfo = async (userId: number): Promise<IUser | undefined> => {
    try {
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
                    },
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
                    },
                    orderBy: {
                        createdAt: "desc",
                    }
                },
                linkRequests: {
                    select: {
                        id: true,
                        requestingUser: true,
                        askedPet: {
                            include: {
                                creator: true,
                            }
                        },
                    },
                },
            },
        });

        if (!user) throw new CustomError("No se encontró usuario por ese id", 404);

        return user;
    } catch (error: unknown) {
        return undefined;
    };
};