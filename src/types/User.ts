import * as z from 'zod';
import { type TPetBehavior, type TPetType } from './Pet';
import { ZLinkRequest } from './LinkRequest';

export const cookiesLifeTime = 3600 * 7 * 24;

const UserRoleEnum = z.enum(["USER", "ADMIN"], { invalid_type_error: 'El rol no es válido' });

const ZPostInfo = z.object({
    id         : z.number({ required_error: 'El id de la publicación es requerido' }),
    createdAt  : z.date(),
    description: z.string({ required_error: 'La descripción es requerida', invalid_type_error: 'La descripción debe ser un texto' }).trim().max(999, 'La descripción es demasiado larga'),
    images     : z.array(z.string({ invalid_type_error: 'La imagen debe ser un texto' })).default([]),
    petId      : z.union([z.number({ invalid_type_error: 'El id de la mascota debe ser un número' }), z.null()]),
});

export type IPostInfo = z.infer<typeof ZPostInfo>;

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

export const ZPetInfo = z.object({
    id       : z.number({ required_error: 'El id de la mascota es requerido' }),
    name     : z.string({ required_error: 'El nombre es requerido', invalid_type_error: 'El nombre debe ser texto' }).trim().min(3).max(20),
    petType  : PetTypeEnum,
    image    : z.union([z.string({ invalid_type_error: 'La imagen debe ser un texto' }), z.null()]),
    behaviors: z.array(PetBehaviorEnum).min(1, 'Tu mascota debe tener al menos un atributo'),
});

export type IPetInfo = z.infer<typeof ZPetInfo>;

export const animals: Record<TPetType, string> = {
    dog: "perro",
    cat: "gato",
    horse: "caballo",
    rabbit: "conejo",
    monkey: "mono",
    turtle: "tortuga",
    goat: "cabra",
    bird: "pájaro",
    fish: "pez",
    pig: "cerdo",
    hedgehog: "erizo",
    other: "otro",
};

export const attitudes: Record<TPetBehavior, string> = {
    funny: "se divirtió...",
    happy: "fue feliz...",
    angry: "se enojó...",
    eater: "se comió...",
    dramatic: "hizo un drama...",
    eager: "se emocionó...",
};

export const getPetAttitude = (pet?: IPetInfo): string =>
    (pet)
        ? `Hoy mi ${animals[pet.petType]} ${pet.name} ${attitudes[pet.behaviors.at(pet.behaviors.length > 1 ? Math.floor(Math.random() * pet.behaviors.length - 1) : 0)!]}`
        : `Hoy mi mascota...`

export const ZUser = z.object({
    id          : z.number({ required_error: 'El id de usuario es requerido' }),
    image       : z.union([z.string({ invalid_type_error: 'La imagen debe ser un texto' }), z.null()]),
    createdAt   : z.date({ required_error: 'La fecha de creación del usuario es requerida', invalid_type_error: 'La fecha de creación del usuario no es válida' }),
    email       : z.string({ required_error: 'El correo es requerido', invalid_type_error: 'El correo debe ser texto' }).trim().toLowerCase().email('El correo no es válido'),
    name        : z.string({ required_error: 'El nombre es requerido', invalid_type_error: 'El nombre debe ser texto' }).trim().min(2, 'El nombre es muy corto'),
    bio         : z.union([z.string({ invalid_type_error: 'La bio debe ser texto' }).trim().min(10, 'La bio es muy corta'), z.null()]),
    role        : UserRoleEnum,
    pets        : z.array(ZPetInfo),
    following   : z.array(ZPetInfo),
    posts       : z.array(ZPostInfo),
    linkRequests: z.array(ZLinkRequest),
});

export type IUser = z.infer<typeof ZUser>;

export const ZEditUser = z.object({
    image: z.string({ invalid_type_error: 'La imagen debe ser un texto' }).optional(),
    bio  : z.string({ invalid_type_error: 'La bio debe ser texto' }).trim().min(10, 'La bio es muy corta').optional(),
});

export type IEditUser = z.infer<typeof ZEditUser>;

export const ZNewUser = z.object({
    email: z.string({ required_error: 'El correo es requerido', invalid_type_error: 'El correo debe ser texto' }).trim().toLowerCase().email('El correo no es válido'),
    name : z.string({ required_error: 'El nombre es requerido', invalid_type_error: 'El nombre debe ser texto' }).trim(),
    image: z.string({ invalid_type_error: 'La imagen debe ser un texto' }).optional(),
    role : UserRoleEnum.optional().default("USER"),
});

export type INewUser = z.infer<typeof ZNewUser>;

export const userSeed: INewUser[] = [
    {
        email: "miguellfasanellap@gmail.com",
        name: "Miguel Fasanella",
        role: "ADMIN",
    },
    {
        email: "alejandroperez@hotmail.com",
        name: "Alejandro Perez",
        role: "ADMIN",
    },
    {
        email: "martinanarc@hotmail.com",
        name: "Martinita Narci",
        role: "USER",
    },
    {
        email: "oliviamartinez@gmail.com",
        name: "Olivia Martinez",
        role: "USER",
    },
    {
        email: "jeanff@gmail.com",
        name: "Jean Fasanella",
        role: "USER",
    },
];
