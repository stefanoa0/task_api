const { authSecret } = require('../.env');
const passport = require('passport')
const passport_jwt = require('passport-jwt');
const { Strategy, ExtractJwt } = passport_jwt

module.exports = app => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };
    
    const strategy = new Strategy(params, (payload, done) => {
        app.db('users').where({ id: payload.id })
            .first()
            .then(user => {
                if (!user) {
                    done(null, false);
                }
                done(null, { id: user.id, email: user.email });
            })
            .catch(err => done(err, false))
    });
    
    passport.use(strategy);
    
    return {
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate('jwt', { session: false }),
    }
}