import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './app/database/database.module';
import { ExpoMasterModule } from './app/expomaster/expomaster.module';
import { VisitorMasterModule } from './app/visitormaster/visitormaster.module';
import { MailModule } from './app/mail/mail.module';
import { WhatsappModule } from './app/whatsapp/whatsapp/whatsapp.module';

@Module({
  imports: [DatabaseModule, ExpoMasterModule, VisitorMasterModule, MailModule, WhatsappModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
