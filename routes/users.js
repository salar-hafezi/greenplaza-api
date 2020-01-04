const { users_actions } = require('../constants/index');
const messages = require('../constants/messages');
const handlers = require('../controllers/users');

module.exports = router => {
    router.post('/users', async ctx => {
        if (ctx.query.action) {
            switch (ctx.query.action) {
                case users_actions.REGISTER:
                    await handlers.registerHandler(ctx);
                    break;
                case users_actions.CONFIRM_ACCOUNT:
                    await handlers.confirmAccountHandler(ctx);
                    break;
                case users_actions.LOGIN:
                    handlers.loginHandler(ctx);
                    break;
                case users_actions.RESET_PASSWORD:
                    handlers.resetPasswordHandler(ctx);
                    break;
                default:
                    ctx.status = 400;
                    ctx.body = {
                        message: messages.users.INVALID_ACTION
                    };
                    break;
            }
        } else {
            ctx.status = 400;
            ctx.body = {
                message: messages.users.ACTION_REQUIRED
            }
        }
    });
    router.get('/users', async ctx => {
        if (ctx.query.action) {
            switch (ctx.query.action) {
                case users_actions.CONFIRM_ACCOUNT_OTAC:
                    await handlers.confirmAccountOtacHandler(ctx);
                    break;

                default:
                    ctx.status = 400;
                    ctx.body = {
                        message: messages.users.INVALID_ACTION
                    };
                    break;
            }
        } else {
            ctx.status = 400;
            ctx.body = {
                message: messages.users.ACTION_REQUIRED
            }
        }
    });
}
