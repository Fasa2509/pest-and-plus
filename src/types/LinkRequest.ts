import * as z from 'zod';

export const ZResponseLinkRequest = z.object({
    id: z.number({ required_error: 'El id de solicitud es requerido' }),
    response: z.enum(["accept", "reject"], { invalid_type_error: "La respuesta no es válida", required_error: "La respuesta es requerida" }),
});

export type IResponseLinkRequest = z.infer<typeof ZResponseLinkRequest>;

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

const ZUserInfo = z.object({
    id   : z.number({ required_error: 'El id de usuario es requerido' }),
    image: z.union([z.string({ invalid_type_error: 'La imagen debe ser un texto' }), z.null()]),
    name : z.string({ required_error: 'El nombre es requerido', invalid_type_error: 'El nombre debe ser texto' }).trim().min(2, 'El nombre es muy corto'),
});

const ZPetLinkRequestInfo = z.object({
    id       : z.number({ required_error: 'El id de la mascota es requerido' }),
    name     : z.string({ required_error: 'El nombre es requerido', invalid_type_error: 'El nombre debe ser texto' }).trim().min(3).max(20),
    petType  : PetTypeEnum,
    image    : z.union([z.string({ invalid_type_error: 'La imagen debe ser un texto' }), z.null()]),
    behaviors: z.array(PetBehaviorEnum).min(1, 'Tu mascota debe tener al menos un atributo'),
    creator  : ZUserInfo,
});

export const ZLinkRequest = z.object({
    id            : z.number({ required_error: 'El id de solicitud es requerido' }),
    askedPet      : ZPetLinkRequestInfo,
    requestingUser: ZUserInfo,
});

export type ILinkRequest = z.infer<typeof ZLinkRequest>;

export const ZNewLinkRequest = z.object({
    userId: z.string().pipe(z.number({ invalid_type_error: "El id no es válido", required_error: "El id es requerido" })),
    petId : z.string().pipe(z.number({ invalid_type_error: "El id no es válido", required_error: "El id es requerido" })),
});

export type INewLinkRequest = z.infer<typeof ZNewLinkRequest>;
