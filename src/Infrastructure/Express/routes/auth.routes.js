const express = require('express');
const AuthController = require('src/Infrastructure/Express/controllers/AuthController');
const validationMiddleware = require('src/Infrastructure/Express/middlewares/validationMiddleware');
const authMiddleware = require('src/Infrastructure/Express/middlewares/AuthMiddleware');
const { loginSchema, registerSchema } = require('src/Infrastructure/Express/validationSchemas');

const RegisterUser = require('src/Application/UseCases/Auth/RegisterUser');
const LoginUser = require('src/Application/UseCases/Auth/LoginUser');
const SequelizeUserRepository = require('src/Infrastructure/Persistence/Sequelize/SequelizeUserRepository');
const JWTProvider = require('src/Infrastructure/Providers/JWTProvider');
const RedisTokenBlacklistRepository = require('src/Infrastructure/Persistence/Redis/RedisTokenBlacklistRepository');

const userRepository = new SequelizeUserRepository();
const jwtProvider = new JWTProvider();
const blacklistRepo = new RedisTokenBlacklistRepository();
const registerUserUseCase = new RegisterUser(userRepository);
const loginUserUseCase = new LoginUser(userRepository, jwtProvider);
const authController = new AuthController(registerUserUseCase, loginUserUseCase, blacklistRepo, jwtProvider);

const router = express.Router();

// Register route
router.post('/register', validationMiddleware(registerSchema), authController.register.bind(authController));

// Login route
router.post('/login', validationMiddleware(loginSchema), authController.login.bind(authController));

// Logout route (requires valid token)
router.post('/logout', authMiddleware, authController.logout.bind(authController));

// Simple protected route sample
router.get('/me', authMiddleware, (req, res) => {
	return res.json({ user: req.user });
});

module.exports = router;
