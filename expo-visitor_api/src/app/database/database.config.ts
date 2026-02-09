import {
  ExpoMasterTable,
  VisitorMasterTable,
  DocumentMasterTable,
  MailLogTable,
} from './tables';

export const TABLE_MAIN = [
  ExpoMasterTable,
  VisitorMasterTable,
  DocumentMasterTable,
  MailLogTable,
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
