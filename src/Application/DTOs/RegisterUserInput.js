class RegisterUserInput {
  constructor(name, email, password) {
    if (!name || !email || !password) {
      throw new Error('Email and password are required');
    }

    this.name = name;
    this.email = email;
    this.password = password;
  }
}

module.exports = RegisterUserInput;
