import * as dotenv from 'dotenv';
dotenv.config();

interface DatabaseConfig {
  username?: string;
  password?: string;
  database?: string;
  host?: string;
  port?: number;
  dialect?: string;
  urlDatabase?: string;
  logging?: boolean;
  dialectOptions?: any;
}

interface Environment {
  JWTKEY: string;
  TOKEN_EXPIRATION: string;
  SECRET_KEY: string;
  PORT: string;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
  DATABASE_CONFIG: DatabaseConfig;
}
const DB_CONFIG: Environment = {
  JWTKEY: '',
  TOKEN_EXPIRATION: '',
  SECRET_KEY: '',
  PORT: '',
  EMAIL_USER: '',
  EMAIL_PASSWORD: '',
  DATABASE_CONFIG: {},
};
const DATA_BASE = process.env.PLATFORM || 'Development';
enum CONFIG {
  DEVELOPMENT = 'Development',
  PRODUCTION = 'Production',
}

interface EnvMode {
  mode: 'Development' | 'Production';
}

const MODE: EnvMode = {
  mode: 'Development',
};

switch (DATA_BASE) {
  case CONFIG.DEVELOPMENT:
    DB_CONFIG.JWTKEY =
      '404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970';
    DB_CONFIG.TOKEN_EXPIRATION = '1w';
    DB_CONFIG.SECRET_KEY = 'Development';
    MODE.mode = 'Development';
    console.log('Development 1');
    DB_CONFIG.DATABASE_CONFIG = {
      dialect: 'postgres',
      port: 5432,
      host: '192.168.27.3',
      username: 'postgres',
      password: '1234',
      database: 'ExpoVisitor',
    };
    break;
  case CONFIG.PRODUCTION:
    DB_CONFIG.JWTKEY =
      '404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970';
    DB_CONFIG.TOKEN_EXPIRATION = '1w';
    DB_CONFIG.SECRET_KEY = 'Production';
    MODE.mode = 'Production';
    console.log('Production 1');
    DB_CONFIG.DATABASE_CONFIG = {
      dialect: 'postgres',
      port: 5432,
      host: '192.168.27.3',
      username: 'postgres',
      password: '1234',
      database: 'ExpoVisitor',
    };
    break;
}

export { DB_CONFIG, MODE };
