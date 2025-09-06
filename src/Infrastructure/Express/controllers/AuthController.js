const RegisterUserInput = require('src/Application/DTOs/RegisterUserInput');
const LoginUserInput = require('src/Application/DTOs/LoginUserInput');
const jwt = require('jsonwebtoken');

class AuthController {
  constructor(registerUserUseCase, loginUserUseCase, tokenBlacklistRepository, jwtProvider) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
    this.tokenBlacklistRepository = tokenBlacklistRepository;
    this.jwtProvider = jwtProvider;
  }

  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const input = new RegisterUserInput(name, email, password);
      const userOutput = await this.registerUserUseCase.execute(input);
      return res.status(201).json(userOutput);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const input = new LoginUserInput(email, password);
      const authOutput = await this.loginUserUseCase.execute(input);
      return res.status(200).json(authOutput);
    } catch (error) {
      next(error);
    }
  }
  async logout(req, res, next) {
    try {
      const authHeader = req.headers['authorization'] || req.headers['Authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
      }

      const token = authHeader.substring(7);
      // Verify token to ensure it's valid and to read exp
      const payload = this.jwtProvider.verifyToken(token);
      if (!payload) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // exp is in seconds since epoch
      const now = Math.floor(Date.now() / 1000);
      const exp = payload.exp || now;
      const ttl = Math.max(exp - now, 1);

      await this.tokenBlacklistRepository.add(token, ttl);

      return res.status(200).json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
