module.exports = {
    directory: __dirname,

    redisPort: process.env.REDIS_PORT || 6379,
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisAuth: process.env.REDIS_AUTH || null
};