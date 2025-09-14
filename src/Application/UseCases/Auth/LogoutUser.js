const UserAlreadyLogout = require('src/Domain/Exceptions/UserAlreadyLogout');

class LogoutUser {
  constructor(userRepository, jwtProvider, tokenBlacklistRepository) {
    this.userRepository = userRepository;
    this.jwtProvider = jwtProvider;
    this.tokenBlacklistRepository = tokenBlacklistRepository;
  }

  async execute(input) {
    if (this.tokenBlacklistRepository.exists(input.token)) {
      throw new UserAlreadyLogout('User already logged out');
    }

    await this.tokenBlacklistRepository.add(input.token, this.jwtProvider.getTokenExpiration(input.token));
    return { message: 'Logout successful' };
  }
}

module.exports = LogoutUser;
