const routers = require('../routers');

module.exports = (app) => {
    app.use('/home', routers.home);
    app.use('/', routers.home);

    app.use('/user', routers.user);

   app.use('/trip', routers.trip);

    app.use('*', (req, res, next) => {
        res.render('404')
    })
};