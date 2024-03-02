import * as z from 'zod';

const ZUserInfo = z.object({
    id   : z.number({ required_error: 'El id de usuario es requerido' }),
    image: z.union([z.string({ invalid_type_error: 'La imagen debe ser un texto' }), z.null()]),
    name : z.string({ required_error: 'El nombre es requerido', invalid_type_error: 'El nombre debe ser texto' }).trim().min(2, 'El nombre es muy corto'),
});

const PetBehaviorEnum = z.enum([
    "funny",
    "happy",
    "angry",
    "eater",
    "dramatic",
    "eager",
], {
    invalid_type_error: 'Una característica de mascota no es válida',
});

const PetTypeEnum = z.enum([
    "dog",
    "cat",
    "horse",
    "rabbit",
    "monkey",
    "turtle",
    "goat",
    "bird",
    "pig",
    "fish",
    "hedgehog",
    "other",
], {
    invalid_type_error: 'El tipo de mascota no es válido',
});

const ZPetInfo = z.object({
    id       : z.number({ required_error: 'El id de la mascota es requerido' }),
    name     : z.string({ required_error: 'El nombre es requerido', invalid_type_error: 'El nombre debe ser texto' }).trim().min(3).max(20),
    petType  : PetTypeEnum,
    image    : z.union([z.string({ invalid_type_error: 'La imagen debe ser un texto' }), z.null()]),
    behaviors: z.array(PetBehaviorEnum).min(1, 'Tu mascota debe tener al menos un atributo'),
});

export const ZPostFollowedPet = z.object({
    id         : z.number({ required_error: 'El id de la publicación es requerido' }),
    createdAt  : z.date(),
    description: z.string({ required_error: 'La descripción es requerida', invalid_type_error: 'La descripción debe ser un texto' }).trim().max(999, 'La descripción es demasiado larga'),
    images     : z.array(z.string({ invalid_type_error: 'La imagen debe ser un texto' })).default([]),
    author     : ZUserInfo,
    pet        : z.union([ZPetInfo, z.null()]),
});

export type IPostFollowedPet = z.infer<typeof ZPostFollowedPet>;

export const ZPost = z.object({
    id         : z.number({ required_error: 'El id de la publicación es requerido' }),
    createdAt  : z.date(),
    published  : z.boolean({ invalid_type_error: 'El estado de la publicación debe ser un booleano' }),
    description: z.string({ required_error: 'La descripción es requerida', invalid_type_error: 'La descripción debe ser un texto' }).trim().max(999, 'La descripción es demasiado larga'),
    images     : z.array(z.string({ invalid_type_error: 'La imagen debe ser un texto' })).default([]),
    author     : ZUserInfo,
    pet        : z.union([ZPetInfo, z.null()]),
});

export type IPost = z.infer<typeof ZPost>;

export const ZNewPost = z.object({
    description: z.string({ required_error: 'La descripción es requerida', invalid_type_error: 'La descripción debe ser un texto' }).trim().max(999, 'La descripción es demasiado larga'),
    published  : z.boolean({ invalid_type_error: 'El estado de la publicación debe ser un booleano' }).default(false).optional(),
    createdAt  : z.date().default(new Date()).optional(),
    images     : z.array(z.string({ invalid_type_error: 'La imagen debe ser un texto' })).default([]),
    authorId   : z.number({ required_error: 'El id del autor es requerido', invalid_type_error: 'El id del autor debe ser un número' }),
    petId      : z.number({ invalid_type_error: 'El id de la mascota debe ser un número' }).optional(),
});

export type INewPost = z.infer<typeof ZNewPost>;

export const postSeed: Omit<INewPost, "authorId" | "petId">[] = [
    {
        description: "soft adult average became mix light diameter moon saw running produce dear ahead exclaimed spoken dawn fairly regular melted mountain muscle hundred replace allowPrimer post",
        published: true,
        // authorId: 1,
        images: [],
        // petId: 1,
    },
    {
        description: "smoke night dream naturally village honor chest vapor knowledge location sight hurt additional land breathe using gravity lot bag ordinary stronger floating within drySegundo post",
        published: false,
        // authorId: 2,
        images: [],
    },
    {
        description: "round develop garden old hung call drive title put wall duck official same divide on hunt voice help paragraph cool does rock control mayTercero post",
        published: true,
        // authorId: 5,
        images: [],
        // petId: 2,
    },
    {
        description: "explore box paint blew truck glad am leaving beat including graph ahead yesterday quickly mostly news chest jump effect full baby rubber saved somethingCuarto post",
        published: false,
        // authorId: 5,
        images: [],
        // petId: 1,
    },
    {
        description: "basket shut specific rain construction solution rocky slow obtain law announced ate not box nearest ill every joined thought somehow rocket evidence is ratherQuinto post",
        published: true,
        // authorId: 4,
        images: [],
        // petId: 1,
    },
    {
        description: "age understanding spin cell height door cookies camera sugar sat follow willing salt ought design buried card older charge bet perfectly perhaps my spentSexto post",
        published: false,
        // authorId: 3,
        images: [],
    },
    {
        description: "twelve flight theory hold order brought series read strike whistle deeply observe shore kill left difference women wonderful future anybody conversation hollow breeze getSeptimo post",
        published: true,
        // authorId: 5,
        images: [],
        // petId: 1,
    },
];
