const bcrypt = require('bcrypt');
const {
    registerSchema,
    mobile_schema,
    confirmAccountSchema,
    loginSchema
} = require('../schemes/users/index');
const {
    retrieveOneWithMobile,
    createNew,
    updateConfirmOtac,
    updateConfirmAccount,
} = require('../data/users/index');
const messages = require('../constants/messages');
const { users_statuses, users_types, users_otac_config } = require('../constants/index');
const { SALT_ROUNDS } = require('../constants/index');
const { generateOtac } = require('../lib/helpers/utils');
const JWTHelper = require('../lib/helpers/jwt');

const registerHandler = async ctx => {
    try {
        const validation_result = registerSchema.validate(ctx.request.body);
        if (validation_result.error) {
            ctx.status = 400;
            ctx.body = {
                message: validation_result.error.message
            };
        } else {
            const { first_name, last_name, mobile, password } = ctx.request.body;
            const alreadyExistingUser = await retrieveOneWithMobile({
                db: ctx.db,
                mobile: mobile
            });
            if (alreadyExistingUser) {
                ctx.status = 409;
                ctx.body = {
                    message: messages.users.ALREADY_EXISTS
                };
            } else {
                const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
                if (password_hash) {
                    const newUser = await createNew({
                        db: ctx.db,
                        first_name: first_name.trim().toLowerCase(),
                        last_name: last_name.trim().toLowerCase(),
                        mobile,
                        password_hash,
                        status: users_statuses.UNCONFIRMED,
                        type: users_types.NORMAL
                    });
                    if (newUser) {
                        ctx.status = 201;
                        ctx.body = {
                            id: newUser.id,
                            first_name: newUser.first_name,
                            last_name: newUser.last_name,
                            mobile: newUser.mobile,
                            status: newUser.status,
                            type: newUser.type
                        };
                    } else {
                        ctx.status = 500;
                        ctx.body = {
                            message: messages.server.SERVER_ERROR
                        };
                    }
                } else {
                    ctx.status = 500;
                    ctx.body = {
                        message: messages.server.SERVER_ERROR
                    };
                }
            }
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            message: error.message
        };
    }
};

const confirmAccountOtacHandler = async ctx => {
    try {
        const { mobile } = ctx.query;
        const validation_result = mobile_schema.validate(mobile);
        if (validation_result.error) {
            ctx.status = 400;
            ctx.body = {
                message: validation_result.error.message
            };
        } else {
            const user = await retrieveOneWithMobile({
                db: ctx.db,
                mobile: mobile
            });
            if (user) {
                let { last_confirm_req, confirm_req_attempts, status } = user;
                if (status === users_statuses.CONFIRMED) {
                    ctx.status = 409;
                    ctx.body = {
                        message: messages.users.ALREADY_CONFIRMED
                    };
                } else {
                    if (confirm_req_attempts < users_otac_config.CONFIRM_OTAC_ATTEMPTS) {
                        const confirm_req_otac = generateOtac();
                        confirm_req_attempts += 1;
                        const updated_user = await updateConfirmOtac({
                            db: ctx.db,
                            confirm_req_attempts,
                            confirm_req_otac,
                            mobile
                        });
                        if (updated_user) {
                            ctx.status = 200;
                            ctx.body = {
                                mobile: updated_user.mobile,
                                confirm_req_otac: updated_user.confirm_req_otac
                            };
                        } else {
                            ctx.status = 500;
                            ctx.body = {
                                message: messages.server.SERVER_ERROR
                            };
                        }
                    } else {
                        const now = new Date().getTime();
                        const then = new Date(last_confirm_req).getTime();
                        if ((now - then) / 1000 > users_otac_config.CONFIRM_OTAC_INTERVAL) {
                            const confirm_req_otac = generateOtac();
                            confirm_req_attempts = 1;
                            const updated_user = await updateConfirmOtac({
                                db: ctx.db,
                                confirm_req_attempts,
                                confirm_req_otac,
                                mobile
                            });
                            if (updated_user) {
                                ctx.status = 200;
                                ctx.body = {
                                    mobile: updated_user.mobile,
                                    confirm_req_otac: updated_user.confirm_req_otac
                                };
                            } else {
                                ctx.status = 500;
                                ctx.body = {
                                    message: messages.server.SERVER_ERROR
                                };
                            }
                        } else {
                            ctx.status = 429;
                            ctx.body = {
                                message: messages.server.TOO_MANY_REQUESTS
                            };
                        }
                    }
                }
            } else {
                ctx.status = 404;
                ctx.body = {
                    message: messages.users.NOT_FOUND
                };
            }
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            message: error.message
        };
    }
};

