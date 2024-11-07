const redis = require('redis');
const redisClient = redis.createClient({
    url: 'redis://localhost:6379',
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (error) => {
    console.error('Redis error:', error);
});

redisClient.connect().catch((err) => {
    console.error('Failed to connect to Redis:', err);
});

module.exports = redisClient;
