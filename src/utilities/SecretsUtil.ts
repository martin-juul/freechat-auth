import * as dotenv from 'dotenv';
import * as fs from 'fs';
import logger from './LoggerUtil';

if (fs.existsSync('.env')) {
    dotenv.config({ path: '.env' })
} else {
    console.error('[SecretsUtil](environment): Missing .env file!')
}

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production';

export const SESSION_SECRET = process.env['SESSION_SECRET'];

if (!SESSION_SECRET) {
    logger.error('No client secret. Set SESSION_SECRET environment variable.');
}
