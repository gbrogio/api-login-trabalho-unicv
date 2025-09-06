const { redisClient } = require('./RedisClient');

class RedisTokenBlacklistRepository {
    constructor(prefix = 'blacklist:') {
        this.client = redisClient;
        this.prefix = prefix;
    }

    key(token) {
        return `${this.prefix}${token}`;
    }

    async add(token, ttlSeconds) {
        const key = this.key(token);
        // Set value with TTL in seconds
        await this.client.set(key, '1', { EX: ttlSeconds });
    }

    async isBlacklisted(token) {
        const key = this.key(token);
        const result = await this.client.get(key);
        return result !== null;
    }
}

module.exports = RedisTokenBlacklistRepository;
