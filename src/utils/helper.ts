export const getSuccessMsgCode = (req: any): string => {
    let msgCode;
    if (req.url.slice(1) === 'signup') {
        msgCode = 'SIGNUP_SUCCESSFUL';
    } else {
        msgCode = 'LOGIN_SUCCESSFUL';
    }

    return msgCode;
};

export const getErrorMsgCode = (req: any): string => {
    let msgCode;
    if (req?.url.slice(1) === 'signup') {
        msgCode = 'SIGNUP_FAILED';
    } else {
        msgCode = 'LOGIN_FAILED';
    }

    return msgCode;
};
