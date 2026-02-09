import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

// Load .env
const envConfig = config();
expand(envConfig);

// Get config
const connection = process.env.DATABASE_URL;

if (!connection) {
    throw new Error('DATABASE_URL is not defined in .env');
}

const isProduction = process.env.NODE_ENV === 'production';

// Neon requires SSL in production
const ssl = isProduction ? { rejectUnauthorized: false } : undefined;

export default {
    client: 'pg',
    connection: isProduction ? { connectionString: connection, ssl } : connection,
    migrations: {
        directory: './src/database/migrations',
        extension: 'ts',
        loadExtensions: ['.ts'],
    },
    seeds: {
        directory: './src/database/seeds',
        extension: 'ts',
        loadExtensions: ['.ts'],
    },
};
