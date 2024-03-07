import Joi from 'joi';

const login = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    deviceToken: Joi.string().required(),
    deviceId: Joi.string().required(),
    deviceType: Joi.string().default('web').optional()
});

const register = Joi.object({
    email: Joi.string().allow(''),
    userName: Joi.string().allow(''),
    mobile: Joi.number().allow(''),
    profilePic: Joi.string().allow(''),
    password: Joi.string().required(),
});

const profile = Joi.object({
    email: Joi.string().allow(''),
    userName: Joi.string().allow(''),
    profilePic: Joi.string().allow(''),
    mobile: Joi.number().allow(),
});

export {
    login,
    register,
    profile,
};
