const jwt = require('jsonwebtoken');

const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    }
    catch (err) {
        return null;
    }
};

const generateTokens = (payload) => {
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d'});
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m'});
    return { refreshToken, accessToken };
}

module.exports = { verifyToken, generateTokens };