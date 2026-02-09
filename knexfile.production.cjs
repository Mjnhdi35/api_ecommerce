const { config } = require('dotenv');
const { expand } = require('dotenv-expand');

// Load .env
const envConfig = config();
expand(envConfig);

// SSL configuration for Neon/Production
const isProduction = process.env.NODE_ENV === 'production';
const connection = process.env.DATABASE_URL;

if (!connection) {
    // Silent fail in build step if needed, but runtime should have it
    console.warn('DATABASE_URL is not defined');
}

module.exports = {
    client: 'pg',
    connection: isProduction
        ? { connectionString: connection, ssl: { rejectUnauthorized: false } }
        : connection,
    migrations: {
        directory: './dist/database/migrations', // Load compiled JS migrations
        extension: 'js',
        loadExtensions: ['.js'],
    },
    seeds: {
        directory: './dist/database/seeds',
        extension: 'js',
        loadExtensions: ['.js'],
    },
    pool: {
        min: 0,
        max: 10
    }
};
