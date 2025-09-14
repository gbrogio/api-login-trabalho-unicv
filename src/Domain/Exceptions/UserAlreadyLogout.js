class UserAlreadyLogout extends Error { 
  constructor(message) { 
    super(message);
    this.name = 'UserAlreadyLogout';
    this.statusCode = 400;
  }
}

module.exports = UserAlreadyLogout;
