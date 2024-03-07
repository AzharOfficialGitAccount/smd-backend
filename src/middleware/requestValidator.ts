import * as response from '../response/index';
import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { Schema, ValidationError } from 'joi';

interface ValidatedRequest extends Request {
    [key: string]: any;
}

const reqValidator = (schema: Schema, source = 'body') => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const data = (req as ValidatedRequest)[source];
    try {
        const validatedValues = await schema.validate(data, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        });
        if (validatedValues.error) {
            const { details } = validatedValues.error as ValidationError;
            const message = details.map((i: { message: string }) => i.message).join(',');
            return response.error(req, res, { msgCode: message, data: message }, httpStatus.BAD_REQUEST);
        }
        (req as ValidatedRequest)[source] = validatedValues.value;
    } catch (err) {
        console.log(err);
        return response.error(req, res, { msgCode: 'INTERNAL_SERVER_ERROR' }, httpStatus.INTERNAL_SERVER_ERROR);
    }
    return next();
};
export {
    reqValidator
};
