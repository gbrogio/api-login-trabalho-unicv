const JWTProvider = require('src/Infrastructure/Providers/JWTProvider');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) { 
    return res.status(401).json({ message: 'No token provided' });
  }

  JWTProvider.verifyToken(token, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;