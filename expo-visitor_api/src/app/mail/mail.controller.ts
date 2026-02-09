import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { SendVisitorConfirmationDto, MailLogQueryDto } from '../models/dto/mail.dto';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Post('send-visitor-confirmation')
    async sendVisitorConfirmation(@Body() data: SendVisitorConfirmationDto) {
        try {
            const result = await this.mailService.sendVisitorConfirmation(data);
            return {
                message: result.Status === 'Sent'
                    ? 'Confirmation email sent successfully'
                    : 'Email queued but sending failed',
                data: result,
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to send confirmation email',
                error?.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('logs')
    async getLogs(
        @Query('status') status?: string,
        @Query('expoId') expoId?: number,
        @Query('limit') limit?: number
    ) {
        try {
            const query: MailLogQueryDto = {};
            if (status) query.status = status;
            if (expoId) query.expoId = typeof expoId === 'string' ? parseInt(expoId, 10) : expoId;
            if (limit) query.limit = typeof limit === 'string' ? parseInt(limit as any, 10) : limit;

            const logs = await this.mailService.getLogs(query);
            return {
                message: 'Mail logs fetched successfully',
                data: logs,
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to fetch mail logs',
                error?.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('log')
    async getLog(@Query('id') id: number) {
        try {
            const logId = typeof id === 'string' ? parseInt(id as any, 10) : id;
            const log = await this.mailService.getLogById(logId);
            if (!log) {
                throw new HttpException('Mail log not found', HttpStatus.NOT_FOUND);
            }
            return {
                message: 'Mail log fetched successfully',
                data: log,
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to fetch mail log',
                error?.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('logs-by-visitor')
    async getLogsByVisitor(@Query('visitorId') visitorId: number) {
        try {
            const id = typeof visitorId === 'string' ? parseInt(visitorId as any, 10) : visitorId;
            const logs = await this.mailService.getLogsByVisitor(id);
            return {
                message: 'Visitor mail logs fetched successfully',
                data: logs,
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to fetch visitor mail logs',
                error?.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
