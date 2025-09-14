const jwt = require('jsonwebtoken');
const config = require('src/config');

class JWTProvider {
  generateToken(payload) {
    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  }

  static verifyToken(token, callback) {
    return jwt.verify(token, config.jwt.secret, callback);
  }

  getTokenExpiration(token) {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      throw new Error('Invalid token');
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp - currentTime;
  }
}

module.exports = JWTProvider;