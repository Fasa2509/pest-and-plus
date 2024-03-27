import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

import { EndpointErrorHandler, ValidationError } from "@/errors";
import { CustomResponse, type ApiResponsePayload, ValidExtensions, type ImageType, ValidImageType, type ApiResponse } from "@/types/Api";
import { checkUserValidSession } from "@/utils/JWT";
import type { APIRoute } from "astro";


const region = process.env.S3_UPLOAD_REGION;
const bucketName = process.env.S3_UPLOAD_BUCKET || '';
const Bucket = bucketName;
const accessKeyId = process.env.S3_UPLOAD_KEY || '';
const secretAccessKey = process.env.S3_UPLOAD_SECRET || '';


const IMAGE_TYPE_DICT: Record<ImageType, string> = {
    pet: "pet/",
    post: "post/",
    profile: "profile/",
};


export const POST: APIRoute = async ({ cookies, request }) => {
    try {
        if (!process.env.S3_BASE_URL) throw new ValidationError("No hay URL base de S3", 500);

        await checkUserValidSession({ cookies });

        const body = await request.json() as { rscname: string; imageType: ImageType; };

        if (!body.rscname) throw new ValidationError("El nombre del archivo no es válido", 400);
        if (!body.imageType || !ValidImageType.includes(body.imageType)) throw new ValidationError("El tipo de imagen no es válido", 400);

        let extension = body.rscname.split(".").at(-1) || "";

        if (!ValidExtensions.includes(extension)) throw new ValidationError("La extensión del archivo no es válida", 400);

        let Key = IMAGE_TYPE_DICT[body.imageType] + crypto.randomUUID() + "." + extension;

        const client = new S3Client({
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            region,
        });

        const command = new PutObjectCommand({
            Key,
            Bucket,
        });

        const url = await getSignedUrl(client, command, { expiresIn: 60 });

        return CustomResponse<ApiResponsePayload<{ url: string; objectKey: string; }>>({
            error: false,
            message: ["URL obtenida"],
            payload: {
                url,
                objectKey: process.env.S3_BASE_URL + "/" + Key,
            },
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: "Ocurrió un error generando la imagen" });
    };
};


export const DELETE: APIRoute = async ({ url }) => {

    try {
        const Key = Object.fromEntries(url.searchParams.entries()).Key;

        const imageType = Key.split("/").at(0) as ImageType;

        if (!Key || !ValidImageType.includes(imageType)) throw new ValidationError("La llave de la imagen no es válida", 400);

        const client = new S3Client({
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            region,
        });

        const command = new DeleteObjectCommand({
            Key,
            Bucket,
        });

        await client.send(command, { requestTimeout: 60 });

        return CustomResponse<ApiResponse>({
            error: false,
            message: ["La imagen fue eliminada"],
        });
    } catch (error: unknown) {
        return EndpointErrorHandler({ error, defaultErrorMessage: "Ocurrió un problema eliminando la imagen anterior" });
    }

};
