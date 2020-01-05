const Joi = require('@hapi/joi');
const {
    NAME_MIN_LENGTH,
    NAME_MAX_LENGTH,
    NAME_REGEX,
    MOBILE_LENGTH,
    MOBILE_REGEX,
    PASSWORD_REGEX,
    OTAC_LENGTH
} = require('../../constants/index');

const name_schema = Joi.string()
    .min(NAME_MIN_LENGTH)
    .max(NAME_MAX_LENGTH)
    .pattern(new RegExp(NAME_REGEX))
    .required();

const mobile_schema = Joi.string().error(new Error('mobile is required'))
    .length(MOBILE_LENGTH)
    .pattern(new RegExp(MOBILE_REGEX))
    .required();

const password_schema = Joi.string()
    .pattern(new RegExp(PASSWORD_REGEX))
    .required();

const otac_schema = Joi.string()
    .length(OTAC_LENGTH)
    .required();

const registerSchema = Joi.object().keys({
    first_name: name_schema,
    last_name: name_schema,
    mobile: mobile_schema,
    password: password_schema
});

const loginSchema = Joi.object().keys({
    mobile: mobile_schema,
    password: password_schema
});

const confirmAccountSchema = Joi.object().keys({
    mobile: mobile_schema,
    confirm_req_otac: otac_schema
});

module.exports = {
    registerSchema,
    mobile_schema,
    confirmAccountSchema,
    loginSchema
};
