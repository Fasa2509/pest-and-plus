import type { APIRoute } from "astro";

import { DbClient } from "@/database/Db";
import { EndpointErrorHandler } from "@/errors";
import { CustomResponse, type ApiResponse } from "@/types/Api";
import { petSeed } from "@/types/Pet";
import { postSeed } from "@/types/Post";
import { userSeed } from "@/types/User";


export const GET: APIRoute = async () => {
    try {
        let userQuery = await DbClient.user.createMany({
            data: userSeed,
        });

        let allUsers = await DbClient.user.findMany();

        const addingPets = petSeed.map((pet) => DbClient.pet.create({
            data: {
                ...pet,
                owners: {
                    connect: pet.owners.map((owner) => ({ id: owner })),
                },
                creator: {
                    connect: { id: allUsers.at(Math.floor(Math.random() * allUsers.length))!.id }
                }
            },
        }));

        await DbClient.$transaction([...addingPets]);

        let postsQuery = postSeed.map((post) => DbClient.post.create({
            data: {
                ...post,
                author: {
                    connect: {
                        id: 4
                    },
                },
            },
        }));

        await DbClient.$transaction(postsQuery);

        return CustomResponse<ApiResponse>({
            error: false,
            message: ["La data fue cargada"],
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: "Ocurrió un error agregando la seed data" });
    };
};
