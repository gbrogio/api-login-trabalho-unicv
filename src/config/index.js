require('dotenv').config();

module.exports = {
  server: { port: process.env.PORT || 3000 },
  db: { dialect: process.env.DB_DIALECT || 'postgres', url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/exemplo_node' },
  jwt: { secret: process.env.JWT_SECRET || 'supersecretjwtkey', expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
  redis: { url: process.env.REDIS_HOST || 'redis://localhost:6379', password: process.env.REDIS_PASSWORD || null },
};
