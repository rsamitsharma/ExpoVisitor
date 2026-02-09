import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './app/database/database.module';
import { ExpoMasterModule } from './app/expomaster/expomaster.module';
import { VisitorMasterModule } from './app/visitormaster/visitormaster.module';

@Module({
  imports: [DatabaseModule, ExpoMasterModule, VisitorMasterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
