import { Sequelize } from 'sequelize-typescript';
import { DB_CONFIG } from '../environment/environment';
import { Transaction } from 'sequelize';
import { Logger } from '@nestjs/common';
import { SEQUELIZE_CONFIG, TABLE_MAIN } from './database.config';

export let sequelize: any;

export const databaseproviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const config = DB_CONFIG.DATABASE_CONFIG;
      sequelize = new Sequelize({
        dialect: 'postgres',
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      });

      await sequelize
        .authenticate()
        .then(() => {
          Logger.log('Connection has been established successfully.');
        })
        .catch((error: any) => {
          Logger.error('Unable to connect to the database: ', error);
          Logger.error(error.message);
        });

      sequelize.addModels([...TABLE_MAIN]);

      //     if (!SEQUELIZE_CONFIG.MAIN_CONFIG.alter) {
      //     new AccountAssociations();
      //     new MasterAssociations();
      //     new ClientAssociations();
      //     new StoneAssociations();
      //   }

      if (SEQUELIZE_CONFIG.MAIN_CONFIG.alter) {
        // ALTER TABLE (if needed)
        if (SEQUELIZE_CONFIG.OTHER.SYNC_TABLES)
          await sequelize.sync(SEQUELIZE_CONFIG.MAIN_CONFIG); // Don't execute the
      }

      return sequelize;
    },
  },
];
