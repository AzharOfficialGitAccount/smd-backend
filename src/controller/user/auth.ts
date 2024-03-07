import { NextFunction, Request, Response } from 'express';
import * as response from '../../response/index';
import * as httpStatus from 'http-status';
import * as model from '../../model';
import * as commonService from '../../services/common';
import * as passwordHash from '../../utils/password';
import * as authJwt from '../../middleware/auth';
import * as env from '../../constant/environment';
import * as commonCOnstant from '../../constant/common';
import mongoose from 'mongoose';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, userName, mobile, profilePic, password } = req.body;
        const { User } = model;

        const userData = {
            email: email.toLowerCase(),
            mobile,
            profilePic,
            password: await passwordHash.generateHash(password),
            userName,
            userStatus: commonCOnstant.UserType.USER
        };
        
        const checkEmail = await commonService.getByCondition(User, { email });
        if (checkEmail) {
            return response.error(req, res, { msgCode: 'EMAIL_EXIST' }, httpStatus.INTERNAL_SERVER_ERROR);
        }
        const userObj = await commonService.create(User, userData);
        if (userObj) {
            return response.success(req, res, { msgCode: 'USER_CREATED', data: userObj }, httpStatus.OK);
        } else {
            return response.error(req, res, { msgCode: 'USER_CREATION_FAILED' }, httpStatus.INTERNAL_SERVER_ERROR);
        }
    } catch (error) {
        console.error(error);
        return response.error(req, res, { msgCode: 'SOMETHING_WRONG' }, httpStatus.INTERNAL_SERVER_ERROR);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, deviceToken, deviceId, deviceType } = req.body;
        const condition = { email, isDeleted: false, isActive: true };
        const { User } = model;

        const checkUser = await commonService.getByCondition(User, condition);
        if (!checkUser) {
            return response.error(req, res, { msgCode: 'INVALID_CREDENTIALS' }, httpStatus.NOT_FOUND);
        }
        const isLogin = passwordHash.comparePassword(password, checkUser?.password || '');
        if (!isLogin) {
            return response.error(req, res, { msgCode: 'INVALID_CREDENTIALS' }, httpStatus.FORBIDDEN);
        }
        if (!checkUser?.isActive) {
            return response.error(req, res, { msgCode: 'BLOCK_MSG' }, httpStatus.FORBIDDEN);
        }
        const { password: userPassword, ...resultData } = checkUser instanceof mongoose.Document ? checkUser.toObject() : checkUser;

        resultData.token = authJwt.generateAuthJwt({
            id: checkUser?._id,
            expiresIn: (Number(env.TOKEN_EXPIRES_IN) || 0).toString(),
            email,
            deviceId
        });
        if (!resultData.token) {
            return response.error(req, res, { msgCode: 'SOMETHING_WRONG' }, <any>httpStatus.INTERNAL_SERVER_ERROR);
        }
        (req as any).loginData = {
            deviceDetails: { deviceId, deviceToken, deviceType },
            authDetails: resultData
        };
        return next();
    } catch (err: any) {
        console.error(err);
        return response.error(req, res, { msgCode: 'SOMETHING_WRONG' }, <any>httpStatus.INTERNAL_SERVER_ERROR);
    }
};

export const dashboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: string = (req as any).data?.id;
        const { User } = model;

        const projects = { _id: 1, email: 1, userName: 1, mobile: 1, profilePic: 1, roles: 1, address: 1 }
        const adminExists = await commonService.getByCondition(User, { _id: id }, projects);

        if (!adminExists) {
            return <any>response.error(req, res, { msgCode: 'USER_NOT_FOUND' }, httpStatus.NOT_FOUND);
        }
        return <any>response.success(req, res, { msgCode: 'PROFILE_FETCHED', data: adminExists }, httpStatus.OK);
    } catch (error) {
        return <any>response.error(req, res, { msgCode: 'SOMETHING_WRONG' }, httpStatus.INTERNAL_SERVER_ERROR);
    }
};
