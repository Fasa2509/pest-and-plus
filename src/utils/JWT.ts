import jwt from 'jsonwebtoken';
import type { AstroCookies } from 'astro';

import { type IUser } from '@/types/User';
import { AuthError, ParsingError } from '@/errors/index';

export const signToken = (payload: Pick<IUser, 'id' | 'email' | 'role' | 'name'>, loginToken: boolean): string | undefined => {
    try {
        if (!globalThis.process.env.JWT_SEED) throw new ParsingError('No hay seed de JWT', 400);

        const userInfo = payload;

        return jwt.sign(userInfo,
            globalThis.process.env.JWT_SEED, {
            noTimestamp: true,
        });
    } catch (error: unknown) {
        console.log(error);
        return undefined;
    };
};

export const decodeToken = async (token: string): Promise<Pick<IUser, 'id' | 'email' | 'role' | 'name'> | undefined> => {

    try {
        if (!globalThis.process.env.JWT_SEED) throw new ParsingError('No hay seed de JWT', 400);

        return new Promise((resolve, reject) => {
            jwt.verify(token, globalThis.process.env.JWT_SEED!, (err, payload) => {
                if (err) {
                    console.log(err)
                    return reject(new AuthError('Ocurrió un error iniciando sesión', 403))
                };

                return resolve(payload as Pick<IUser, 'id' | 'email' | 'role' | 'name'> & { exp: number });
            });
        });
    } catch (error: unknown) {
        console.log(error);
        return undefined;
    };
};


export const checkUserValidSession = async ({ cookies }: { cookies: AstroCookies }): Promise<Pick<IUser, 'id' | 'email' | 'role' | 'name'>> => {
    const token = cookies.get("auth-token");

    if (!token) throw new AuthError("No has iniciado sesión", 403);

    const userInfo = await decodeToken(token.value);

    if (!userInfo) throw new AuthError("La información de usuario no es válida", 403);

    return userInfo;
};

export const safeCheckUserValidSession = async ({ cookies }: { cookies: AstroCookies }): Promise<Pick<IUser, 'id' | 'email' | 'role' | 'name'> | undefined> => {
    const token = cookies.get("auth-token");

    if (!token) return;

    const userInfo = await decodeToken(token.value);

    if (!userInfo) return;

    return userInfo;
};

export const checkUserValidCookies = async ({ cookies, params }: { cookies: AstroCookies, params: Record<string, string | undefined> }): Promise<number> => {
    let userId = Number(params.userId);

    const token = cookies.get("auth-token");

    if (!token) throw new AuthError("No has iniciado sesión", 403);

    const userInfo = await decodeToken(token.value);

    if (!userInfo) throw new AuthError("La información de usuario no es válida", 403);

    if (userId !== userInfo.id) throw new AuthError("El id de usuario no coincide", 403);

    return userId;
};
