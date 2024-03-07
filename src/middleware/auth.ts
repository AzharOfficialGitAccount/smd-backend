import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import * as response from '../response/index';
import httpStatus from 'http-status';
import * as commonService from '../services/common';
import { User, Session } from '../model';
import { env } from '../constant/environment';

export const generateAuthJwt = (payload: { expiresIn: string;[key: string]: any }): string | false => {
    const { expiresIn, ...params } = payload;
    const token = jwt.sign(params, env.SECRET_KEY || '', { expiresIn });
    if (!token) {
        return false;
    }
    return token;
};

export const verifyAuthToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return response.error(req, res, { msgCode: 'MISSING_TOKEN' }, httpStatus.UNAUTHORIZED);
        }
        const cleanedToken = token.replace(/^Bearer\s+/, '');
        const decoded: any = jwt.decode(cleanedToken);

        const sessionModel = Session;
        const UserModel = User;
        const condition = { accessToken: cleanedToken };
        const userId = (decoded as any).userId || (decoded as any)._id;

        const checkJwt = await commonService.getByCondition(sessionModel, condition);
        if (!checkJwt) {
            const userCondition = { _id: userId, isActive: false, isDeleted: true };
            const checkUser = await commonService.getByCondition(UserModel, userCondition);

            if (checkUser) {
                return response.error(req, res, { msgCode: 'USER_IS_DELETED' }, httpStatus.UNAUTHORIZED);
            }
            return response.error(req, res, { msgCode: 'INVALID_TOKEN' }, httpStatus.UNAUTHORIZED);
        } else {
            const userCondition = { _id: checkJwt.userId, isDeleted: false, isActive: true };
            const checkUser = await commonService.getByCondition(UserModel, userCondition);

            if (!checkUser) {
                return response.error(req, res, { msgCode: 'USER_IS_BLOCKED' }, httpStatus.UNAUTHORIZED);
            }
            (req as any).data = decoded;
            return next();
        }
    } catch (err) {
        console.error(err);
        return response.error(req, res, { msgCode: 'SOMETHING_WRONG' }, httpStatus.INTERNAL_SERVER_ERROR);
    }
};