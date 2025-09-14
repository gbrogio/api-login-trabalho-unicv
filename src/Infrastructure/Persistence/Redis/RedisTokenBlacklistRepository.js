const { redisClient } = require("./RedisClient");
const ITokenBlacklistRepository = require("src/Domain/Repositories/ITokenBlackListRepository");

class RedisTokenBlacklistRepository extends ITokenBlacklistRepository { 
  async add(token, expiresIn) {
    await redisClient.set(token, 'blacklisted', {
      expiration: {
        type: 'EX',
        value: expiresIn
      }
    })
  }

  async exists(token) {
    const key = await redisClient.get(token);
    return key === 'blacklisted';
  }
}

module.exports = RedisTokenBlacklistRepository;
