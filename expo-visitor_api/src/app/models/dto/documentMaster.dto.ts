import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDocumentMasterDto {
    @ApiProperty({ description: 'Expo ID' })
    @IsNumber()
    ExpoID: number;

    @ApiProperty({ description: 'Visitor ID' })
    @IsNumber()
    VisitorID: number;

    @ApiProperty({ description: 'Document Type (Visiting Card, Proposal, etc.)' })
    @IsString()
    DocumentType: string;

    @ApiProperty({ description: 'Document Name' })
    @IsString()
    DocumentName: string;

    @ApiProperty({ description: 'Document File Path / URL' })
    @IsString()
    DocumentPath: string;
}


export class UpdateDocumentMasterDto {
    @ApiProperty({ description: 'Document ID' })
    @IsNumber()
    DocumentID: number;

    @ApiProperty({ description: 'Document Type' })
    @IsOptional()
    @IsString()
    DocumentType?: string;

    @ApiProperty({ description: 'Document Name' })
    @IsOptional()
    @IsString()
    DocumentName?: string;

    @ApiProperty({ description: 'Document File Path / URL' })
    @IsOptional()
    @IsString()
    DocumentPath?: string;

    @ApiProperty({ description: 'Is Active' })
    @IsOptional()
    @IsBoolean()
    IsActive?: boolean;
}
