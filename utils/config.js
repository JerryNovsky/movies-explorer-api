const { JWT_SECRET = 'JWT_SECRET' } = process.env;
const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/movie-explorer-db' } = process.env;

module.exports = { JWT_SECRET, DB_ADDRESS };
