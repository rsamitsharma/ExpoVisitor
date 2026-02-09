import { Injectable } from '@nestjs/common';
import { VisitorMasterTable } from '../database/tables/visitormaster.table';
import { DocumentMasterTable } from '../database/tables/documentmaster.table';
import { CreateVisitorMasterDto, UpdateVisitorMasterDto, DeleteVisitorMasterDto } from '../models/dto/visitormaster.dto';
import * as fs from 'fs';
import * as path from 'path';
import { ASSETS_CONFIG } from '../../config';

@Injectable()
export class VisitorMasterService {
    async add(data: CreateVisitorMasterDto, file?: Express.Multer.File): Promise<VisitorMasterTable> {
        const { image, ...rest } = data;
        // Convert ExpoID to number if it's a string (from form-data)
        const visitorData = {
            ...rest,
            ExpoID: typeof rest.ExpoID === 'string' ? parseInt(rest.ExpoID, 10) : rest.ExpoID,
        };

        const created = await VisitorMasterTable.create(visitorData as any);

        if (!created) {
            throw new Error('Failed to create visitor record');
        }

        // Ensure we have the RID
        let rid = created.RID;
        if (rid === undefined || rid === null) {
            rid = (created as any).dataValues?.RID;
        }

        if (rid === undefined || rid === null) {
            // Try reloading if supported
            try {
                await created.reload();
                rid = created.RID;
            } catch (e) {
                console.error('Failed to reload created record', e);
            }
        }

        if (rid === undefined || rid === null) {
            console.error('Created visitor record but could not retrieve RID:', created);
            throw new Error('Failed to retrieve visitor ID after creation');
        }

        if (file) {
            const assetsPath = path.join(ASSETS_CONFIG.STORAGE_PATH, rid.toString());
            if (!fs.existsSync(assetsPath)) {
                fs.mkdirSync(assetsPath, { recursive: true });
            }

            // Sanitize filename
            const safeFilename = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const filePath = path.join(assetsPath, safeFilename);
            fs.writeFileSync(filePath, file.buffer);

            const imagePath = `${ASSETS_CONFIG.DB_PATH_PREFIX}/${rid}/${safeFilename}`;

            // Update visitor's ImagePath
            await VisitorMasterTable.update(
                { ImagePath: imagePath } as any,
                { where: { RID: rid } as any }
            );

            // Update the instance we return
            created.setDataValue('ImagePath' as any, imagePath);
            (created as any).ImagePath = imagePath;

            await DocumentMasterTable.create({
                ExpoID: visitorData.ExpoID,
                VisitorID: rid,
                DocumentType: 'ProfileImage',
                DocumentName: file.originalname, // Keep original name for display if needed
                DocumentPath: imagePath,
            } as any);
        }

        return created;
    }

    async addDocument(visitorId: number, expoId: number, file: Express.Multer.File, documentType: string = 'Document'): Promise<any> {
        const assetsPath = path.join(ASSETS_CONFIG.STORAGE_PATH, visitorId.toString());
        if (!fs.existsSync(assetsPath)) {
            fs.mkdirSync(assetsPath, { recursive: true });
        }

        const safeFilename = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = path.join(assetsPath, safeFilename);
        fs.writeFileSync(filePath, file.buffer);

        return await DocumentMasterTable.create({
            ExpoID: expoId,
            VisitorID: visitorId,
            DocumentType: documentType,
            DocumentName: file.originalname,
            DocumentPath: `${ASSETS_CONFIG.DB_PATH_PREFIX}/${visitorId}/${safeFilename}`,
        } as any);
    }

    async getDocuments(visitorId: number): Promise<any[]> {
        return await DocumentMasterTable.findAll({
            where: { VisitorID: visitorId } as any,
            order: [['CreatedDate', 'DESC']],
        });
    }

    async update(data: UpdateVisitorMasterDto, file?: Express.Multer.File): Promise<any> {
        const { VisitorID, image, ...rest } = data;
        if (!VisitorID) {
            throw new Error('VisitorID is required for update');
        }

        const updateResult = await VisitorMasterTable.update(rest as any, {
            where: { RID: VisitorID } as any,
        });

        if (file) {
            const assetsPath = path.join(ASSETS_CONFIG.STORAGE_PATH, VisitorID.toString());
            if (!fs.existsSync(assetsPath)) {
                fs.mkdirSync(assetsPath, { recursive: true });
            }

            const safeFilename = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const filePath = path.join(assetsPath, safeFilename);
            fs.writeFileSync(filePath, file.buffer);

            // Fetch ExpoID if not provided in data
            let expoId = data.ExpoID;
            if (!expoId) {
                const visitor = await VisitorMasterTable.findByPk(VisitorID);
                if (visitor) {
                    expoId = visitor.ExpoID;
                }
            }

            if (!expoId) {
                console.warn('Could not determine ExpoID for document upload during visitor update');
                // Fallback or throw? For now, let's try to proceed but it might fail if DB constraint is strict
            }

            // Check if document exists, if not create, else update or just add new? 
            // Assuming we add a new document entry for the new file or update existing if same name?
            // For simplicity, let's add a new entry.
            await DocumentMasterTable.create({
                ExpoID: expoId,
                VisitorID: VisitorID,
                DocumentType: 'Image',
                DocumentName: file.originalname,
                DocumentPath: `${ASSETS_CONFIG.DB_PATH_PREFIX}/${VisitorID}/${safeFilename}`,
            } as any);

            await VisitorMasterTable.update(
                { ImagePath: `${ASSETS_CONFIG.DB_PATH_PREFIX}/${VisitorID}/${safeFilename}` } as any,
                { where: { RID: VisitorID } as any }
            );
        }

        return updateResult;
    }

    async delete(data: DeleteVisitorMasterDto): Promise<any> {
        const { VisitorID } = data;
        if (!VisitorID) {
            throw new Error('VisitorID is required for delete');
        }
        return await VisitorMasterTable.destroy({
            where: { RID: VisitorID } as any,
        });
    }

    async get(id?: number): Promise<VisitorMasterTable[]> {
        if (id) {
            const result = await VisitorMasterTable.findByPk(id);
            return result ? [result] : [];
        }
        return await VisitorMasterTable.findAll({
            order: [['CreatedDate', 'DESC']],
        });
    }

    async getAll(): Promise<VisitorMasterTable[]> {
        return await VisitorMasterTable.findAll({
            order: [['CreatedDate', 'DESC']],
        });
    }
}
