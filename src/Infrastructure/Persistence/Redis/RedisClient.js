const { createClient } = require('redis');
const config = require('src/config');

// config.redis.host contains full URL (e.g., redis://:password@host:6379 or redis://host:6379)
const redisClient = createClient({
  url: config.redis.host,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('Connected to Redis');
  }
}

module.exports = { redisClient, connectRedis };
