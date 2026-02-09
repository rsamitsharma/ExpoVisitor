import * as path from 'path';

export const ASSETS_CONFIG = {
    // The physical path where files are stored
    // Change this to your desired absolute path, e.g., 'C:\\inetpub\\wwwroot\\assets'
    STORAGE_PATH: path.join(process.cwd(), 'assets'),

    // The URL prefix used to access these files via HTTP
    URL_PREFIX: '/assets/',

    // The prefix stored in the database for the image path
    // This should match the URL_PREFIX but without leading/trailing slashes if your frontend appends it to base URL
    DB_PATH_PREFIX: 'assets',
};
