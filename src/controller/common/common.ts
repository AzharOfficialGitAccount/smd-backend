import { Request, Response } from 'express';
import * as response from '../../response/index';
import * as httpStatus from 'http-status';
import * as model from '../../model';
import * as commonService from '../../services/common';
import * as commonConstant from '../../constant/common';
import * as helper from '../../utils/helper';
import moment from 'moment-timezone';
interface LoginData {
    deviceDetails: {
        deviceId: string;
        deviceToken: string;
        deviceType: string;
    };
    authDetails: {
        _id: string;
        token: string;
        userName: string;
        email: string;
    };
}
interface CustomRequest extends Request {
    loginData: LoginData;
}

export const createSession = async (req: CustomRequest, res: Response) => {
    try {
        const { deviceId, deviceToken } = req.loginData.deviceDetails;
        const condition = { deviceId };
        const { Session } = model;
        const checkSession = await commonService.getByCondition(Session, condition);

        if (checkSession) {
            await commonService.updateByCondition(Session, condition, {
                lastLoginDate: moment().valueOf(),
                accessToken: req.loginData.authDetails.token,
            });
        } else {
            const sessionData = {
                userId: req.loginData.authDetails._id,
                deviceId,
                deviceToken,
                deviceType: commonConstant.DeviceType.Android,
                accessToken: req.loginData.authDetails.token,
            };
            const createSession = await commonService.create(Session, sessionData);

            if (!createSession) {
                return response.error(req, res, { msgCode: helper.getErrorMsgCode(req) }, httpStatus.FORBIDDEN);
            }
        }
        const { ...data } = req.loginData.authDetails;
        const msgCode = helper.getSuccessMsgCode(req);
        const resData = { userName: data.userName, email: data.email, token: data.token };

        return response.success(req, res, { msgCode, data: resData }, httpStatus.OK);
    } catch (err) {
        console.error(err);
        return response.error(req, res, { msgCode: 'SOMETHING_WRONG' }, httpStatus.INTERNAL_SERVER_ERROR);
    }
};
