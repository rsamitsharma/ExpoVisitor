import {
  ExpoMasterTable,
  VisitorMasterTable,
  DocumentMasterTable,
} from './tables';

export const TABLE_MAIN = [
  ExpoMasterTable,
  VisitorMasterTable,
  DocumentMasterTable,
];

export const SEQUELIZE_CONFIG = {
  MAIN_CONFIG: {
    logging: false,
    alter: true,
  },
  OTHER: {
    SYNC_TABLES: true,
  },
};
