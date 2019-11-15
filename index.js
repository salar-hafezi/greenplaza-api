// load env vars
require('dotenv').config();

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');

const generalErrorHandler = require('./lib/middleware/error_handler');
const setRoutes = require('./routes');
const getDB = require('./lib/helpers/setup_db');

const PORT = parseInt(process.env.PORT);
const app = new Koa();

if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test')
    app.use(require('koa-logger')());

// db setup
const db = getDB();
app.context.db = db;
// server setup
app.use(cors());
app.use(helmet());
app.use(bodyParser());
app.use(generalErrorHandler);
setRoutes(app);

const server = app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});

module.exports = {
    server,
};
