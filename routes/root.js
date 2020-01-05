const authMiddleware = require('../lib/middleware/auth');

module.exports = router => {
    router.get('/', authMiddleware, ctx => {
        ctx.status = 200;
        ctx.body = {
            metadata: {
                resources: [
                    {
                        title: 'users',
                        href: '/{apiVersion}/users'
                    }
                ]
            }
        }
    })
};
