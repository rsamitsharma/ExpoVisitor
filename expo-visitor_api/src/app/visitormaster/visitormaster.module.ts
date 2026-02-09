import { Module } from '@nestjs/common';
import { VisitorMasterController } from './visitormaster.controller';
import { VisitorMasterService } from './visitormaster.service';

@Module({
    controllers: [VisitorMasterController],
    providers: [VisitorMasterService],
})
export class VisitorMasterModule { }
