import z from 'zod';

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

export const ValidPetBehavior = PetBehaviorEnum.options;
export type TPetBehavior = z.infer<typeof PetBehaviorEnum>;

export enum EnumPetBehaviorTranslations {
    "divertid@" = "divertid@",
    "feliz" = "feliz",
    "enojón" = "enojón",
    "comelón" = "comelón",
    "dramátic@" = "dramátic@",
    "ansios@" = "ansios@",
}

export const petBehaviorTranslations: Record<TPetBehavior, EnumPetBehaviorTranslations> = {
    funny: EnumPetBehaviorTranslations['divertid@'],
    happy: EnumPetBehaviorTranslations.feliz,
    angry: EnumPetBehaviorTranslations.enojón,
    eater: EnumPetBehaviorTranslations.comelón,
    dramatic: EnumPetBehaviorTranslations['dramátic@'],
    eager: EnumPetBehaviorTranslations['ansios@'],
} as const;

type ReverseTPetBehavior = typeof petBehaviorTranslations[keyof typeof petBehaviorTranslations];

export const reversePetBehaviorTranslations: Record<ReverseTPetBehavior, TPetBehavior> = {
    'divertid@': "funny",
    'feliz': "happy",
    'enojón': "angry",
    'comelón': "eater",
    'dramátic@': "dramatic",
    'ansios@': "eager",
} as const;

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


export enum EnumPetTypeTranslations {
    Perro = "Perro",
    Gato = "Gato",
    Caballo = "Caballo",
    Conejo = "Conejo",
    Mono = "Mono",
    Tortuga = "Tortuga",
    Cabra = "Cabra",
    Ave = "Ave",
    Cerdo = "Cerdo",
    Pez = "Pez",
    Erizo = "Erizo",
    Otro = "Otro",
}

export const petTypeTranslations: Record<TPetType, EnumPetTypeTranslations> = {
    dog: EnumPetTypeTranslations.Perro,
    cat: EnumPetTypeTranslations.Gato,
    horse: EnumPetTypeTranslations.Caballo,
    rabbit: EnumPetTypeTranslations.Conejo,
    monkey: EnumPetTypeTranslations.Mono,
    turtle: EnumPetTypeTranslations.Tortuga,
    goat: EnumPetTypeTranslations.Cabra,
    bird: EnumPetTypeTranslations.Ave,
    pig: EnumPetTypeTranslations.Cerdo,
    fish: EnumPetTypeTranslations.Pez,
    hedgehog: EnumPetTypeTranslations.Erizo,
    other: EnumPetTypeTranslations.Otro,
} as const;

type ReverseTPetType = typeof petTypeTranslations[keyof typeof petTypeTranslations];

export const reversePetTypeTranslations: Record<ReverseTPetType, TPetType> = {
    "Perro": "dog",
    "Gato": "cat",
    "Caballo": "horse",
    "Conejo": "rabbit",
    "Mono": "monkey",
    "Tortuga": "turtle",
    "Cabra": "goat",
    "Ave": "bird",
    "Cerdo": "pig",
    "Pez": "fish",
    "Erizo": "hedgehog",
    "Otro": "other",
} as const;

export const ValidPetType = PetTypeEnum.options;
export type TPetType = z.infer<typeof PetTypeEnum>;

export const ZUserInfo = z.object({
    id   : z.number({ required_error: 'El id de usuario es requerido' }),
    image: z.union([z.string({ invalid_type_error: 'La imagen debe ser un texto' }), z.null()]),
    name : z.string({ required_error: 'El nombre es requerido', invalid_type_error: 'El nombre debe ser texto' }).trim().min(2, 'El nombre es muy corto'),
});

export type IUserInfo = z.infer<typeof ZUserInfo>;

const ZPostInfo = z.object({
    id         : z.number({ required_error: 'El id de la publicación es requerido' }),
    createdAt  : z.date(),
    description: z.string({ required_error: 'La descripción es requerida', invalid_type_error: 'La descripción debe ser un texto' }).trim().max(999, 'La descripción es demasiado larga'),
    images     : z.array(z.string({ invalid_type_error: 'La imagen debe ser un texto' })).default([]),
    authorId   : z.number({ required_error: 'El id del autor es requerido' }),
});

