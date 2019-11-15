module.exports = router => {
    router.get('/', ctx => {
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
