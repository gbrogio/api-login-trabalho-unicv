const AuthOutput = require('src/Application/DTOs/UserOutput');
const InvalidCredentialsException = require('src/Domain/Exceptions/InvalidCredentialsException');
const User = require('src/Domain/User/User');

class LoginUser {
  constructor(userRepository, jwtProvider) {
    this.userRepository = userRepository;
    this.jwtProvider = jwtProvider;
  }

  async execute(input) {
    const userEntity = await this.userRepository.findByEmail(input.email);
    if (!userEntity) {
      throw new InvalidCredentialsException('Invalid email or password');
    }
    
    const user = new User(userEntity.name, userEntity.email, userEntity.password, userEntity.id);
    const isPasswordValid = await user.comparePassword(input.password);

    if (!isPasswordValid) {
      throw new InvalidCredentialsException('Invalid email or password');
    }

    const userObj = user.toObject();
    const token = this.jwtProvider.generateToken({ userId: userObj.id, email: userObj.email });

    return new AuthOutput(token, {
      id: userObj.id,
      name: userObj.name,
      email: userObj.email,
    });
  }
}

module.exports = LoginUser;
