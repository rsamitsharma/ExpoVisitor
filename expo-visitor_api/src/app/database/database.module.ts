import { Module } from '@nestjs/common';
import { databaseproviders } from './database.providers';

@Module({
  providers: [...databaseproviders],
  exports: [...databaseproviders],
})
export class DatabaseModule {}