const confirmAccountHandler = async ctx => {
    try {
        const validation_result = confirmAccountSchema.validate(ctx.request.body);
        if (validation_result.error) {
            ctx.status = 400;
            ctx.body = {
                message: validation_result.error.message
            };
        } else {
            const { mobile, confirm_req_otac } = ctx.request.body;
            const user = await retrieveOneWithMobile({
                db: ctx.db,
                mobile: mobile
            });
            if (user) {
                let { status, confirm_req_otac: otac } = user;
                if (status === users_statuses.UNCONFIRMED) {
                    if (otac === confirm_req_otac) {
                        const updated_user = await updateConfirmAccount({
                            db: ctx.db,
                            status: users_statuses.CONFIRMED,
                            mobile
                        });
                        if (updated_user) {
                            ctx.status = 200;
                            ctx.body = {
                                mobile: updated_user.mobile,
                                status: updated_user.status
                            };
                        } else {
                            ctx.status = 500;
                            ctx.body = {
                                message: messages.server.SERVER_ERROR
                            };
                        }
                    } else {
                        ctx.status = 422;
                        ctx.body = {
                            message: messages.server.UNPROCESSABLE_ENTITY
                        };
                    }
                } else {
                    ctx.status = 409;
                    ctx.body = {
                        message: messages.users.ALREADY_CONFIRMED
                    };
                }
            } else {
                ctx.status = 404;
                ctx.body = {
                    message: messages.users.NOT_FOUND
                };
            }
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            message: error.message
        };
    }
};

const loginHandler = async ctx => {
    try {
        const validation_result = loginSchema.validate(ctx.request.body);
        if (validation_result.error) {
            ctx.status = 400;
            ctx.body = {
                message: validation_result.error.message
            };
        } else {
            const { mobile, password } = ctx.request.body;
            const alreadyExistingUser = await retrieveOneWithMobile({
                db: ctx.db,
                mobile: mobile
            });
            if (alreadyExistingUser) {
                const { status, password_hash, id, type } = alreadyExistingUser;
                if (status === users_statuses.CONFIRMED) {
                    const match = await bcrypt.compare(password, password_hash);
                    if (match) {
                        // create JWT
                        const token = JWTHelper.sign({
                            iss: 'greenPlaza',
                            sub: id,
                            type: type,
                            iat: Date.now(),
                        }, ctx.jwtPrivateKey)
                        if (token && token.length > 0) {
                            ctx.status = 200;
                            ctx.body = {
                                token: token
                            };
                        } else {
                            ctx.status = 500;
                            ctx.body = {
                                message: messages.server.SERVER_ERROR
                            };
                        }
                    } else {
                        ctx.status = 401;
                        ctx.body = {
                            message: messages.users.INVALID_CREDENTIALS
                        };
                    }
                } else {
                    ctx.status = 403;
                    ctx.body = {
                        message: messages.users.FORBIDDEN
                    };
                }
            } else {
                ctx.status = 404;
                ctx.body = {
                    message: messages.users.NOT_FOUND
                };
            }
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            message: error.message
        };
    }
};

const resetPasswordOtacHandler = ctx => {

};

const resetPasswordHandler = ctx => {

};

module.exports = {
    registerHandler,
    confirmAccountOtacHandler,
    confirmAccountHandler,
    loginHandler,
    resetPasswordOtacHandler,
    resetPasswordHandler
};
