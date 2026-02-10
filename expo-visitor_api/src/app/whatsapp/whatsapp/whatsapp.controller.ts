import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import type { Response } from 'express';

@Controller('whatsapp')
export class WhatsappController {
    constructor(private readonly whatsappService: WhatsappService) { }

    @Post('send')
    async sendWhatsAppMsg(@Body() body: any, @Res() res: Response) {
        try {

            const result = await this.whatsappService.sendWhatsAppMsgDynamic(body);
            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message,
            });
        }
    }
}