export const ZPet = z.object({
    id       : z.number({ required_error: 'El id de la mascota es requerido' }),
    name     : z.string({ required_error: 'El nombre es requerido', invalid_type_error: 'El nombre debe ser texto' }).trim().min(3).max(20),
    image    : z.union([z.string({ invalid_type_error: 'La imagen debe ser un texto' }), z.null()]),
    petType  : PetTypeEnum,
    bio      : z.union([z.string({ invalid_type_error: 'La bio debe ser texto' }).trim().min(10, 'La bio es muy corta'), z.null()]),
    behaviors: z.array(PetBehaviorEnum).min(1, 'Tu mascota debe tener al menos un atributo'),
    createdAt: z.date(),
    owners   : z.array(ZUserInfo),
    followers: z.array(ZUserInfo),
    posts    : z.array(ZPostInfo),
    creator  : ZUserInfo,
});

export type IPet = z.infer<typeof ZPet>;

export const ZNewPet = z.object({
    name     : z.string({ invalid_type_error: "El nombre de la mascota debe ser texto", required_error: 'El nombre de la mascota es requerido' }).trim().min(2, 'El nombre de tu mascota es muy corto').max(20),
    image    : z.union([z.string({ invalid_type_error: 'La imagen debe ser un texto' }), z.null()]),
    bio      : z.string({ invalid_type_error: 'La bio debe ser texto' }).trim().min(10, 'La bio es muy corta').optional(),
    petType  : PetTypeEnum,
    published: z.boolean({ invalid_type_error: 'El estado de la mascota debe ser un booleano' }).default(false).optional(),
    behaviors: z.array(PetBehaviorEnum).min(1, 'Tu mascota debe tener al menos un atributo'),
    owners   : z.array(z.number()).min(1, 'La mascota debe tener al menos un dueño'),
    creatorId: z.number({ invalid_type_error: 'El id de usuario no es válido', required_error: 'El id del usuario es requerido' }),
});

export type INewPet = z.infer<typeof ZNewPet>;

export const ZUpdatePet = z.object({
    name     : z.string({ invalid_type_error: "El nombre de la mascota debe ser texto", required_error: 'El nombre de la mascota es requerido' }).trim().min(2, 'El nombre de tu mascota es muy corto').max(20),
    image    : z.union([z.string({ invalid_type_error: 'La imagen debe ser un texto' }), z.null()]),
    bio      : z.string({ invalid_type_error: 'La bio debe ser texto' }).trim().min(10, 'La bio es muy corta'),
    behaviors: z.array(PetBehaviorEnum).min(1, 'Tu mascota debe tener al menos un atributo'),
});

export type IUpdatePet = z.infer<typeof ZUpdatePet>;

export const getRandomImg = () => {
    const images = [
        "/src/assets/dog-1.jpg",
        "/src/assets/dog-2.jpg",
        "/src/assets/rabbit-1.jpg",
        "/src/assets/horse-1.jpg",
        "/src/assets/bird-1.jpg",
    ];

    return images.at(Math.ceil((Math.random() * images.length) - 1)) || null;
};

export const petSeed: Array<Omit<INewPet, "creatorId">> = [
    {
        name: "Maya",
        behaviors: [
            "angry",
            "eater",
        ],
        petType: 'dog',
        owners: [1],
        image: null,
        bio: "system planning ate flower habit rhythm fierce tongue imagine its hope station column behavior pound rocky exciting so expression night seeing better suit history"
    },
    {
        name: "Missi",
        behaviors: [
            "dramatic",
            "eater"
        ],
        petType: 'dog',
        owners: [2],
        image: null,
    },
    {
        name: "Canela",
        behaviors: [
            "angry",
            "eager",
            "happy"
        ],
        petType: 'dog',
        owners: [4],
        image: `Enim ullamco ullamco enim amet laborum ullamco ipsum incididunt incididunt ipsum commodo sunt dolor. Cillum labore dolore mollit ad. Ex deserunt duis mollit ut ipsum est ullamco non incididunt. Amet eiusmod quis mollit cillum.

Duis irure sunt anim veniam laboris. Incididunt quis culpa fugiat Lorem non veniam occaecat do irure. Voluptate ut proident esse deserunt elit adipisicing est amet in.`,
    },
    {
        name: "Mancha",
        behaviors: [
            "funny",
            "happy"
        ],
        petType: 'dog',
        owners: [4],
        image: null,
    },
    {
        name: "Ticher",
        behaviors: [
            "dramatic",
            "funny",
            "eater"
        ],
        petType: 'dog',
        owners: [3],
        image: null,
    },
];
