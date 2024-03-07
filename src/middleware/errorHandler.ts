import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status';
import * as response from '../response/index';

interface CustomError {
    isJoi?: boolean;
    status?: number;
    response?: {
        data?: {
            error: any;
        };
    };
    errors?: any;
    actionCode?: any;
    message?: string;
    details?: any[];
}

export const notFound = (req: Request, res: Response) => {
    return response.error(req, res, {
        msgCode: 'NOT_FOUND'
    }, HttpStatus.NOT_FOUND);
};

export const methodNotAllowed = (req: Request, res: Response) => {
    return response.error(req, res, {
        msgCode: 'INVALID_ROUTE'
    }, HttpStatus.METHOD_NOT_ALLOWED);
};

export const genericErrorHandler = (err: CustomError | undefined, req: Request, res: Response, next: NextFunction) => {
    if (!err) {
        return next();
    }

    let error: any;
    console.log(err);

    if (err.isJoi) {
        error = {
            code: HttpStatus.BAD_REQUEST,
            message: HttpStatus[HttpStatus.BAD_REQUEST],
            details: err.details
                ? err.details.map((e: any) => ({
                    message: e.message,
                    param: e.path.join('.')
                }))
                : err.errors.map((e: any) => e.messages.join('. ')).join(' and ')
        };
    } else if (err.status === undefined && err.response && err.response.data) {
        const { data: responseData } = err.response;
        if (responseData) {
            ({ error } = responseData);
        }
    } else if (err.status !== undefined && err.status < 500) {
        error = {
            code: err.status,
            message: err.message
        };
        if (err.errors) {
            error.errors = err.errors;
        } else if (err.actionCode) {
            error.actionCode = err.actionCode;
        }
    }
    return response.error(req, res, { msgCode: error.message }, error.code);
};
