import type { IPost } from "@/types/Post";
import { DbClient } from "./Db";
import { PAGINATION_POST } from "./DbPost";


export const backGetInitialPosts = async (userId: number): Promise<IPost[] | undefined> => {
    const posts = await DbClient.post.findMany({
        where: {
            authorId: {
                not: userId,
            },
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            },
            pet: {
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    image: true,
                    petType: true,
                    behaviors: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: PAGINATION_POST,
    });

    return posts;
};
