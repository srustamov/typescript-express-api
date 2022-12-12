import {randomBytes} from 'crypto'
import {HttpError} from "routing-controllers";
import {SelectQueryBuilder} from "typeorm/query-builder/SelectQueryBuilder";
import {EntityNotFoundError} from "typeorm";

export function env(key: string, fallback: any = null): any {
    let value = process.env[key] ?? fallback;

    switch (value) {
        case "true" :
            return true;
        case "false" :
            return false;
        case "null" :
            return null;
        default :
            return value;
    }
}

export async function randomToken(size: number = 48): Promise<string> {
    return new Promise((resolve, reject) => {
        randomBytes(size, function (err, buffer) {

            if (err) {
                return reject(err)
            }

            resolve(buffer.toString('hex').toUpperCase())
        });
    })
}

export async function errorHandler(err, req, response, next) {
    if (response.headersSent) {
        return next(err)
    }

    if (err instanceof HttpError) {
        return response.status(err.httpCode).send({
            status: false,
            message: err.message,
            //@ts-ignore
            errors: err?.errors
        })
    } else if(err instanceof EntityNotFoundError) {
        return response.status(404).send({
            status: false,
            message: isDebug() ? err.message : 'Object not found',
        })
    }
    else {
        console.error(err.message, err.stack)
    }

    response.status(500).send({
        status: false,
        message: 'Something went wrong!',
        error: isDebug() ? err.message : undefined
    })
}

export function base64Encode(data) {

    const buff = new Buffer(data.toString());

    return buff.toString('base64');
}

export const isDebug = () => process.env.NODE_ENV !== 'production';

export function base64Decode(data) {

    const buff = new Buffer(data, 'base64');

    return buff.toString('ascii');
}

export async function paginate<T>(
    builder: SelectQueryBuilder<T>,
    page: number = 1,
    perPage: number = 15
): Promise<{ total, data: T[], page, perPage }> {

    const count = await builder.getCount();

    page = page || 1;
    perPage = perPage || 15;

    if (count === 0) {
        return {total: count, data: [], page, perPage}
    }
    const data: T[] = await builder
        .offset(page <= 1 ? 0 : ((page - 1) * perPage))
        .limit(perPage)
        .getMany();

    return {
        total: count,
        data,
        page,
        perPage
    }
}