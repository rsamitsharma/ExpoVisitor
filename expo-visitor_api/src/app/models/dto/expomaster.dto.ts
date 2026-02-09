import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateExpoMasterDto {
  @ApiProperty({ description: 'Expo Name' })
  @IsString()
  ExpoName: string;

  @ApiProperty({ description: 'Expo Start Date' })
  @IsDateString()
  StartDate: Date;

  @ApiProperty({ description: 'Expo End Date' })
  @IsDateString()
  EndDate: Date;
}

export class UpdateExpoMasterDto {
  @ApiProperty({ description: 'Expo ID' })
  @IsNumber()
  ExpoID: number;

  @ApiProperty({ description: 'Expo Name' })
  @IsOptional()
  @IsString()
  ExpoName?: string;

  @ApiProperty({ description: 'Expo Start Date' })
  @IsOptional()
  @IsDateString()
  StartDate?: Date;

  @ApiProperty({ description: 'Expo End Date' })
  @IsOptional()
  @IsDateString()
  EndDate?: Date;

  @ApiProperty({ description: 'Is Active' })
  @IsOptional()
  @IsBoolean()
  IsActive?: boolean;
}

export class DeleteExpoMasterDto {
  @ApiProperty({ description: 'Expo ID' })
  @IsNumber()
  ExpoID: number;
}
