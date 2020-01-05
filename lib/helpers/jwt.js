const jwt = require('jsonwebtoken');

const JWT = {
    sign: (data, privateKey) => {
        return jwt.sign(data, privateKey, {
            algorithm: process.env.JWT_ALG,
            expiresIn: process.env.JWT_EXP_DURATION
        });
    },
    verify: (token, publicKey) => {
        let result
        try {
            result = jwt.verify(token, publicKey, {
                algorithms: [process.env.JWT_ALG]
            })
        } catch (error) {
            result = ""
        }
        return result;
    }
}

module.exports = JWT;
