import type { APIRoute } from "astro";

import { DbClient } from "@/database/Db";
import { EndpointErrorHandler } from "@/errors";
import { CustomResponse, type ApiResponse } from "@/types/Api";
import { petSeed } from "@/types/Pet";
import { postSeed } from "@/types/Post";
import { userSeed } from "@/types/User";


export const GET: APIRoute = async () => {
    try {
        let userQuery = DbClient.user.createMany({
            data: userSeed,
        });

        let postQuery = DbClient.post.createMany({
            data: postSeed,
        });

        await DbClient.$transaction([userQuery, postQuery]);

        const addingPets = petSeed.map((pet) => DbClient.pet.create({
            data: {
                ...pet,
                owners: {
                    connect: pet.owners.map((owner) => ({ id: owner })),
                },
            },
        }));

        await DbClient.$transaction(addingPets);

        return CustomResponse<ApiResponse>({
            error: false,
            message: ["La data fue cargada"],
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: "Ocurrió un error agregando la seed data" });
    };
};
