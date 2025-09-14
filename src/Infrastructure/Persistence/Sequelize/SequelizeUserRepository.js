const UserModel = require("./models/UserModel");

const IUserRepository = require("src/Domain/Repositories/IUserRepository");

class SequelizeUserRepository extends IUserRepository {
  async findByEmail(email) { 
    if (typeof email !== 'string') throw new Error('Email must be a string');

    const userRecord = await UserModel.findOne({ where: { email: email } });
    if (!userRecord) return null;

    return {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      password: userRecord.password,
    };
  }

  async save(user) {
    await UserModel.create({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    })
  }
}

module.exports = SequelizeUserRepository;
