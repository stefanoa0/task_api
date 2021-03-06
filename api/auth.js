const { authSecret } = require('../.env');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Dados Incompletos');
        }
        
        const user = await app.db('users')
            .where({ email: req.body.email })
            .first();
        
        if (!user) {
            res.status(404).send('User Not found');
        }
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).send();
            }
            
            const payload = { id: user.id }
            res.json({
                name: user.name,
                email: user.email,
                token: jwt.encode(payload, authSecret)
            })
        });
    }
    
    return { signin };

}