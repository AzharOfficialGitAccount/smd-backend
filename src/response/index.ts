import { Request, Response } from 'express';
import httpStatus from 'http-status';
import fs from 'fs';
import path from 'path';

const basename = path.basename(__filename);

const lngMsg: Record<string, any> = {};

fs.readdirSync(path.join(__dirname, 'lng')).filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-5) === '.json');
}).forEach(file => {
    const fileName = file.slice(0, -5);
    const lng = require(path.join(__dirname, 'lng', file));
    lngMsg[fileName] = lng;
});

interface ErrorResponse {
    msgCode: string;
    data?: any;
}

interface SuccessResponse {
    msgCode: string;
    data?: any;
}

const jsonResponse = (res: Response, data: any, code: number) => {
    return res.status(code).json(data);
};

export const error = (req: Request, res: Response, error: ErrorResponse, code: number = 500) => {
    const lng = req.headers['accept-language'] || 'en';
    const httpStatusCodes: any = httpStatus;
    const response = {
        success: false,
        message: 'failure',
        result: {
            code,
            message: (lngMsg[lng] ? lngMsg[lng][error.msgCode] : lngMsg.en[error.msgCode]) || error.msgCode || httpStatusCodes[code],
        },
        time: Date.now(),
    };
    return jsonResponse(res, response, code);
};

export const success = (req: Request, res: Response, result: SuccessResponse, code: number = 201) => {
    const lng = req.headers['accept-language'] || 'en';
    const httpStatusCodes: any = httpStatus;
    const response = {
        success: true,
        message: 'success',
        result: {
            code,
            message: (lngMsg[lng] ? lngMsg[lng][result.msgCode] : lngMsg.en[result.msgCode]) || httpStatusCodes[code],
            data: result.data,
        },
        time: Date.now(),
    };
    const errorCode = 201;
    return jsonResponse(res, response, errorCode || 201);
};

export const sendInvalidTokenError = (req: Request, res: Response, error: ErrorResponse, code: number = 401) => {
    const lng = req.headers['accept-language'] || 'en';
    const httpStatusCodes: any = httpStatus;
    const response = {
        success: false,
        message: 'failure',
        result: {
            code,
            message: (lngMsg[lng] ? lngMsg[lng][error.msgCode] : lngMsg.en[error.msgCode]) || error.msgCode || httpStatusCodes[code],
        },
        time: Date.now()
    };
    const errorCode = 401;
    res.status(errorCode || 401).json(response);
}
