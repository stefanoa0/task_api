const app = require('express')();
const db = require('./config/db.js');
const consign = require('consign');

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app);

app.db = db;

app.get('/', (req, res, next) => {
    console.log(req.headers);
});

app.listen(3000, () => {
    console.log('Backend executando');
});