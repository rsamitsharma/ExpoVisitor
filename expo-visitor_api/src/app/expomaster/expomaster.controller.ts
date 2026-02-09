import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { ExpoMasterService } from './expomaster.service';
import { CreateExpoMasterDto, UpdateExpoMasterDto, DeleteExpoMasterDto } from '../models/dto/expomaster.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Expo Master')
@Controller('expomaster')
export class ExpoMasterController {
    constructor(private readonly expoMasterService: ExpoMasterService) { }

    @Post('add')
    async add(@Body() data: CreateExpoMasterDto) {
        try {
            const response = await this.expoMasterService.add(data);
            return {
                message: 'Expo Master added successfully',
                data: response,
            }
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.NOT_IMPLEMENTED);
        }

    }

    @Post('update')
    async update(@Body() data: UpdateExpoMasterDto) {
        try {
            const response = await this.expoMasterService.update(data);
            return {
                message: 'Expo Master updated successfully',
                data: response,
            }
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.NOT_IMPLEMENTED);
        }
    }

    @Post('delete')
    async delete(@Body() data: DeleteExpoMasterDto) {
        try {
            const response = await this.expoMasterService.delete(data);
            return {
                message: 'Expo Master deleted successfully',
                data: response,
            }
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.NOT_IMPLEMENTED);
        }
    }

    @Get('get')
    async get(@Query('id') id?: number) {
        try {
            const response = await this.expoMasterService.get(id);
            return {
                message: 'Expo Master fetched successfully',
                data: response,
            }
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.NOT_IMPLEMENTED);
        }
    }

    @Get('getAll')
    async getAll() {
        try {
            const response = await this.expoMasterService.getAll();
            return {
                message: 'Expo Master fetched successfully',
                data: response,
            }
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.NOT_IMPLEMENTED);
        }
    }
}
