const RedisTokenBlacklistRepository = require('src/Infrastructure/Persistence/Redis/RedisTokenBlacklistRepository');
const JWTProvider = require('src/Infrastructure/Providers/JWTProvider');

const blacklistRepo = new RedisTokenBlacklistRepository();
const jwtProvider = new JWTProvider();

async function authenticateToken(req, res, next) {
	try {
		const authHeader = req.headers['authorization'] || req.headers['Authorization'];
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ message: 'Token ausente' });
		}

		const token = authHeader.substring(7);

		// Check blacklist first
		const isBlacklisted = await blacklistRepo.isBlacklisted(token);
		if (isBlacklisted) {
			return res.status(401).json({ message: 'Token revogado' });
		}

		const payload = jwtProvider.verifyToken(token);
		if (!payload) {
			return res.status(401).json({ message: 'Token inválido' });
		}

		req.user = { id: payload.userId, email: payload.email };
		req.token = token;
		return next();
	} catch (err) {
		return res.status(401).json({ message: 'Não autorizado' });
	}
}

module.exports = authenticateToken;
