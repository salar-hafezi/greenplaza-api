const Router = require('@koa/router');
const fs = require('fs');
const path = require('path');

const { BASE_URL } = require('../constants/index');

const setRoutes = app => {
    const router = new Router({
        prefix: BASE_URL
    });
    // load all routes
    fs.readdirSync(__dirname)
        .filter(file => file !== 'index.js')
        .forEach(file => require(`./${path.parse(file).name}`)(router));
    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = setRoutes;
