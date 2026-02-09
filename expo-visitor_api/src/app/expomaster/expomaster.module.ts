import { Module } from '@nestjs/common';
import { ExpoMasterController } from './expomaster.controller';
import { ExpoMasterService } from './expomaster.service';

@Module({
    controllers: [ExpoMasterController],
    providers: [ExpoMasterService],
})
export class ExpoMasterModule { }
