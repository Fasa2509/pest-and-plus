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
    createdAt: z.date(),
    behaviors: z.array(PetBehaviorEnum).min(1, 'Tu mascota debe tener al menos un atributo'),
});

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

export const postSeed: INewPost[] = [
    {
        description: "Primer post",
        published: true,
        authorId: 1,
        images: [],
        petId: 1,
    },
    {
        description: "Segundo post",
        published: false,
        authorId: 2,
        images: [],
    },
    {
        description: "Tercero post",
        published: true,
        authorId: 5,
        images: [],
        petId: 2,
    },
    {
        description: "Cuarto post",
        published: false,
        authorId: 5,
        images: [],
        petId: 1,
    },
    {
        description: "Quinto post",
        published: true,
        authorId: 4,
        images: [],
        petId: 1,
    },
    {
        description: "Sexto post",
        published: false,
        authorId: 3,
        images: [],
    },
    {
        description: "Septimo post",
        published: true,
        authorId: 5,
        images: [],
        petId: 1,
    },
];
