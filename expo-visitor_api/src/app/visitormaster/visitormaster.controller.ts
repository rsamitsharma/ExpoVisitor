import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VisitorMasterService } from './visitormaster.service';
import { CreateVisitorMasterDto, UpdateVisitorMasterDto, DeleteVisitorMasterDto } from '../models/dto/visitormaster.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Visitor Master')
@Controller('visitormaster')
export class VisitorMasterController {
    constructor(private readonly visitorMasterService: VisitorMasterService) { }

    @Post('add')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    async add(@Body() data: CreateVisitorMasterDto, @UploadedFile() file: Express.Multer.File) {
        try {
            const response = await this.visitorMasterService.add(data, file);
            return {
                message: 'Visitor Master added successfully',
                data: response,
            }
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.NOT_IMPLEMENTED);
        }
    }

    @Post('update')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    async update(@Body() data: UpdateVisitorMasterDto, @UploadedFile() file: Express.Multer.File) {
        try {
            const response = await this.visitorMasterService.update(data, file);
            return {
                message: 'Visitor Master updated successfully',
                data: response,
            }
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.NOT_IMPLEMENTED);
        }
    }

    @Post('delete')
    async delete(@Body() data: DeleteVisitorMasterDto) {
        try {
            const response = await this.visitorMasterService.delete(data);
            return {
                message: 'Visitor Master deleted successfully',
                data: response,
            }
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.NOT_IMPLEMENTED);
        }
    }

    @Get('get')
    async get(@Query('id') id?: number) {
        try {
            const response = await this.visitorMasterService.get(id);
            return {
                message: 'Visitor Master fetched successfully',
                data: response,
            }
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.NOT_IMPLEMENTED);
        }
    }

    @Get('getAll')
    async getAll() {
        try {
            const response = await this.visitorMasterService.getAll();
            return {
                message: 'Visitor Master fetched successfully',
                data: response,
            }
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.NOT_IMPLEMENTED);
        }
    }

    @Post('addDocument')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('document'))
    async addDocument(
        @Body() data: { VisitorID: number; ExpoID: number; DocumentType?: string },
        @UploadedFile() file: Express.Multer.File
    ) {
        try {
            const visitorId = typeof data.VisitorID === 'string' ? parseInt(data.VisitorID, 10) : data.VisitorID;
            const expoId = typeof data.ExpoID === 'string' ? parseInt(data.ExpoID, 10) : data.ExpoID;
            const response = await this.visitorMasterService.addDocument(visitorId, expoId, file, data.DocumentType);
            return {
                message: 'Document added successfully',
                data: response,
            }
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.NOT_IMPLEMENTED);
        }
    }

    @Get('getDocuments')
    async getDocuments(@Query('visitorId') visitorId: number) {
        try {
            const id = typeof visitorId === 'string' ? parseInt(visitorId, 10) : visitorId;
            const response = await this.visitorMasterService.getDocuments(id);
            return {
                message: 'Documents fetched successfully',
                data: response,
            }
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.NOT_IMPLEMENTED);
        }
    }
}
