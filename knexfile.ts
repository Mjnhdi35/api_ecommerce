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

export default {
    client: 'pg',
    connection,
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
