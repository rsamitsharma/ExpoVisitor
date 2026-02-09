import { Injectable } from '@nestjs/common';
import { ExpoMasterTable } from '../database/tables/expomaster.table';
import { CreateExpoMasterDto, UpdateExpoMasterDto, DeleteExpoMasterDto } from '../models/dto/expomaster.dto';

@Injectable()
export class ExpoMasterService {
    async add(data: CreateExpoMasterDto): Promise<ExpoMasterTable> {
        return await ExpoMasterTable.create({ ...data } as any);
    }

    async update(data: UpdateExpoMasterDto): Promise<any> {
        const { ExpoID, ...rest } = data;
        if (!ExpoID) {
            throw new Error('ExpoID is required for update');
        }
        return await ExpoMasterTable.update(rest as any, {
            where: { RID: ExpoID } as any,
        });
    }

    async get(id?: number): Promise<ExpoMasterTable[]> {
        if (id) {
            const result = await ExpoMasterTable.findByPk(id);
            return result ? [result] : [];
        }
        return await ExpoMasterTable.findAll({
            order: [['CreatedDate', 'DESC']],
        });
    }

    async getAll(): Promise<ExpoMasterTable[]> {
        return await ExpoMasterTable.findAll({
            order: [['CreatedDate', 'DESC']],
        });
    }

    async delete(data: DeleteExpoMasterDto): Promise<any> {
        const { ExpoID } = data;
        if (!ExpoID) {
            throw new Error('ExpoID is required for delete');
        }
        return await ExpoMasterTable.destroy({
            where: { RID: ExpoID } as any,
        });
    }
}
