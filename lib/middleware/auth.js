const JWTHelper = require('../helpers/jwt');

const authMiddleware = async (ctx, next) => {
    if (!ctx.request.header.authorization) {
        ctx.status = 401;
    } else {
        const token = ctx.request.header.authorization.split(' ')[1];
        const decoded = JWTHelper.verify(token, ctx.jwtPublicKey);
        if (!decoded) {
            ctx.status = 401;
        } else {
            ctx.state.token = decoded;
            return next();
        }
    }
}

module.exports = authMiddleware;
